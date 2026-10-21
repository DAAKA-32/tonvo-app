import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: [
      "firebase/auth",
      "firebase/app",
      "@supabase/supabase-js",
      "framer-motion",
      "i18next",
      "react-i18next",
    ],
  },
  // Serve Firebase Auth's handler from tonvo.co so Google's sign-in screen says
  // "tonvo.co" instead of "cue-55815.firebaseapp.com" (Firebase "proxy auth
  // requests" setup). Requires NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tonvo.co and
  // https://tonvo.co/__/auth/handler in the OAuth client's redirect URIs.
  async rewrites() {
    return [
      { source: "/__/auth/:path*", destination: "https://cue-55815.firebaseapp.com/__/auth/:path*" },
      { source: "/__/firebase/:path*", destination: "https://cue-55815.firebaseapp.com/__/firebase/:path*" },
    ];
  },
  async headers() {
    // Content-Security-Policy — restricts where scripts, styles, images, and
    // network calls can come from. Tuned for Firebase Auth, Supabase, Stripe,
    // Meta Pixel, and the in-app Next runtime.
    //
    // - 'unsafe-inline'/'unsafe-eval' kept on script-src because Next.js injects
    //   inline bootstrap scripts. Removing them would require nonces wired
    //   through every page render; tracked as future hardening.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://connect.facebook.net https://www.googletagmanager.com https://apis.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: https://www.facebook.com https://*.supabase.co https://lh3.googleusercontent.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com https://api.stripe.com https://api.openai.com https://api.anthropic.com https://streaming.assemblyai.com wss://streaming.assemblyai.com https://api.assemblyai.com https://graph.facebook.com https://www.facebook.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.firebaseapp.com",
      "media-src 'self' blob:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        // Everything except Firebase Auth's proxied pages (/__/auth/*, /__/firebase/*, see rewrites above).
        // Firebase loads tonvo.co/__/auth/iframe INSIDE our pages to receive the Google popup result:
        // X-Frame-Options DENY / frame-ancestors 'none' blocked it, so every Google sign-in ended in
        // auth/popup-closed-by-user ("Sign-in cancelled"). Those pages keep Firebase's own headers.
        source: "/((?!__/).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(), payment=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // One canonical host. Firebase's auth domain is tonvo.co: on www.tonvo.co its auth iframe would be
      // cross-origin (blocked by frame-src 'self') and Google sign-in would fail.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tonvo.co" }],
        destination: "https://tonvo.co/:path*",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      // The feature page was renamed from "invisible" to "separate window" (the product is not invisible,
      // see docs/specs/conversation-copilot-audit.md). Permanent redirect keeps inbound links and rankings.
      {
        source: "/features/invisible-copilot-mode",
        destination: "/features/separate-window-copilot",
        permanent: true,
      },
      {
        source: "/fr/features/invisible-copilot-mode",
        destination: "/fr/features/separate-window-copilot",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
