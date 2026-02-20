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

export interface HomeContent {
  hero: {
    slides: {
      id: number;
      title: LocalizedText;
      subtitle: LocalizedText;
      description: LocalizedText;
      image: ImageAsset;
      ctaPrimary: CTA;
      ctaSecondary: CTA;
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
  source_url: string;
}

export interface WPEmbedded {
  ["wp:featuredmedia"]?: WPFeaturedMedia[];
  ["wp:term"]?: WPTerm[][];
}

// ---------------------------
// WP Article (CPT: article)
// ---------------------------

export interface WPArticle {
  id: number;
  slug: string;
  date: string;

  acf?: {
    title_th?: string;
    title_en?: string;
    excerpt_th?: string;
    excerpt_en?: string;
    content_th?: string;
    content_en?: string;
    image_alt_th?: string;
    image_alt_en?: string;
  };

  _embedded?: WPEmbedded;
}

// ---------------------------
// WP Product (CPT: product)
// ---------------------------

export type WPSpec = {
  spec_label?: string
  spec_value?: string
}

export type WPProduct = {
  id: number
  slug: string
  featured_media: number
  product_category: number[]

  acf?: {
    name_th?: string
    name_en?: string
    description_th?: string
    description_en?: string
    image_alt_th?: string
    image_alt_en?: string
    specs_json?: string
  }

  _embedded?: {
    "wp:featuredmedia"?: {
      source_url?: string
    }[]

    "wp:term"?: {
      id: number
      slug: string
    }[][]
  }
}


export type ProductContent = {
  id: string
  slug: string
  name: string
  itemCode: string
  categorySlug: string

  description?: string
  images: {
    src: string
    alt?: string
  }[]

  // dynamic specifications
  specs?: {
    key: string
    value: string
  }[]
}