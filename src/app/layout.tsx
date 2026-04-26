import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
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
    default: "Tonvo — Close 27% More Deals | Growth-as-a-Service for Closers",
    template: "%s | Tonvo",
  },
  description:
    "Tonvo is Growth-as-a-Service for consultants, negotiators and high-ticket closers. Raise your close rate by 27% in 30 days — live closing lines, objection counters and price anchors delivered the moment they matter. We sell results, not software.",
  keywords: [
    "growth as a service",
    "raise close rate",
    "close more deals",
    "closing rate coach",
    "negotiation growth system",
    "high ticket closing",
    "live closing assistant",
    "objection handling live",
    "sales close rate uplift",
    "consultant closing edge",
    "negotiation performance",
    "revenue per call",
    "win rate growth",
    "sales results as a service",
    "close more sales calls",
    "GaaS for sales",
    "outcome-based sales tool",
    "deal closing growth engine",
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
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Tonvo — Close 27% More Deals | Growth-as-a-Service for Closers",
    description:
      "We don't sell software — we sell close rate. Tonvo arms consultants and negotiators with the exact closing line, the moment they need it. +27% close rate in 30 days, or your money back.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tonvo — Growth-as-a-Service that raises your close rate",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tonvo",
    creator: "@tonvo",
    title: "Tonvo — Close More. Negotiate Better.",
    description:
      "Growth-as-a-Service for high-ticket closers. Raise your close rate by 27% in 30 days. We sell the outcome, not the software.",
    images: [{ url: "/og-image.png", alt: "Tonvo — Close More Deals" }],
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
    "Tonvo is Growth-as-a-Service for consultants, negotiators and high-ticket closers. We deliver a measurable close-rate uplift — not software.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "tonvoco.pro@gmail.com",
    contactType: "sales",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tonvo — Growth-as-a-Service for Closers",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "SalesGrowth",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Tonvo delivers a 27% average close-rate uplift in 30 days. Live closing lines, objection counters and price anchors are surfaced the moment a buying signal hits, so consultants and negotiation coaches stop losing winnable deals.",
  featureList: [
    "Live buying-signal detection",
    "Exact closing lines, delivered the moment you need them",
    "Objection counters and price anchors",
    "Speaker separation (you vs prospect)",
    "Post-call deal review from transcript",
    "Close-rate and objection win-rate tracking",
    "10-language coverage for international deals",
    "Invisible during screen share",
    "Deal reports and export",
    "Revenue coach and playbooks",
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
      name: "Is Tonvo a tool or a growth system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo is a Growth-as-a-Service system — we sell close rate, not software. You plug in, and the outcome we deliver is measurable: more deals closed, bigger tickets, fewer objections lost. The application is just the delivery mechanism.",
      },
    },
    {
      "@type": "Question",
      name: "How fast does my close rate actually move?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most closers on Tonvo see a measurable close-rate lift inside 14 days — not because they changed their pitch, but because they stopped missing the moments that decide a deal. The average uplift across 30 days is +27% close rate.",
      },
    },
    {
      "@type": "Question",
      name: "What do I actually get during a call?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The exact sentence to say when it matters: the objection-handler, the price anchor, the commitment ask, the reframe. No dashboards to read live — just the next move, surfaced the instant the buying signal hits.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to change my sales process or pitch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Tonvo layers on top of your existing process. Your pitch, your deck, your offer — unchanged. What changes is the rate at which they end in a signed deal.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a guarantee on the outcome?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. If your close rate doesn't move in 7 days, we refund you. We sell results — if you don't get them, we don't keep your money.",
      },
    },
    {
      "@type": "Question",
      name: "Can my prospect see anything during a call?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. Tonvo runs in a separate window, invisible to the other side — even on screen share. Your edge stays your edge.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Tonvo built for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consultants, negotiation coaches, high-ticket closers, and client-facing operators whose income depends on their close rate. If you live by the deal, Tonvo compounds your edge.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Tonvo cost versus the revenue it generates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Closer plan is $19/month (or $156/year — 30% off). One additional deal closed pays for the entire year. Pricing is built around the outcome — we price on the growth you get, not per feature.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to raise your close rate with Tonvo",
  description: "Turn every call into a higher-close-rate rep in 3 steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Plug in before the call",
      text: "One click. Tonvo joins silently — invisible to your prospect. No workflow change, no extra setup.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Win live",
      text: "The moment a buying signal, objection or price pushback hits, Tonvo surfaces the exact line to say. You deliver it. The deal tips your way.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Compound the edge",
      text: "After the call, review what moved the deal and what cost you. Your close-rate trend climbs, call after call.",
    },
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Growth-as-a-Service for closers. Raise your close rate by 27% in 30 days — we sell results, not software.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable} style={{ backgroundColor: "#09090b" }} suppressHydrationWarning>
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
      <body className="antialiased">
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
