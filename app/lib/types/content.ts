// types/content.ts
// =====================================================
// Common Types
// =====================================================

export type Locale = "th" | "en";

export type LocalizedText = {
  th: string;
  en: string;
};

export interface ImageAsset {
  src: string;
  alt: LocalizedText;
}

export interface CTA {
  label: LocalizedText;
  href: string;
}

export interface SocialLink {
  type: "facebook" | "line" | "instagram" | "shopee";
  icon: {
    src: string;
    alt: string;
  };
  url: string;
}

export interface ContactPhone {
  number: string;
  label: LocalizedText;
}

// =====================================================
// Hero
// =====================================================

export interface HeroSection {
  title: LocalizedText;
  description: LocalizedText;
  image: ImageAsset;
  ctaPrimary: CTA;
  ctaSecondary: CTA;
}

// =====================================================
// SEO
// =====================================================

export interface SEOContent {
  title: LocalizedText;
  description: LocalizedText;
  keywords?: string[];
}

// =====================================================
// Home
// =====================================================

export type HeroTheme = "rose" | "sky" | "violet" | "emerald";
export type HeroBadgeVariant = "hot" | "new" | "promo" | "featured";

export interface HomeContent {
  hero: {
    slides: {
      id: number;
      theme: HeroTheme;
      badge: { text: LocalizedText; variant: HeroBadgeVariant };
      title: LocalizedText;
      description: LocalizedText;
      image: ImageAsset;
      ctaPrimary: CTA;
      ctaSecondary?: CTA;
      highlight?: { value: string; label: LocalizedText };
      benefits?: { th: string[]; en: string[] };
      trustItems?: { th: string[]; en: string[] };
    }[];
  };
}

// =====================================================
// Category
// =====================================================

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  image?: ImageAsset;
  seoTitle?: LocalizedText;
  seoDescription?: LocalizedText;
}

// =====================================================
// Product
// =====================================================

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  image: ImageAsset;
  price?: string;
}

// =====================================================
// Company
// =====================================================

export interface CompanyInfo {
  logo: ImageAsset;
  name: LocalizedText;
  address: LocalizedText;
  phones: ContactPhone[];
  email: string[];
  socials: SocialLink[];
  lineQrCode: ImageAsset;
  contactImage: ImageAsset;
  contactGallery?: ImageAsset[];
}

// =====================================================
// About
// =====================================================

export interface AboutContent {
  hero: {
    title: LocalizedText;
    description: LocalizedText;
    image: ImageAsset;
  };
  whoAreWe: {
    title: LocalizedText;
    description: LocalizedText;
    image: ImageAsset;
  };
}

// =====================================================
// Why Choose Us
// =====================================================

export interface WhyItem {
  image: ImageAsset;
  title: LocalizedText;
  description: LocalizedText;
}

// =====================================================
// Article (Internal View Model - CMS Independent)
// =====================================================

export interface Article {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  coverImage?: ImageAsset;
  category?: string;
  publishedAt: string;
}

// =====================================================
// WordPress Raw Types (Headless Layer)
// =====================================================

export interface WPTerm {
  id: number;
  slug: string;
  name: string;
  taxonomy: string; // article_tag | article_category
}

export interface WPFeaturedMedia {
  source_url?: string;
  alt_text?: string; // <--- เพิ่มบรรทัดนี้
}

export interface WPMediaItem extends WPFeaturedMedia {
  id: number;
  guid?: {
    rendered?: string;
  };
}

export interface WPEmbedded {
  ["wp:featuredmedia"]?: WPFeaturedMedia[];
  ["wp:term"]?: WPTerm[][];
  author?: Array<{ name?: string }>;
}

export interface WPFaqItem {
  question_th?: string;
  question_en?: string;
  answer_th?: string;
  answer_en?: string;
}

export interface WPArticleBlockChecklistItem {
  item_th?: string;
  item_en?: string;
}

export interface WPArticleBlockComparisonRow {
  criterion_th?: string;
  criterion_en?: string;
  left_value_th?: string;
  left_value_en?: string;
  right_value_th?: string;
  right_value_en?: string;
}

