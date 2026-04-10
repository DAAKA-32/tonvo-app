import type { GuideSection } from "@/data/seo/types";

export default function TableOfContents({ sections }: { sections: GuideSection[] }) {
  return (
    <nav
      className="rounded-xl border p-5 mb-12"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--color-accent-light)" }}
      >
        Table of Contents
      </p>
      <ol className="list-none p-0 m-0 space-y-2">
        {sections.map((section, i) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="footer-link"
            >
              {i + 1}. {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
