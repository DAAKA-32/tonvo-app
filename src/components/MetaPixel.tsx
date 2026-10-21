"use client";

/**
 * Meta Pixel base script loader. Loads the standard fbq snippet + initial PageView ONLY after the visitor
 * accepted it in the cookie banner (src/lib/consent.ts). No-ops when NEXT_PUBLIC_FB_PIXEL_ID is unset
 * (dev / preview environments).
 *
 * Without the script there is no window.fbq, so trackPixel() returns no event id and the server-side
 * Conversions API mirror (src/lib/meta-pixel.ts) does not fire either: one switch covers both.
 * There is deliberately no fallback pixel image for browsers without JavaScript: it would fire without any chance to consent.
 */
import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => {
      const ok = readConsent() === "granted";
      setGranted(ok);
      // A choice withdrawn after the script loaded: tell Meta to stop (takes full effect on the next page load).
      if (!ok) (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("consent", "revoke");
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!pixelId || !granted) return null;

  return (
    <Script
      id="meta-pixel-base"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
      }}
    />
  );
}
