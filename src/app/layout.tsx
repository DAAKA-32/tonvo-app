import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import MetaPixel from "@/components/MetaPixel";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { inlineDetectScript } from "@/lib/performance/detect";
import { HOME_DESCRIPTION, HOME_TITLE, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import en from "@/i18n/locales/en.json";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Public pages build their own metadata with pageMetadata() (lib/seo.ts); these are the home page values and
  // the defaults for app routes. "./" resolves to each route's own path, so nothing inherits the home URL.
  title: {
    default: HOME_TITLE,
    template: "%s | Tonvo",
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "AI conversation copilot",
    "AI conversation assistant",
    "what to say in a conversation",
    "real-time conversation help",
    "live transcription",
    "AI reply suggestions",
    "live translation",
    "interview help",
    "AI call assistant",
    "AI meeting assistant",
    "communication assistant",
    "Tonvo",
  ],
  authors: [{ name: "Tonvo", url: SITE_URL }],
  creator: "Tonvo",
  publisher: "Tonvo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tonvo",
  },
  other: {
    "mobile-web-app-capable": "yes",
    google: "notranslate",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ ...OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
  alternates: {
    canonical: "./",
  },
  category: "technology",
  verification: {
    google: "B5nixBEKZFroUuUqTwfB7CoJQ0vxrIAJUuykH5hva18",
  },
};

/* ── JSON-LD Structured Data ── */

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tonvo",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-tonvo.png`,
  description:
    "Tonvo is a copilot for live conversations: live transcription, ready-to-say replies and a short read on the moment, for calls, interviews and everyday talks.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "outreach@tonvo.co",
    contactType: "customer support",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tonvo: AI Copilot for Conversations",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "ConversationAssistant",
  operatingSystem: "Web, Windows, macOS, Linux",
  url: SITE_URL,
  description:
    "Tonvo follows a live conversation and puts three ready replies and a short read on the moment on your screen. For calls, interviews, meetings and everyday talks.",
  featureList: [
    "Live transcription",
    "Three ready-to-say replies",
    "Detects the question you were just asked",
    "Tone and engagement insights (paid plans)",
    "Live translation (paid plans)",
    "Session summaries with follow-up actions",
    "Help with pasted messages and screenshots",
    "Works in 10 languages",
    "Separate copilot window on paid plans, hidden when you share a tab or window",
    "Native desktop apps (Windows, macOS, Linux)",
  ],
  screenshot: `${SITE_URL}${OG_IMAGE.url}`,
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
      description: "3 live sessions per month, up to 5 minutes each, with ready-to-say replies",
    },
    {
      "@type": "Offer",
      price: "19",
      priceCurrency: "USD",
      name: "Plus (monthly)",
      description: "Unlimited live sessions, live translation, coaching tips and full history",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "19",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
    },
    {
      "@type": "Offer",
      price: "156",
      priceCurrency: "USD",
      name: "Plus (yearly)",
      description: "Unlimited live sessions, billed yearly at 30% off",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "156",
        priceCurrency: "USD",
        billingDuration: "P1Y",
      },
    },
  ],
};

