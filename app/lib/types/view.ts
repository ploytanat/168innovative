// types/view.ts

// == Shared / Base ==
export interface ImageView {
  src: string;
  alt: string;
}

// Add this to @/app/lib/types/view.ts

export interface SideBannerView {
  /** Stable unique key for React */
  id: string
  /** Path only — withLocalePath() will prepend the locale prefix */
  href: string
  image: {
    src: string
    alt: string
  }
  /** Optional pill label above the title */
  tag?: string
  /** Background color of the tag pill, e.g. "#1565c0" */
  tagColor?: string
  title: string
  subtitle?: string
  /**
   * Full CSS gradient string for the overlay scrim, e.g.
   * "linear-gradient(180deg,transparent 25%,rgba(13,27,58,.65))"
   */
  overlayGradient: string
}
export interface FAQItemView {
  question: string;
  answer: string;
}

// == Category ==
export interface CategoryView {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: ImageView;
  introHtml?: string;
  faqItems: FAQItemView[];

  // SEO display content
  seoTitle?: string;
  seoDescription?: string;
}

// == Social / Company==
export type SocialType = "facebook" | "line" | "instagram" | "shopee" | string;

export interface SocialView {
  type: SocialType;
  url: string;
  icon?: ImageView;
}

export interface CompanyView {
  logo: ImageView;
  name: string;
  address: string;

  phones: {
    number: string;
    label: string;
  }[];

  email: string[];
  socials: SocialView[];
  lineQrCode?: ImageView;
  contactImage?: ImageView;
  contactGallery?: ImageView[];
}

// == Product ==
export type ProductSpecView = {
  label: string;
  value: string;
};

export type ProductVariantOptionView = {
  groupKey: string;
  groupLabel: string;
  valueKey: string;
  valueLabel: string;
};

export type ProductVariantView = {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  description?: string;
  image: ImageView;
  gallery: ImageView[];
  specs: ProductSpecView[];
  options: ProductVariantOptionView[];
  moq?: string;
  leadTime?: string;
};

export type ProductVariantGroupValueView = {
  valueKey: string;
  valueLabel: string;
  variantSlug: string;
};

export type ProductVariantGroupView = {
  key: string;
  label: string;
  values: ProductVariantGroupValueView[];
};

export type ProductView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  categoryId: string;
  categorySlug: string;
  gallery: ImageView[];
  specs: ProductSpecView[];
  contentHtml?: string;
  applicationHtml?: string;
  faqItems: FAQItemView[];
  price?: number;
  sku?: string;
  moq?: string;
  leadTime?: string;
  familySlug?: string;
  familyName?: string;
  variantCount: number;
  variantSummary?: string;
  variantGroups: ProductVariantGroupView[];
  variants: ProductVariantView[];
  defaultVariantSlug?: string;
  searchText?: string;
};

// == Why Choose Us ==
export interface WhyItemView {
  title: string;
  description: string;
  image?: ImageView;
}

// == Hero (Home) ==
export type HeroTheme = "rose" | "sky" | "violet" | "emerald";
export type HeroBadgeVariant = "hot" | "new" | "promo" | "featured";

export interface HeroCTAView {
  href: string;
  label: string;
}

export interface HeroSlideView {
  id: number;
  theme: HeroTheme;
  badge: { text: string; variant: HeroBadgeVariant };
  title: string;
  description: string;
  image: ImageView;
  ctaPrimary: HeroCTAView;
  ctaSecondary?: HeroCTAView;
  highlight?: { value: string; label: string };
  benefits?: string[];
  stats?: { value: string; label: string }[];
  trustItems?: string[];
}

export interface HomeHeroView {
  slides: HeroSlideView[];
}

export interface HomeView {
  hero: HomeHeroView;
}

/* === About === */
export interface AboutHeroView {
  title: string;
  description: string;
  image1?: ImageView;
  image2?: ImageView;
}

export interface AboutSectionView {
  title: string;
  description: string;
  image?: ImageView;
}

export interface AboutView {
  hero: AboutHeroView;
  whoAreWe: AboutSectionView;
  why: {
    title: string;
    items: WhyItemView[];
  };
  seoTitle?: string;
  seoDescription?: string;
}

// == Article View ==
export interface TagView {
  id: number;
  slug: string;
  name: string;
}

export type ArticleRichTextBlockView = {
  type: "rich_text";
  anchorId?: string;
  eyebrow?: string;
  heading?: string;
  body: string;
};

export type ArticleChecklistBlockView = {
  type: "checklist";
  anchorId?: string;
  heading: string;
  intro?: string;
  items: string[];
};

export type ArticleCalloutBlockView = {
  type: "callout";
  style?: "info" | "success" | "warning" | "note";
  heading?: string;
  body: string;
};

export type ArticleComparisonRowView = {
  criterion: string;
  leftValue?: string;
  rightValue?: string;
};

export type ArticleComparisonTableBlockView = {
  type: "comparison_table";
  heading: string;
  leftLabel: string;
  rightLabel: string;
  rows: ArticleComparisonRowView[];
};

export type ArticleCtaBlockView = {
  type: "cta";
  style?: "dark" | "accent" | "soft";
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonUrl?: string;
};

export type ArticleBlockView =
  | ArticleRichTextBlockView
  | ArticleChecklistBlockView
  | ArticleCalloutBlockView
  | ArticleComparisonTableBlockView
  | ArticleCtaBlockView;

export interface ArticleView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  blocks: ArticleBlockView[];
  authorName?: string;
  coverImage?: ImageView;
  category?: string;
  tags: TagView[];
  publishedAt: string;
  updatedAt?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  readingTimeMinutes?: number;
  faqItems: FAQItemView[];
}
