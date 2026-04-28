/**
 * Tonvo Logo — Uses logo-tonvo-remove.png as the single official logo
 */

import Image from "next/image";

const SIZE_MAP = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 56,
  xl: 120,
  sidebar: 32,
} as const;

type LogoSize = keyof typeof SIZE_MAP;

interface TonvoLogoMarkProps {
  size?: LogoSize | number;
  className?: string;
}

/** Logomark only — official app icon */
export function TonvoLogoMark({ size = "md", className }: TonvoLogoMarkProps) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];

  return (
    <Image
      src="/logo-tonvo-remove.png"
      alt="Tonvo"
      width={px}
      height={px}
      className={`logo-mark ${className || ""}`}
      style={{ flexShrink: 0, objectFit: "contain" }}
      priority
    />
  );
}

interface TonvoLogoProps {
  size?: LogoSize | number;
  showText?: boolean;
  textClassName?: string;
  className?: string;
}

/** Full logo: icon + wordmark */
export default function TonvoLogo({ size = "md", showText = true, textClassName, className }: TonvoLogoProps) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const isSidebar = size === "sidebar";
  const fontSize = isSidebar ? 15 : Math.max(18, px * 0.45);
  const gap = isSidebar ? 8 : Math.max(10, px * 0.22);

  return (
    <div
      className={`tonvo-logo flex items-center ${className || ""}`}
      style={{ gap }}
    >
      <TonvoLogoMark size={size} />
      {showText && (
        <span
          className={textClassName}
          style={{
            fontSize,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            backgroundImage: "linear-gradient(135deg, #ffffff 0%, #d4d4e0 40%, #b8b8cc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "nowrap",
          }}
        >
          Tonvo
        </span>
      )}
    </div>
  );
}
