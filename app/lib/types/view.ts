// types/view.ts

// Category
export interface CategoryView {
  id: string
  slug: string
  name: string
  image?: {
    src: string
    alt: string
  }
  description?: string
  // เพิ่มส่วนนี้เพื่อแสดงผลคำบรรยาย SEO ด้านล่างหน้า All Categories
  seoTitle?: string      // เช่น "หมวดหมู่ตลับแป้งและอุปกรณ์แพคเกจจิ้ง"
  seoDescription?: string // เช่น "เรามีตลับแป้งและบรรจุภัณฑ์หลากหลายประเภท..."
}

export interface SocialView {
  type: string
  url: string
  icon: {
    src: string
    alt: string
  }
}

// Product
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

// Company
export interface CompanyView {
  name: string
  address: string
  phones: {
    number: string
    label: string
  }[]
  email: string[]
  socials: SocialView[]
  lineQrCode?: {
    src: string
    alt: string
  }
  contactImage?: {
    src: string
    alt: string
  }
}

//about us
export interface AboutView {
  hero: {
    title: string
    description: string
    image: { src: string; alt: string }
  }
  whoWeAre: {
    title: string
    description: string
    quote: string
    image: { src: string; alt: string }
  }
}

// Why
export interface WhyItemView {
  image?: {
    src: string
    alt: string
  }
  title: string
  description: string
}

// Hero
export interface HeroView {
  title: string
  description: string
  image: {
    src: string
    alt: string
  }
  ctaPrimary: {
    href: string
    label: string
  }
  ctaSecondary: {
    href: string
    label: string
  }
}

// Home (ดึง SEO มาเป็นชุดข้อมูลที่พร้อมใช้)
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