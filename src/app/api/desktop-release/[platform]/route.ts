import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60;

const ALLOWED_PLATFORMS = new Set([
  "windows-x86_64",
  "darwin-aarch64",
  "darwin-x86_64",
  "linux-x86_64",
]);

interface ManifestEntry {
  url: string;
  signature: string;
}

interface Manifest {
  version: string;
  notes: string;
  pub_date: string;
  platforms: Record<string, ManifestEntry>;
}

async function readManifest(): Promise<Manifest> {
  const p = path.join(process.cwd(), "public", "desktop-releases", "latest.json");
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw) as Manifest;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  if (!ALLOWED_PLATFORMS.has(platform)) {
    return NextResponse.json({ error: "unknown platform" }, { status: 404 });
  }

  const manifest = await readManifest();
  const entry = manifest.platforms[platform];
  if (!entry) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json({
    version: manifest.version,
    notes: manifest.notes,
    pub_date: manifest.pub_date,
    url: entry.url,
    signature: entry.signature,
  });
}
