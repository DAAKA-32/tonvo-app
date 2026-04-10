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
    default: "Tonvo — AI Conversation Copilot | Real-Time Call Insights",
    template: "%s | Tonvo",
  },
  description:
    "Analyze conversations in real time with AI. Get live coaching tips, detect tone & emotions, and receive smart suggestions during calls or chats. Works with Discord, Zoom & Meet. Free to start.",
  keywords: [
    "AI conversation copilot",
    "real-time conversation analysis",
    "AI sales copilot",
    "communication AI tool",
    "live conversation insights",
    "conversation intelligence",
    "real-time tone analysis",
    "emotion detection AI",
    "AI coaching for calls",
    "meeting intelligence",
    "sales coaching AI",
    "conversation analytics",
    "tone analyzer",
    "sentiment analysis tool",
    "speech analysis AI",
    "call assistant AI",
    "Zoom AI assistant",
    "Discord call analyzer",
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
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tonvo AI",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Tonvo — AI Conversation Copilot | Real-Time Call Analysis",
    description:
      "Analyze tone, emotions and intent in real time during calls. Get AI coaching tips and smart suggestions on Discord, Zoom and Meet. Free to start.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tonvo - AI Conversation Copilot for Real-Time Insights",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tonvo",
    creator: "@tonvo",
    title: "Tonvo - AI Conversation Copilot",
    description:
      "Real-time AI suggestions, tone detection & coaching tips to improve your calls and conversations. Free to start.",
    images: [{ url: "/og-image.png", alt: "Tonvo AI Copilot" }],
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
    "Tonvo provides real-time conversation intelligence powered by AI. Analyze tone, emotions, and intent during calls and chats.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "tonvoco.pro@gmail.com",
    contactType: "sales",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tonvo - AI Conversation Copilot",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Communication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "An AI-powered copilot that analyzes conversations in real time during calls (Discord, Zoom, Meet). Provides live coaching tips, tone detection, smart suggestions, and conversation signals to improve communication.",
  featureList: [
    "Real-time tone & emotion analysis",
    "AI coaching tips during calls",
    "Live conversation suggestions",
    "Speaker diarization (You vs Them)",
    "Conversation signal detection (objections, opportunities)",
    "Screen content analysis",
    "10 language support",
    "Quality & engagement scoring",
    "Session history & reports",
    "Floating copilot overlay",
  ],
  screenshot: `${SITE_URL}/og-image.png`,
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free Plan",
      description: "3 sessions per month with real-time tone analysis and basic suggestions",
    },
    {
      "@type": "Offer",
      price: "19",
      priceCurrency: "USD",
      name: "Pro Plan - Monthly",
      description: "Unlimited sessions with AI coaching, screen analysis, and full history",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "19",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
    },
    {
      "@type": "Offer",
      price: "182",
      priceCurrency: "USD",
      name: "Pro Plan - Yearly",
      description: "Unlimited sessions billed annually (save 20%)",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "182",
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
      name: "What is an AI conversation copilot?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI conversation copilot is a tool that analyzes your conversations in real time and provides live coaching tips, tone detection, smart suggestions, and actionable insights. Tonvo works during calls on Discord, Zoom, Google Meet, and other platforms to help you communicate more effectively.",
      },
    },
    {
      "@type": "Question",
      name: "Does Tonvo work during live calls?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Tonvo works in real time during live calls. It captures audio from your microphone and system audio (Discord, Zoom, Meet), transcribes the conversation, and provides instant coaching tips, tone analysis, and smart suggestions while you speak.",
      },
    },
    {
      "@type": "Question",
      name: "How does Tonvo analyze conversations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo uses a multi-step AI pipeline: (1) Real-time audio transcription with speaker separation, (2) Tone and emotion detection using Claude AI, (3) Conversation signal detection (objections, opportunities, hesitation), (4) Live coaching suggestions, (5) Quality and engagement scoring. It also analyzes screen content for additional context.",
      },
    },
    {
      "@type": "Question",
      name: "Is Tonvo free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Tonvo offers a free plan with 3 sessions per month including real-time tone analysis and basic suggestions. The Pro plan at $19/month (or $182/year with 20% off) unlocks unlimited sessions, advanced AI coaching, screen analysis, and full session history.",
      },
    },
    {
      "@type": "Question",
      name: "What languages does Tonvo support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo supports 10 languages: English, French, Spanish, German, Portuguese, Italian, Dutch, Chinese, Japanese, and Korean. Both the interface and conversation analysis work across all supported languages with automatic detection.",
      },
    },
    {
      "@type": "Question",
      name: "Is my conversation data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo takes privacy seriously. All conversation data is encrypted in transit and at rest. Audio is processed in real time and not permanently stored. We never sell or share your data with third parties. See our Privacy Policy for full details.",
      },
    },
    {
      "@type": "Question",
      name: "Can other people see the AI copilot during screen sharing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo opens the copilot in a separate browser window. When you share a specific application window (like Discord or Zoom) instead of your entire screen, the copilot window remains invisible to other participants. This makes it perfect for sales calls and interviews.",
      },
    },
    {
      "@type": "Question",
      name: "What is conversation signal detection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Conversation signal detection is Tonvo's AI feature that identifies key moments during a call: objections from the other person, opportunities to close, hesitation, agreement, and important questions. Each signal is highlighted in real time so you can react immediately.",
      },
    },
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to use Tonvo AI Copilot during a call",
  description: "Get real-time AI coaching and conversation insights during your calls in 3 simple steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Start a session",
      text: "Open Tonvo, go to Live Session, enable Screen and Audio capture, then click Start Recording. Select the window or screen you want to analyze.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Get real-time insights",
      text: "As you speak, Tonvo transcribes the conversation, detects tone and emotions, and shows live coaching tips, suggestions, and conversation signals in the copilot panel.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review your session report",
      text: "When you stop the session, Tonvo generates a comprehensive report with quality scores, key moments, strengths, improvements, and follow-up actions.",
    },
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "AI-powered conversation copilot for real-time insights during calls and chats.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable} style={{ backgroundColor: "#09090b" }}>
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
