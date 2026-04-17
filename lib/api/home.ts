import { getCategories } from "@/app/lib/api/categories"
import { getHeroSlides } from "@/app/lib/api/hero"
import { getProducts } from "@/app/lib/api/products"
import type { CategoryView, HeroSlideView, ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"
import type {
  ClientsSectionModel,
  FooterModel,
  HeroModel,
  NavLink,
  OrganicHomepageData,
  ProductCardModel,
  PromoModel,
  ReviewModel,
  StoryModel,
} from "@/types/homepage"

type Locale = "th" | "en"

const PLACEHOLDER_IMAGE = "/placeholder.jpg"

function toHeroModel(slide: HeroSlideView): HeroModel {
  return {
    title: slide.title,
    description: slide.description,
    ctaLabel: slide.ctaPrimary.label,
    ctaHref: slide.ctaPrimary.href,
    image: {
      src: slide.image.src || PLACEHOLDER_IMAGE,
      alt: slide.image.alt || slide.title,
    },
  }
}

function toProductCardModel(product: ProductView, locale: Locale): ProductCardModel {
  return {
    id: Number(product.id),
    href: withLocalePath(`/categories/${product.categorySlug}/${product.slug}`, locale),
    image: {
      src: product.image.src || PLACEHOLDER_IMAGE,
      alt: product.image.alt || product.name,
    },
    category: product.categorySlug.replace(/-/g, " ").toUpperCase(),
    name: product.name,
    price: "",
  }
}

function toStoryModel(category: CategoryView, locale: Locale): StoryModel {
  return {
    id: Number(category.id),
    name: category.name,
    href: withLocalePath(`/categories/${category.slug}`, locale),
    image: category.image ?? { src: PLACEHOLDER_IMAGE, alt: category.name },
  }
}

function toPromoModel(categories: CategoryView[], locale: Locale): PromoModel {
  const squareItems: NavLink[] = categories.slice(0, 4).map((category) => ({
    href: withLocalePath(`/categories/${category.slug}`, locale),
    label: category.name,
  }))

  return {
    leftTitle: locale === "th" ? "ครั้งแรกกับเรา?" : "First Time Here?",
    leftDescription:
      locale === "th"
        ? "สำรวจสินค้าของเราและติดต่อขอรับใบเสนอราคาได้เลย"
        : "Explore our products and request a quote today.",
    leftCtaLabel: locale === "th" ? "ดูสินค้าทั้งหมด" : "Browse Products",
    leftCtaHref: withLocalePath("/categories", locale),
    squareItems,
    rightCtaLabel: locale === "th" ? "เกี่ยวกับเรา" : "Our Story",
    rightCtaHref: withLocalePath("/about", locale),
  }
}

function toFooterModel(categories: CategoryView[], locale: Locale): FooterModel {
  const shopLinks: NavLink[] = categories.slice(0, 4).map((category) => ({
    href: withLocalePath(`/categories/${category.slug}`, locale),
    label: category.name,
  }))

  return {
    newsletterDescription:
      locale === "th"
        ? "รับข่าวสาร สินค้าใหม่ และโปรโมชั่นพิเศษ"
        : "Sign up for news, new products, and exclusive offers.",
    newsletterPlaceholder: locale === "th" ? "อีเมลของคุณ" : "Your email address",
    shopLinks,
    aboutLinks: [
      { href: withLocalePath("/about", locale), label: locale === "th" ? "เกี่ยวกับเรา" : "Our Story" },
      { href: withLocalePath("/categories", locale), label: locale === "th" ? "สินค้า" : "Products" },
      { href: withLocalePath("/articles", locale), label: locale === "th" ? "บทความ" : "Articles" },
    ],
    supportLinks: [
      { href: withLocalePath("/contact", locale), label: locale === "th" ? "ติดต่อเรา" : "Contact Us" },
    ],
    journalLinks: [
      { href: withLocalePath("/articles", locale), label: locale === "th" ? "บทความ" : "Articles" },
    ],
    copyright: `© ${new Date().getFullYear()} 168 Innovative. All rights reserved.`,
  }
}

const FALLBACK_REVIEWS: ReviewModel[] = [
  {
    id: 1,
    quote:
      "สินค้าคุณภาพดีมาก บรรจุภัณฑ์แข็งแรง ส่งไวมาก แนะนำเลยครับ",
    name: "คุณสมชาย",
    role: "ลูกค้าที่ยืนยันแล้ว",
    avatar: { src: PLACEHOLDER_IMAGE, alt: "คุณสมชาย" },
    stars: "★★★★★",
  },
  {
    id: 2,
    quote:
      "Great quality packaging products. Fast delivery and professional service.",
    name: "Sarah T.",
    role: "Verified Buyer",
    avatar: { src: PLACEHOLDER_IMAGE, alt: "Sarah T." },
    stars: "★★★★★",
  },
]

function buildClientsSection(locale: Locale): ClientsSectionModel {
  return {
    headline: locale === "th" ? "การันตีคุณภาพกว่า" : "Quality trusted by over",
    stat: "100,000+",
    subheadline: locale === "th" ? "ผลิตภัณฑ์ที่ลูกค้าไว้ใจเรา" : "Products our customers trust",
    ctaLabel: locale === "th" ? "ดูสินค้าทั้งหมด" : "Browse Products",
    ctaHref: withLocalePath("/categories", locale),
    clients: [], // เพิ่มรายชื่อลูกค้าในอนาคต
  }
}

const USP_ITEMS_TH = [
  "จัดส่งทั่วประเทศ",
  "มาตรฐานสากล",
  "บรรจุภัณฑ์คุณภาพสูง",
  "บริการครบวงจร",
]

const USP_ITEMS_EN = [
  "Nationwide Delivery",
  "International Standards",
  "Premium Packaging",
  "Full-Service Support",
]

export async function getOrganicHomepageData(
  locale: Locale = "en"
): Promise<OrganicHomepageData> {
  let heroSlides: HeroSlideView[] = []
  let products: ProductView[] = []
  let categories: CategoryView[] = []

  try {
    ;[heroSlides, products, categories] = await Promise.all([
      getHeroSlides(locale).catch(() => []),
      getProducts(locale).catch(() => []),
      getCategories(locale).catch(() => []),
    ])
  } catch {
    heroSlides = []
    products = []
    categories = []
  }

  const hero: HeroModel =
    heroSlides[0] != null
      ? toHeroModel(heroSlides[0])
      : {
          title: locale === "th" ? "บรรจุภัณฑ์คุณภาพสูง" : "Premium Packaging Solutions",
          description:
            locale === "th"
              ? "ผลิตภัณฑ์บรรจุภัณฑ์คุณภาพสูงสำหรับทุกอุตสาหกรรม"
              : "High-quality packaging products for every industry.",
          ctaLabel: locale === "th" ? "ดูสินค้า" : "View Products",
          ctaHref: withLocalePath("/categories", locale),
          image: { src: PLACEHOLDER_IMAGE, alt: "Hero" },
        }

  const bestsellingProducts = products
    .slice(0, 4)
    .map((product) => toProductCardModel(product, locale))

  const ingredientStories = categories
    .slice(0, 8)
    .map((category) => toStoryModel(category, locale))

  return {
    headerLinks: [
      { href: withLocalePath("/categories", locale), label: locale === "th" ? "สินค้า" : "Shop" },
      { href: withLocalePath("/categories", locale), label: locale === "th" ? "สินค้ายอดนิยม" : "Bestsellers" },
      { href: withLocalePath("/about", locale), label: locale === "th" ? "เกี่ยวกับเรา" : "About Us" },
      { href: withLocalePath("/articles", locale), label: locale === "th" ? "บทความ" : "Journal" },
      { href: withLocalePath("/contact", locale), label: locale === "th" ? "ติดต่อ" : "Contact" },
    ],
    hero,
    uspItems: locale === "th" ? USP_ITEMS_TH : USP_ITEMS_EN,
    bestsellingProducts,
    ingredientStories,
    promo: toPromoModel(categories, locale),
    reviews: FALLBACK_REVIEWS,
    reviewCountLabel: locale === "th" ? "ลูกค้ากว่า 1,000+ ราย" : "Trusted by 1,000+ Customers",
    clientsSection: buildClientsSection(locale),
    footer: toFooterModel(categories, locale),
  }
}
