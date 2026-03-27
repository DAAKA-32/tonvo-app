import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tonvo - Real-time Conversation Intelligence",
    short_name: "Tonvo",
    description:
      "Analyze tone, emotions, and intent in real time. AI-powered coaching tips and smart suggestions for better conversations.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo-tonvo-remove.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["business", "productivity", "communication"],
    lang: "en",
    dir: "ltr",
  };
}
