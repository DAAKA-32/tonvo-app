import { auth } from "@/lib/firebase";

/**
 * Get the current Firebase user's ID token for API authentication.
 * Returns null if no user is signed in.
 */
export async function getAuthToken(): Promise<string | null> {
  if (!auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
}

/**
 * Build an Authorization header object with the Firebase ID token.
 * Returns empty object if no token is available (allows graceful degradation).
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Authenticated fetch wrapper for JSON API calls.
 * Automatically attaches the Firebase ID token as a Bearer token.
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, { ...options, headers });
}

/**
 * Authenticated fetch for FormData requests (no Content-Type header — browser sets it with boundary).
 * Automatically attaches the Firebase ID token as a Bearer token.
 */
export async function authFetchFormData(
  url: string,
  body: FormData,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, { ...options, headers, body });
}
