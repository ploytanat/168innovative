
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

export interface SocialLink {
  type: 'facebook' | 'line' | 'instagram' | 'shopee'
  icon:{
    src:string
    alt:string
  }
  url: string
}

export interface ContactPhone {
  number: string
  label: LocalizedText
}

//== Hero ==

export interface HeroSection {
  title: LocalizedText
  description: LocalizedText
  image: ImageAsset
  ctaPrimary: CTA
  ctaSecondary: CTA
}

//== SEO ==
export interface SEOContent {
  title: LocalizedText
  description: LocalizedText
  keywords?: string[]
}


//== Home ==
export interface HomeContent {
  hero: HeroSection
  why: {
    title: LocalizedText
    description: LocalizedText
  }[]
  seo: SEOContent
}

//== category ==
export interface Category {
  id: string
  slug: string
  description: LocalizedText
  name: LocalizedText
  image?: ImageAsset
}

//== product ==
export interface Product {
  id: string
  slug: string
  name: LocalizedText
  description: LocalizedText
  categoryId: string
  image: ImageAsset
  price?:string
}



//=== company ===
export interface CompanyInfo {
  name: LocalizedText
  address: LocalizedText
  phones: ContactPhone[]
  email: string[]
  socials: SocialLink[]
}


//== why choose us ==
export interface WhyItem {
  title: LocalizedText
  description: LocalizedText
}