// Same questions and answers as the visible FAQ on the home page (en.json is the single source).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
    "@type": "Question",
    name: (en.landing.faq as Record<string, string>)[`q${n}`],
    acceptedAnswer: {
      "@type": "Answer",
      text: (en.landing.faq as Record<string, string>)[`a${n}`],
    },
  })),
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to use Tonvo in a conversation",
  description: "Get ready-to-say replies during your next call or meeting in 3 steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Start a session",
      text: "Open tonvo.co, pick your microphone, and share your call's audio if you want Tonvo to hear both sides.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Get the right words",
      text: "Tonvo transcribes the conversation as it happens and shows the question you were just asked, a short read on the moment and three replies you can use.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Look back and learn",
      text: "After the session, open the summary to see what went well and the next steps to follow up on.",
    },
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Your copilot for every conversation. Live transcription, ready-to-say replies and a short read on the moment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" translate="no" className={`${inter.variable} notranslate`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: inlineDetectScript() }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              // Theme only applies to the in-app dashboard scope, never to public marketing pages.
              var p = window.location.pathname;
              var isMarketing = p === '/' || p.indexOf('/login') === 0 || p.indexOf('/about') === 0
                || p.indexOf('/blog') === 0 || p.indexOf('/pricing') === 0 || p.indexOf('/use-cases') === 0
                || p.indexOf('/features') === 0 || p.indexOf('/compare') === 0 || p.indexOf('/industries') === 0
                || p.indexOf('/guides') === 0 || p.indexOf('/terms') === 0 || p.indexOf('/privacy') === 0
                || p.indexOf('/cookies') === 0 || p.indexOf('/legal') === 0;
              var meta = document.querySelector('meta[name="theme-color"]');
              if (isMarketing) {
                document.documentElement.removeAttribute('data-theme');
              } else {
                var t = localStorage.getItem('tonvo-theme');
                if (t === 'light') {
                  document.documentElement.setAttribute('data-theme','light');
                  document.documentElement.style.colorScheme = 'light';
                  if (meta) meta.setAttribute('content', '#fafafa');
                }
              }
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased notranslate" translate="no">
        <MetaPixel />
        <AnalyticsTracker />
        <Providers>
          {children}
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                // Block Ctrl/Cmd + scroll wheel zoom
                document.addEventListener('wheel',function(e){
                  if(e.ctrlKey||e.metaKey){e.preventDefault();}
                },{passive:false});

                // Block Ctrl/Cmd + +/-/0 keyboard zoom
                document.addEventListener('keydown',function(e){
                  if((e.ctrlKey||e.metaKey)&&(e.key==='+'||e.key==='-'||e.key==='='||e.key==='0')){
                    e.preventDefault();
                  }
                });

                // Block double-tap zoom on mobile
                var lastTouchEnd=0;
                document.addEventListener('touchend',function(e){
                  var now=Date.now();
                  if(now-lastTouchEnd<=300){e.preventDefault();}
                  lastTouchEnd=now;
                },false);

                // Block pinch-to-zoom on mobile
                document.addEventListener('touchmove',function(e){
                  if(e.touches&&e.touches.length>1){e.preventDefault();}
                },{passive:false});

                // Block gesturestart/gesturechange (Safari iOS)
                document.addEventListener('gesturestart',function(e){e.preventDefault();});
                document.addEventListener('gesturechange',function(e){e.preventDefault();});
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                // Tonvo owns its language layer. Neutralize browser translation extensions
                // (Google Translate, Chrome auto-translate, Microsoft, DeepL, Safari) so
                // they can't mutate the DOM, retranslate AI conversations, or break
                // React hydration/layout.
                try {
                  var html = document.documentElement;
                  var body = document.body;
                  function reassert(el){
                    if(!el) return;
                    if(el.getAttribute('translate') !== 'no') el.setAttribute('translate','no');
                    if(!/(^|\\s)notranslate(\\s|$)/.test(el.className||'')){
                      el.className = ((el.className||'') + ' notranslate').trim();
                    }
                  }
                  reassert(html);
                  reassert(body);

                  // Strip widgets/banners injected by Google Translate and similar tools.
                  var INJECTED_SELECTORS = [
                    '.goog-te-banner-frame',
                    '.goog-te-menu-frame',
                    '#goog-gt-tt',
                    '.goog-tooltip',
                    '.goog-text-highlight',
                    '#google_translate_element',
                    'iframe.skiptranslate',
                    'iframe[src*="translate.google"]',
                    'iframe[src*="translate.googleapis"]'
                  ];
                  function cleanup(){
                    INJECTED_SELECTORS.forEach(function(sel){
                      document.querySelectorAll(sel).forEach(function(el){ try{ el.remove(); }catch(_){} });
                    });
                    // Google Translate pins the body with inline top offset — reset it.
                    if(body && body.style && body.style.top){ body.style.top = ''; }
                    if(html && html.classList && html.classList.contains('translated-ltr')){
                      html.classList.remove('translated-ltr');
                    }
                    if(html && html.classList && html.classList.contains('translated-rtl')){
                      html.classList.remove('translated-rtl');
                    }
                    // External extensions sometimes rewrite <html lang>. Restore from
                    // the Tonvo-controlled truth marker (data-tonvo-lang), defaulting to 'en'.
                    if(html){
                      var expected = html.getAttribute('data-tonvo-lang') || 'en';
                      if(html.getAttribute('lang') !== expected){
                        html.setAttribute('lang', expected);
                      }
                    }
                    reassert(html);
                    reassert(body);
                  }
                  cleanup();
                  var mo = new MutationObserver(function(mutations){
                    var hit = false;
                    for(var i=0;i<mutations.length;i++){
                      var m = mutations[i];
                      if(m.type === 'childList' && m.addedNodes && m.addedNodes.length){ hit = true; break; }
                      if(m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style' || m.attributeName === 'lang')){ hit = true; break; }
                    }
                    if(hit) cleanup();
                  });
                  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style','lang'] });
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                function removeVercelToolbar(){
                  var selectors = ['#vercel-live-feedback','[data-vercel-toolbar]','vercel-live-feedback'];
                  selectors.forEach(function(s){
                    document.querySelectorAll(s).forEach(function(el){ el.remove(); });
                  });
                  document.querySelectorAll('iframe').forEach(function(f){
                    if(f.src && (f.src.includes('vercel.live') || f.src.includes('vercel.com')))f.remove();
                  });
                }
                removeVercelToolbar();
                var observer = new MutationObserver(removeVercelToolbar);
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
