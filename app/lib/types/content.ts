
export type Locale = 'th' | 'en'

export type LocalizedText = {
  th: string
  en: string
}

export interface ImageAsset {
  src: string
  alt: LocalizedText
}

export interface CTA {
  label: LocalizedText
  href: string
}

export interface HeroSection {
  title: LocalizedText
  description: LocalizedText
  image: ImageAsset
  ctaPrimary: CTA
  ctaSecondary: CTA
}

export interface SEOContent {
  title: LocalizedText
  description: LocalizedText
  keywords?: string[]
}

export interface HomeContent {
  hero: HeroSection
  why: {
    title: LocalizedText
    description: LocalizedText
  }[]
  seo: SEOContent
}



export interface Category {
  id: string
  slug: string
  name: LocalizedText
  image?: ImageAsset
}
export interface CategoryView {
  id: string
  slug: string
  name: string
  image?: {
    src: string
    alt: string
  }
}

export interface Product {
  id: string
  slug: string
  name: LocalizedText
  description: LocalizedText
  categoryId: string
  image: ImageAsset
}

export interface ProductView {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  image: {
    src: string
    alt: string
  }
  price?: string
}

export interface ContactPhone {
  number: string
  label: LocalizedText
}


export interface CompanyInfo {
  name: LocalizedText
  address: LocalizedText
  phones: ContactPhone[]
  email: string[]
}

export interface CompanyView {
  name: string
  address: string
  phones: {
    number: string
    label: string
  }[]
  email: string[]
}



export interface WhyItem {
  title: LocalizedText
  description: LocalizedText
}
