import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale, isPublicPath } from "@/i18n/locales-config";

// Production allow-list. Vercel preview deployments are NOT auto-allowed
// because any attacker can mint an arbitrary <subdomain>.vercel.app and would
// then be able to make cross-origin requests from their own page.
const PROD_ORIGINS = new Set<string>([
  "https://tonvo.co",
  "https://www.tonvo.co",
  "https://cue-app.vercel.app",
]);

// Optional comma-separated list for additional trusted origins
// (e.g. internal staging URLs). Set in env, never expose to the client.
const EXTRA_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  if (PROD_ORIGINS.has(origin)) return true;
  if (EXTRA_ORIGINS.includes(origin)) return true;
  if (process.env.NODE_ENV === "development") {
    // Only localhost in dev — never wildcard *.vercel.app
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  }
  return false;
}

function handleApi(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const res = NextResponse.next();

  // Only set CORS headers for known origins. Unknown origins get no
  // Access-Control-Allow-Origin header, so the browser blocks the response.
  if (origin && isAllowedOrigin(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // We do NOT set Access-Control-Allow-Credentials — auth uses Bearer tokens,
    // not cookies. Keeping credentials off prevents cross-origin cookie leaks.
  }

  if (req.method === "OPTIONS") {
    // Preflight: if origin not allowed, deny. Otherwise echo the headers above.
    if (!origin || !isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

/**
 * Public pages are served under /[locale]. English has no prefix in the URL, so it is rewritten to /en
 * internally; other languages keep their /fr, /es... prefix. Duplicate and impossible URLs are redirected,
 * always in ONE hop:
 *  - /en/about            -> /about (one canonical URL for English)
 *  - /fr/dashboard        -> /dashboard (a localized URL of a page that is not public)
 *  - /FR, /Fr/About, /About -> /fr, /fr/about, /about
 *
 * The lower-casing matters beyond tidiness: the [locale] route matches "FR" to the prerendered "/fr" entry
 * case-insensitively, then the layout answers 404 for "FR" and that 404 gets written over the cached real
 * page. Public paths are lower case by construction, so any other case is redirected before it can match.
 */
function handleLocale(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const redirect = (to: string) => {
    const url = req.nextUrl.clone();
    url.pathname = to;
    return NextResponse.redirect(url, 308);
  };

  const [, firstRaw, ...restRaw] = pathname.split("/");
  const first = (firstRaw ?? "").toLowerCase();
  // Case is only normalized for the public site. The app keeps its paths as they are (ids are case sensitive).
  const rest = "/" + restRaw.join("/");
  const restLower = rest.toLowerCase();

  if (isLocale(first)) {
    if (first === DEFAULT_LOCALE) return redirect(isPublicPath(restLower) ? restLower : rest);
    if (!isPublicPath(restLower)) return redirect(rest);
    const canonical = restLower === "/" ? `/${first}` : `/${first}${restLower}`;
    return canonical === pathname ? NextResponse.next() : redirect(canonical);
  }

  const lower = pathname.toLowerCase();
  if (isPublicPath(lower)) {
    if (lower !== pathname) return redirect(lower);
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : "/en" + pathname;
    url.search = search;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) return handleApi(req);
  return handleLocale(req);
}

export const config = {
  // API routes (CORS) and every page path; static files and Next internals are excluded.
  matcher: ["/api/:path*", "/((?!_next/|api/|.*\\..*).*)"],
};
