import type { Metadata } from "next";

// Global 404, used when no language or app layout matches (for example /xx). There are two root layouts
// (app and [locale]), so this page brings its own <html>. It is intentionally static and dependency free.
export const metadata: Metadata = {
  title: "Page not found | Tonvo",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" translate="no">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          background: "#09090b",
          color: "#a1a1aa",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <p style={{ margin: 0, fontSize: 14, letterSpacing: "0.12em", color: "#71717a" }}>404</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#fafafa" }}>Page not found</h1>
        <p style={{ margin: 0, maxWidth: 420 }}>This page does not exist, or it has moved.</p>
        <a
          href="/"
          style={{
            marginTop: 8,
            padding: "10px 20px",
            borderRadius: 999,
            color: "#fafafa",
            textDecoration: "none",
            fontWeight: 600,
            border: "1px solid rgba(52, 211, 153, 0.45)",
            background: "rgba(52, 211, 153, 0.12)",
          }}
        >
          Back to home
        </a>
      </body>
    </html>
  );
}
