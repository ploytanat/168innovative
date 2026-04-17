export interface ImageAsset {
  src: string
  alt: string
}

export interface NavLink {
  href: string
  label: string
}

export interface HeroPromoCard {
  id: number
  label: string
  exploreLabel: string
  href: string
  image: ImageAsset
  bgColor: string
}

export interface HeroModel {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  image: ImageAsset
  bgColor: string
  promoCards: HeroPromoCard[]
}

export interface ProductCardModel {
  id: number
  href: string
  image: ImageAsset
  category: string
  name: string
  price: string
}

export interface StoryModel {
  id: number
  name: string
  href: string
  image: ImageAsset
}

export interface PromoModel {
  leftTitle: string
  leftDescription: string
  leftCtaLabel: string
  leftCtaHref: string
  squareItems: NavLink[]
  rightCtaLabel: string
  rightCtaHref: string
}

export interface ReviewModel {
  id: number
  quote: string
  name: string
  role: string
  avatar: ImageAsset
  stars: string
}

export interface FooterModel {
  newsletterDescription: string
  newsletterPlaceholder: string
  shopLinks: NavLink[]
  aboutLinks: NavLink[]
  supportLinks: NavLink[]
  journalLinks: NavLink[]
  copyright: string
}

export interface ClientModel {
  id: number
  name: string
  logo?: string
}

export interface ClientsSectionModel {
  headline: string
  stat: string
  subheadline: string
  ctaLabel: string
  ctaHref: string
  clients: ClientModel[]
}

export interface OrganicHomepageData {
  brandName: string
  searchHref: string
  headerLinks: NavLink[]
  hero: HeroModel
  uspItems: string[]
  bestsellingProducts: ProductCardModel[]
  ingredientStories: StoryModel[]
  promo: PromoModel
  reviews: ReviewModel[]
  reviewCountLabel: string
  clientsSection: ClientsSectionModel
  footer: FooterModel
}