export interface WPArticleContentBlock {
  acf_fc_layout?: string;
  anchor_id?: string;
  eyebrow_th?: string;
  eyebrow_en?: string;
  heading_th?: string;
  heading_en?: string;
  body_th?: string;
  body_en?: string;
  intro_th?: string;
  intro_en?: string;
  items?: WPArticleBlockChecklistItem[];
  style?: "info" | "success" | "warning" | "note" | "dark" | "accent" | "soft";
  left_label_th?: string;
  left_label_en?: string;
  right_label_th?: string;
  right_label_en?: string;
  rows?: WPArticleBlockComparisonRow[];
  button_label_th?: string;
  button_label_en?: string;
  button_url?: string;
}

// ---------------------------
// WP Article (CPT: article)
// ---------------------------

export interface WPArticle {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  featured_media?: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };

  acf?: {
    image?: number;
    title_th?: string;
    title_en?: string;
    excerpt_th?: string;
    excerpt_en?: string;
    content_th?: string;
    content_en?: string;
    image_alt_th?: string;
    image_alt_en?: string;
    seo_title_th?: string;
    seo_title_en?: string;
    meta_description_th?: string;
    meta_description_en?: string;
    canonical_url_th?: string;
    canonical_url_en?: string;
    focus_keyword?: string;
    focus_keyword_th?: string;
    focus_keyword_en?: string;
    content_blocks?: WPArticleContentBlock[];
    primary_category?: number | number[];
    article_tags?: number[];
    published_at?: string;
    updated_at?: string;
    author_name?: string;
    reading_time_minutes?: number;
    faq_items?: WPFaqItem[];
  };

  _embedded?: WPEmbedded;
}

// ---------------------------
// WP Product (CPT: product)
// ---------------------------

export type WPSpec = {
  spec_label?: string;
  spec_value?: string;
};

export interface WPProductGalleryItem {
  image?:
    | number
    | string
    | {
        url?: string;
        sizes?: {
          large?: string;
          medium_large?: string;
          medium?: string;
          thumbnail?: string;
        };
        alt?: string;
        alt_text?: string;
        title?: string;
      };
  alt_th?: string;
  alt_en?: string;
  sort_order?: number;
}

export interface WPProductVariantOption {
  group_key?: string;
  group_label_th?: string;
  group_label_en?: string;
  value_key?: string;
  value_th?: string;
  value_en?: string;
}

export interface WPProductVariant {
  slug?: string;
  sku?: string;
  label_th?: string;
  label_en?: string;
  description_th?: string;
  description_en?: string;
  image?:
    | number
    | string
    | {
        url?: string;
        sizes?: {
          large?: string;
          medium_large?: string;
          medium?: string;
          thumbnail?: string;
        };
        alt?: string;
        alt_text?: string;
        title?: string;
      };
  image_url?: string;
  gallery_images?: WPProductGalleryItem[];
  specs_json?: string | Record<string, unknown>;
  options?: WPProductVariantOption[];
  moq?: string;
  lead_time?: string;
  sort_order?: number;
}

export interface WPProduct {
  id: number;
  slug: string;
  modified?: string;

  title: {
    rendered: string;
  };

  content: {
    rendered: string;
  };

  featured_media: number;

  // ✅ ตัวใหม่จาก plugin
  featured_image_url?: string;

  product_category?: number[];

  acf?: {
    name_th?: string;
    name_en?: string;
    description_th?: string;
    description_en?: string;
    content_th?: string;
    content_en?: string;
    application_th?: string;
    application_en?: string;
    image_alt_th?: string;
    image_alt_en?: string;
    specs_json?: string;
    sku?: string;
    moq?: string;
    lead_time?: string;
    gallery_images?: WPProductGalleryItem[];
    variants?: WPProductVariant[];
    related_products?: Array<number | { ID?: number } | { id?: number }>;
    default_variant_slug?: string;
    family_name_th?: string;
    family_name_en?: string;
    focus_keyword_th?: string;
    focus_keyword_en?: string;
    faq_items?: WPFaqItem[];
  };

  _embedded?: WPEmbedded;
}

export type ProductContent = {
  id: string;
  slug: string;
  name: string;
  itemCode: string;
  categorySlug: string;

  description?: string;
  images: {
    src: string;
    alt?: string;
  }[];

  // dynamic specifications
  specs?: {
    key: string;
    value: string;
  }[];
};
