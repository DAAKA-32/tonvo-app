import { NextRequest } from "next/server";
import { createPublicKey, createVerify } from "crypto";

/**
 * Lightweight Firebase ID token verification for Next.js API routes.
 *
 * Verifies the JWT signature using Firebase/Google's public keys (RS256).
 * This avoids the heavy firebase-admin SDK dependency.
 *
 * The token is expected in the Authorization header as: Bearer <idToken>
 */

interface DecodedUser {
  uid: string;
  email: string | null;
}

interface JWTHeader {
  alg: string;
  kid: string;
  typ: string;
}

interface JWTPayload {
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email?: string;
  email_verified?: boolean;
  firebase?: {
    identities: Record<string, unknown>;
    sign_in_provider: string;
  };
}

// Cache Google's public keys (they rotate, but we cache for 1 hour)
let cachedKeys: Record<string, string> | null = null;
let cacheExpiry = 0;

const GOOGLE_CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

async function getGooglePublicKeys(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedKeys && now < cacheExpiry) return cachedKeys;

  const res = await fetch(GOOGLE_CERTS_URL);
  if (!res.ok) throw new Error("Failed to fetch Google public keys");

  cachedKeys = (await res.json()) as Record<string, string>;

  // Respect Cache-Control max-age, default to 1 hour
  const cacheControl = res.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 3600_000;
  cacheExpiry = now + maxAge;

  return cachedKeys!;
}

function base64UrlDecode(str: string): Buffer {
  // Replace URL-safe chars and add padding
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}

function decodeJWTPart<T>(part: string): T {
  const decoded = base64UrlDecode(part).toString("utf-8");
  return JSON.parse(decoded) as T;
}

/**
 * Verify a Firebase ID token and return the decoded user, or null if invalid.
 */
async function verifyFirebaseToken(
  token: string
): Promise<DecodedUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = decodeJWTPart<JWTHeader>(parts[0]);
    const payload = decodeJWTPart<JWTPayload>(parts[1]);

    // Validate header
    if (header.alg !== "RS256") return null;

    // Validate issuer
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.error("NEXT_PUBLIC_FIREBASE_PROJECT_ID not set");
      return null;
    }

    const expectedIssuer = `https://securetoken.google.com/${projectId}`;
    if (payload.iss !== expectedIssuer) return null;

    // Validate audience
    if (payload.aud !== projectId) return null;

    // Validate expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    // Validate issued-at (not in the future, with 5min tolerance)
    if (payload.iat > now + 300) return null;

    // Validate sub (must be non-empty)
    if (!payload.sub || typeof payload.sub !== "string") return null;

    // Verify signature using Google's public keys
    const keys = await getGooglePublicKeys();
    const certPem = keys[header.kid];
    if (!certPem) return null;

    // Extract public key from X.509 certificate using Node.js crypto
    const publicKey = createPublicKey(certPem);

    // Verify RS256 signature
    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${parts[0]}.${parts[1]}`);
    const signatureBuffer = base64UrlDecode(parts[2]);
    const valid = verifier.verify(publicKey, signatureBuffer);

    if (!valid) return null;

    return {
      uid: payload.sub,
      email: payload.email || null,
    };
  } catch (err) {
    console.error("Firebase token verification error:", err);
    return null;
  }
}

/**
 * Extract and verify the Firebase ID token from a NextRequest.
 * Returns the decoded user { uid, email } or null if unauthorized.
 */
export async function verifyAuth(
  req: NextRequest
): Promise<DecodedUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  if (!token) return null;

  return verifyFirebaseToken(token);
}
