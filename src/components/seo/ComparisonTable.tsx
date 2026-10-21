import type { ComparisonRow } from "@/data/seo/types";

interface ComparisonTableProps {
  /** Label of the first column header (translated by the caller). */
  featureLabel: string;
  tonvoName?: string;
  competitorName: string;
  rows: ComparisonRow[];
}

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
      {value}
    </span>
  );
}

export default function ComparisonTable({
  featureLabel,
  tonvoName = "Tonvo",
  competitorName,
  rows,
}: ComparisonTableProps) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
            <th
              className="text-left px-5 py-4 font-semibold"
              style={{ color: "var(--color-text-muted)", width: "40%" }}
            >
              {featureLabel}
            </th>
            <th
              className="text-center px-5 py-4 font-semibold"
              style={{ color: "var(--color-accent-light)", width: "30%" }}
            >
              {tonvoName}
            </th>
            <th
              className="text-center px-5 py-4 font-semibold"
              style={{ color: "var(--color-text-muted)", width: "30%" }}
            >
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom:
                  i < rows.length - 1
                    ? "1px solid var(--color-border)"
                    : undefined,
              }}
            >
              <td
                className="px-5 py-3.5 text-xs font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {row.feature}
              </td>
              <td className="px-5 py-3.5 text-center">
                <div className="flex justify-center">
                  <CellValue value={row.tonvo} />
                </div>
              </td>
              <td className="px-5 py-3.5 text-center">
                <div className="flex justify-center">
                  <CellValue value={row.competitor} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
