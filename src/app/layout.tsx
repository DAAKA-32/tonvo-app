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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tonvo - Real-time Conversation Intelligence | AI Tone & Emotion Analysis",
    template: "%s | Tonvo",
  },
  description:
    "Tonvo analyzes tone, emotions, and intent in real time during your conversations. Get AI-powered coaching tips, live insights, and smart suggestions to communicate better. Free to start.",
  keywords: [
    "conversation intelligence",
    "real-time tone analysis",
    "emotion detection",
    "AI coaching",
    "communication skills",
    "conversation analytics",
    "tone analyzer",
    "sentiment analysis",
    "meeting intelligence",
    "sales coaching",
    "conversation AI",
    "speech analysis",
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
      { url: "/logo-tonvo-remove.png", type: "image/png" },
    ],
    apple: [{ url: "/logo-tonvo-remove.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Tonvo - Real-time Conversation Intelligence",
    description:
      "Analyze tone, emotions, and intent in real time. Get AI coaching tips and smart suggestions during your conversations.",
    images: [
      {
        url: "/logo-tonvo.png",
        width: 1200,
        height: 630,
        alt: "Tonvo - Real-time Conversation Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonvo - Real-time Conversation Intelligence",
    description:
      "Analyze tone, emotions, and intent in real time. AI coaching tips and smart suggestions for better conversations.",
    images: ["/logo-tonvo.png"],
    creator: "@tonvo",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": `${SITE_URL}`,
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
};

/* ── JSON-LD Structured Data ── */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tonvo",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-tonvo.png`,
  description:
    "Tonvo provides real-time conversation intelligence powered by AI. Analyze tone, emotions, and intent during your conversations.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@tonvo.co",
    contactType: "sales",
  },
  sameAs: [],
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tonvo",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "Real-time conversation intelligence app that analyzes tone, emotions, and provides AI-powered coaching tips.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free Plan",
      description: "3 sessions per month with basic tone analysis",
    },
    {
      "@type": "Offer",
      price: "19",
      priceCurrency: "USD",
      name: "Pro Plan",
      description: "Unlimited sessions with advanced AI coaching and screen analysis",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "19",
        priceCurrency: "USD",
        billingDuration: "P1M",
      },
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
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
        text: "Tonvo is an AI-powered conversation intelligence platform that analyzes tone, emotions, and intent in real time during your conversations. It provides live coaching tips and smart suggestions to help you communicate more effectively.",
      },
    },
    {
      "@type": "Question",
      name: "How does Tonvo analyze conversations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo uses advanced AI to transcribe your conversations in real time, detect emotional tone (positive, neutral, negative, hesitant), and provide contextual suggestions. It analyzes both audio and screen content to give comprehensive insights.",
      },
    },
    {
      "@type": "Question",
      name: "Is Tonvo free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Tonvo offers a free plan with 3 sessions per month, real-time tone analysis, and basic suggestions. For unlimited sessions and advanced features, the Pro plan is available at $19/month.",
      },
    },
    {
      "@type": "Question",
      name: "What languages does Tonvo support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo supports 10 languages: English, French, Spanish, German, Portuguese, Italian, Dutch, Chinese, Japanese, and Korean. The interface and analysis work across all supported languages.",
      },
    },
    {
      "@type": "Question",
      name: "Is my conversation data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tonvo takes privacy seriously. Conversation data is encrypted in transit and at rest. We do not sell or share your data with third parties. See our Privacy Policy for full details.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
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
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
