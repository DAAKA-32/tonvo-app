// ─── Shared types for all programmatic SEO pages ───

export type SEOPageType = "use-cases" | "features" | "industries" | "compare" | "guides";

export interface RelatedSlug {
  type: SEOPageType;
  slug: string;
  label: string;
}

export interface ContentSection {
  label?: string;
  heading: string;
  body: string;
}

export interface FeatureItem {
  icon: "mic" | "brain" | "shield" | "zap" | "eye" | "bar-chart" | "globe" | "users" | "target" | "clock" | "message" | "search" | "check" | "trending-up" | "headphones" | "layers" | "monitor" | "heart";
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company?: string;
}

// ─── Base interface shared by every SEO page entry ───

export interface SEOPageBase {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  lastModified: string;
  relatedSlugs: RelatedSlug[];
  targetKeywords: string[];
  faq: FAQItem[];
}

// ─── Use Cases ───

export interface UseCaseEntry extends SEOPageBase {
  type: "use-cases";
  problem: ContentSection;
  solution: ContentSection;
  features: FeatureItem[];
  stats: StatItem[];
  testimonial?: TestimonialItem;
}

// ─── Features ───

export interface FeatureEntry extends SEOPageBase {
  type: "features";
  featureName: string;
  howItWorks: ContentSection;
  benefits: FeatureItem[];
  useCasesForFeature: string[];
  technicalDetail?: ContentSection;
}

// ─── Industries ───

export interface IndustryEntry extends SEOPageBase {
  type: "industries";
  industryName: string;
  painPoints: string[];
  howTonvoHelps: ContentSection;
  features: FeatureItem[];
  stats: StatItem[];
  useCaseLinks: string[];
}

// ─── Comparisons ───

export interface ComparisonRow {
  feature: string;
  tonvo: string | boolean;
  competitor: string | boolean;
}

export interface ComparisonEntry extends SEOPageBase {
  type: "compare";
  competitorName: string;
  competitorDescription: string;
  comparisonRows: ComparisonRow[];
  tonvoAdvantages: FeatureItem[];
  summary: ContentSection;
}

// ─── Guides ───

export interface GuideSection {
  id: string;
  heading: string;
  body: string;
}

export interface GuideEntry extends SEOPageBase {
  type: "guides";
  tag: string;
  tagColor: string;
  readingTime: string;
  sections: GuideSection[];
  keyTakeaways: string[];
  tonvoCTA: ContentSection;
}

// ─── Union type ───

export type SEOPageEntry =
  | UseCaseEntry
  | FeatureEntry
  | IndustryEntry
  | ComparisonEntry
  | GuideEntry;
