// types/content.ts

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

//== Hero ==

export interface HeroSection {
  title: LocalizedText;
  description: LocalizedText;
  image: ImageAsset;
  ctaPrimary: CTA;
  ctaSecondary: CTA;
}

//== SEO ==
export interface SEOContent {
  title: LocalizedText;
  description: LocalizedText;
  keywords?: string[];
}

// == HomePage ==
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

//== category ==
export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText; 
  image?: ImageAsset;
  seoTitle?: LocalizedText; // หัวข้อใหญ่ (H1/H2) ด้านล่าง
  seoDescription?: LocalizedText; // เนื้อหายาวๆ ที่เน้น Keywords
}

//== product ==
export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  image: ImageAsset;
  price?: string;
}

//=== company ===
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

//== about us ==
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

//== why choose us ==
export interface WhyItem {
  image: ImageAsset;
  title: LocalizedText;
  description: LocalizedText;
}

// == Article / Blog ==
export interface Article {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText; // เนื้อหายาว (markdown หรือ html ก็ได้)
  coverImage?: ImageAsset;
  category?: string; // เช่น "packaging", "oem", "knowledge"
  publishedAt: string; // ISO date
}
