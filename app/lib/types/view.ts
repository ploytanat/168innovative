// Category
export interface CategoryView {
  id: string
  slug: string
  name: string
  image?: {
    src: string
    alt: string
  }
  description?:string
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
  socials:SocialView[]
}

// Why
export interface WhyItemView {
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

// Home (optional แต่จะดีมาก)
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
