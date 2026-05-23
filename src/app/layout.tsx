import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import MetaPixel from "@/components/MetaPixel";
import { inlineDetectScript } from "@/lib/performance/detect";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://tonvo.co";
const SITE_NAME = "Tonvo";

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
  title: {
    default: "Tonvo — AI Copilot for High-Stakes Conversations",
    template: "%s | Tonvo",
  },
  description:
    "Tonvo is the real-time AI copilot for sales conversations. Live transcription, instant insights, and closing suggestions — the moment they matter. Built for closers, consultants, and anyone whose income depends on the next call.",
  keywords: [
    "AI sales copilot",
    "real-time AI",
    "AI conversation assistant",
    "AI sales assistant",
    "sales call copilot",
    "live call transcription",
    "AI closing assistant",
    "AI for sales calls",
    "conversation intelligence",
    "AI meeting assistant",
    "AI sales coach",
    "real-time sales insights",
    "sales conversation AI",
    "live transcription AI",
    "AI negotiation assistant",
    "AI call assistant",
    "AI for closers",
    "sales AI copilot",
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Tonvo — AI Copilot for High-Stakes Conversations",
    description:
      "The real-time AI copilot for sales conversations. Live transcription, instant insights, and closing suggestions — the moment they matter.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tonvo — AI Copilot for High-Stakes Conversations",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tonvo",
    creator: "@tonvo",
    title: "Tonvo — Real-Time AI Sales Copilot",
    description:
      "Live transcription, instant insights, and closing suggestions during every call that matters. The AI copilot for sales conversations.",
    images: [{ url: "/og-image.png", alt: "Tonvo — Real-Time AI Sales Copilot" }],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "fr": `${SITE_URL}?lang=fr`,
      "es": `${SITE_URL}?lang=es`,
      "de": `${SITE_URL}?lang=de`,
      "pt": `${SITE_URL}?lang=pt`,
      "it": `${SITE_URL}?lang=it`,
      "nl": `${SITE_URL}?lang=nl`,
      "zh": `${SITE_URL}?lang=zh`,
      "ja": `${SITE_URL}?lang=ja`,
      "ko": `${SITE_URL}?lang=ko`,
    },
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
    "Tonvo is the real-time AI copilot for sales conversations — live transcription, instant insights, and closing suggestions during every call that matters.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "tonvo.sales@gmail.com",
    contactType: "sales",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tonvo — AI Copilot for Sales Conversations",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "SalesAssistant",
  operatingSystem: "Web, Windows, macOS, Linux",
  url: SITE_URL,
  description:
    "Tonvo is a real-time AI copilot for sales calls. Live transcription, instant suggestions, objection counters, and closing prompts — surfaced the moment a buying signal hits.",
  featureList: [
    "Real-time call transcription",
    "Live buying-signal detection",
    "AI closing suggestions, surfaced the moment they matter",
    "Objection counters and price anchors",
    "Speaker separation (you vs prospect)",
    "Post-call review with searchable transcript",
    "Close-rate and objection win-rate tracking",
    "10-language coverage for international calls",
    "Invisible during screen share",
    "Native desktop apps (Windows, macOS, Linux)",
  ],
  screenshot: `${SITE_URL}/og-image.png`,
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Starter",
      description: "3 live closing sessions per month with buying-signal detection",
    },
    {
      "@type": "Offer",
      price: "19",
      priceCurrency: "USD",
      name: "Closer — Monthly",
      description: "Unlimited closing sessions, full objection library, close-rate tracking",
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
      name: "Closer — Yearly",
      description: "Unlimited closing, billed yearly (30% off — pays back in one closed deal)",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "156",
        priceCurrency: "USD",
        billingDuration: "P1Y",
      },
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Tonvo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo is a real-time AI copilot for sales conversations. During every call that matters, it transcribes what's said, surfaces buying signals, and suggests the next line — instantly. Available as a web app and as native desktop apps for Windows, macOS, and Linux.",
      },
    },
    {
      "@type": "Question",
      name: "How does it work during a live call?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo listens to the conversation in real time, runs live transcription, and surfaces AI suggestions the moment a buying signal, objection, or pricing question appears. You see the next best move without breaking eye contact or fumbling for a script.",
      },
    },
    {
      "@type": "Question",
      name: "What languages does Tonvo support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo handles 10 languages out of the box: English, French, Spanish, German, Italian, Portuguese, Dutch, Japanese, Korean, and Chinese. International calls are transcribed and analyzed in real time.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to change my sales process to use Tonvo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Tonvo layers on top of your existing workflow — your pitch, your deck, your offer stay unchanged. It runs alongside the call you'd already be making and adds an AI layer of guidance only you can see.",
      },
    },
    {
      "@type": "Question",
      name: "Can my prospect see anything during a call?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Tonvo runs in a separate window, invisible to the other side — even during screen share. The intelligence stays on your side of the call.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Tonvo built for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Anyone whose work depends on high-stakes conversations: sales closers, consultants, negotiation coaches, account executives, customer success managers, and founders running discovery and renewal calls.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free version?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Starter plan is free and includes 3 live sessions per month with full transcription and AI suggestions. The Closer plan unlocks unlimited sessions and starts at $19/month.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to install anything?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the web app at tonvo.co — no install required. Or install the native desktop app for Windows, macOS, or Linux for a faster, dock-launchable experience.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to use Tonvo during a sales call",
  description: "Add a real-time AI copilot to your next call in 3 steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Open Tonvo before the call",
      text: "Launch the desktop app or open tonvo.co in a browser tab. Tonvo runs in its own window, invisible to your prospect on screen share.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Get live guidance during the call",
      text: "Tonvo transcribes the conversation in real time and surfaces AI suggestions the moment a buying signal, objection, or pricing question lands. You see the next best move instantly.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review after the call",
      text: "Open the transcript and the conversation analysis. See what landed, what didn't, and the patterns that repeat across your calls.",
    },
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "The real-time AI copilot for sales conversations. Live transcription, instant insights, and closing suggestions — the moment they matter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" translate="no" className={`${inter.variable} notranslate`} style={{ backgroundColor: "#09090b" }} suppressHydrationWarning>
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
              if (isMarketing) {
                document.documentElement.removeAttribute('data-theme');
              } else {
                var t = localStorage.getItem('tonvo-theme');
                if (t === 'light') document.documentElement.setAttribute('data-theme','light');
              }
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased notranslate" translate="no">
        <MetaPixel />
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
