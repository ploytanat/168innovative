// types/view.ts

/* =======================
   Shared / Base
======================= */

export interface ImageView {
  src: string
  alt: string
}

/* =======================
   Category
======================= */

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

/* =======================
   Social / Company
======================= */

export type SocialType = 'facebook' | 'line' | 'instagram' | 'shopee'

export interface SocialView {
  type: SocialType
  url: string
  icon: ImageView
}

export interface CompanyView {
  logo:ImageView
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
}

/* =======================
   Product
======================= */

export interface ProductView {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  image: ImageView
  price?: string
}

/* =======================
   Why Choose Us
======================= */

export interface WhyItemView {
  title: string
  description: string
  image?: ImageView
}

/* =======================
   Hero (Home)
======================= */

export interface HeroView {
  title: string
  description: string
  image: ImageView
  ctaPrimary: {
    label: string
    href: string
  }
  ctaSecondary: {
    label: string
    href: string
  }
}

/* =======================
   Home
======================= */

export interface HomeView {
  hero: HeroView
  categories: CategoryView[]
  products: ProductView[]
  why: WhyItemView[]
  company: CompanyView
  seo: {
    title: string
    description: string
    keywords?: string[]
  }
}

/* =======================
   About
======================= */

export interface AboutHeroView {
  title: string
  description: string
  image: ImageView
}

export interface AboutSectionView {
  title: string
  description: string
}

export interface AboutView {
  hero: AboutHeroView

  // Who We Are (รองรับรูปที่ 2)
  whoAreWe: AboutSectionView & {
    image?: ImageView
  }

  // Why Choose Us (reuse component)
  why: {
    title: string
    items: WhyItemView[]
  }
}
// == Article View ==

export interface ArticleView {
  id: string
  slug: string

  title: string
  excerpt: string
  content: string

  coverImage?: ImageView
  category?: string
  publishedAt: string
}
