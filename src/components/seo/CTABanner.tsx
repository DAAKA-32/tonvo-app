import Link from "next/link";

interface CTABannerProps {
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTABanner({
  heading = "Ready to communicate better?",
  description = "Join thousands of professionals using Tonvo to improve their conversations.",
  buttonText = "Get started for free",
  buttonHref = "/login",
}: CTABannerProps) {
  return (
    <div
      className="text-center rounded-2xl border p-10"
      style={{
        backgroundColor: "rgba(200, 200, 216, 0.04)",
        borderColor: "var(--color-border)",
      }}
    >
      <h2
        className="text-xl font-bold mb-3"
        style={{ color: "var(--color-text)" }}
      >
        {heading}
      </h2>
      <p
        className="text-sm mb-6"
        style={{ color: "var(--color-text-muted)" }}
      >
        {description}
      </p>
      <Link
        href={buttonHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
          color: "white",
          boxShadow: "0 4px 14px rgba(92,92,110,0.35)",
        }}
      >
        {buttonText}
      </Link>
    </div>
  );
}
