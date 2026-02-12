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
  contactGallery?: ImageView[]
}

// ==  Product ==

export interface ProductView {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  image: ImageView
  price?: string
  //createdAt: string
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


export interface HeroSlideView {
  id: number
  title: string
  subtitle: string
  description: string
  image: ImageView
  ctaPrimary: {
    href: string
    label: string
  }
  ctaSecondary: {
    href: string
    label: string
  }

}
/* =======================
   Home
======================= */

export interface HomeView {
  hero: HomeHeroView
}



export interface HomeHeroView {
  slides: HeroSlideView[]
}
/* =======================
   About
======================= */

export interface AboutHeroView {
  title: string
  description: string
  eyebrow?: string
  cta?: {
    label: string
    href: string
  }
  image?: ImageView
}

export interface AboutSectionView {
  title: string
  description: string
  quote?: string
  image?: ImageView
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
