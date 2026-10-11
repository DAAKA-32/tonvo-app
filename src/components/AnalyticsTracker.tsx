"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/client";

/**
 * Mounted once in the root layout. Records a page view on every route change and every click on a
 * "Start free / Get started" link (any link to /login), labelled by `data-cta` or by the section it sits in.
 * No markup, no cookies (see lib/analytics/client for what is stored and when nothing is sent).
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track("page_view");
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || !url.pathname.startsWith("/login")) return;
      const place =
        link.dataset.cta ||
        link.closest("[data-cta-section]")?.getAttribute("data-cta-section") ||
        (link.closest("nav, header") ? "nav" : link.closest("section[id]")?.id) ||
        "page";
      track("cta_click", {
        cta: place.slice(0, 60),
        ...(url.searchParams.get("plan") ? { plan: url.searchParams.get("plan")!.slice(0, 20) } : {}),
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
