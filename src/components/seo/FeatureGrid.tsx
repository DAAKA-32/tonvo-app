import type { FeatureItem } from "@/data/seo/types";
import SEOIcon from "./SEOIcon";

interface FeatureGridProps {
  features: FeatureItem[];
  columns?: 2 | 3;
}

export default function FeatureGrid({ features, columns = 2 }: FeatureGridProps) {
  const gridClass =
    columns === 3
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 gap-4";

  return (
    <div className={gridClass}>
      {features.map((feature, i) => (
        <div
          key={i}
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="mb-3" style={{ color: "var(--color-accent-light)" }}>
            <SEOIcon name={feature.icon} />
          </div>
          <h3
            className="text-sm font-bold mb-2"
            style={{ color: "var(--color-text)" }}
          >
            {feature.title}
          </h3>
          <p
            className="text-xs leading-relaxed m-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
