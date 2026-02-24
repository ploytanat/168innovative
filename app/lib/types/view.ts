// types/view.ts

// == Shared / Base == 
export interface ImageView {
  src: string
  alt: string
}

// == Category ==
export interface CategoryView {
  id: string
  slug: string
  name: string
  description?: string

  image?: ImageView

  // SEO display content
  seoTitle?: string
  seoDescription?: string
}

// == Social / Company==
export type SocialType =
  | 'facebook'
  | 'line'
  | 'instagram'
  | 'shopee'
  | string   // 🔥 เพิ่มเผื่อ WP ใส่ type อื่นมา

export interface SocialView {
  type: SocialType
  url: string
  icon?: ImageView   // 🔥 ทำให้ optional
}

export interface CompanyView {
  logo: ImageView
  name: string
  address: string

  phones: {
    number: string
    label: string
  }[]

  email: string[]

  socials: SocialView[]

  lineQrCode?: ImageView
  contactImage?: ImageView
  contactGallery?: ImageView[]
}

// ==  Product ==
/* ================= Product Spec ================= */

export type ProductSpecView = {
  label: string
  value: string
}

/* ================= Product View ================= */

export type ProductView = {
  id: string
  slug: string

  name: string
  description: string

  image: {
    src: string
    alt: string
  }

  categoryId: string
  categorySlug: string

  specs: ProductSpecView[]   // ไม่ optional

  price?: number
}

// === Why Choose Us === 
export interface WhyItemView {
  title: string
  description: string
  image?: ImageView
}

// === Hero (Home)===
// === Hero (Home) ===

export type HeroLayoutType = 'split' | 'fullBg'

export interface HeroStatView {
  label: string
  value: string
}

export interface HeroCTAView {
  href: string
  label: string
}

export interface HeroSlideView {
  id: number

  // Layout control (default = split)
  layout?: HeroLayoutType

  // Content
  title: string
  subtitle?: string
  description: string

  image: ImageView

  // CTA
  ctaPrimary: HeroCTAView
  ctaSecondary?: HeroCTAView

  // Bottom stats (optional)
  stats?: HeroStatView[]
}

export interface HomeHeroView {
  slides: HeroSlideView[]
}
/* === Home ==== */
export interface HomeView {
  hero: HomeHeroView
}

export interface HomeHeroView {
  slides: HeroSlideView[]
}

/* === About === */
export interface AboutHeroView {
  title: string
  description: string
  image1?: ImageView 
  image2?: ImageView
}

export interface AboutSectionView {
  title: string
  description: string
  image?: ImageView
}

export interface AboutView {
  hero: AboutHeroView

  whoAreWe: AboutSectionView

  why: {
    title: string
    items: WhyItemView[]
  }
}

// == Article View ==

export interface TagView {
  id: number
  slug: string
  name: string
}

export interface ArticleView {
  id: string
  slug: string

  title: string
  excerpt: string
  content: string

  coverImage?: ImageView
  category?: string
  tags: TagView[]
  publishedAt: string
}
