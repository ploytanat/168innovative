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

export interface ProductView {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  image: ImageView
  price?: string
  categorySlug: string
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
  // eyebrow?: string // ลบออกถ้าไม่ได้ใช้ใน ACF
  // cta?: { label: string; href: string } // ลบออกถ้าไม่ได้ใช้ใน ACF
 image1?: ImageView   // ✅ เพิ่ม image1
  image2?: ImageView
}

export interface AboutSectionView {
  title: string
  description: string
  // quote?: string // ลบออกถ้าไม่ได้ใช้ใน ACF
  image?: ImageView   // รูปสำหรับส่วน Who Are We
}

export interface AboutView {
  hero: AboutHeroView

  whoAreWe: AboutSectionView

  why: {
    title: string
    items: WhyItemView[] // รองรับ Array ของ Why Choose Us ที่ await มา
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
