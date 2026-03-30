import { normalizeRichText } from "../api/acf"
import { shouldIndexProduct } from "../seo/indexability"
import type { Locale, LocalizedText } from "../types/content"
import type {
  AboutView,
  ArticleView,
  CategoryView,
  CompanyView,
  HeroSlideView,
  ProductView,
  WhyItemView,
} from "../types/view"
import { aboutMock } from "./about.mock"
import { articlesMock } from "./articles.mock"
import { categoriesMock } from "./categories.mock"
import { companyMock } from "./company.mock"
import { homeMock } from "./home.mock"
import { productsMock } from "./products.mock"
import { seoMock } from "./seo.mock"
import { whyMock } from "./why.mock"

const PRODUCTS_PER_PAGE = 15
const MOCK_LAST_MODIFIED = "2026-03-01T00:00:00.000Z"
type MockArticleSitemapView = Pick<
  ArticleView,
  "slug" | "canonicalUrl" | "publishedAt" | "updatedAt"
>

declare global {
  var __MOCK_MODE_STATUS_LOGGED__:
    | Set<string>
    | undefined
}

function pickLocalized(locale: Locale, value?: LocalizedText, fallback = "") {
  return value?.[locale] ?? value?.th ?? value?.en ?? fallback
}

function mapLocalizedImage(
  locale: Locale,
  image:
    | {
        src: string
        alt: LocalizedText
      }
    | undefined,
  fallbackAlt = ""
) {
  if (!image) return undefined

  return {
    src: image.src,
    alt: pickLocalized(locale, image.alt, fallbackAlt),
  }
}

function getMockCategoriesRaw() {
  return categoriesMock
}

function getMockProductsRaw() {
  return productsMock
}

function getMockArticlesRaw() {
  return Array.from(new Map(articlesMock.map((article) => [article.slug, article])).values())
}

function findCategoryById(categoryId: string) {
  return getMockCategoriesRaw().find((category) => category.id === categoryId)
}

function mapCategoryToView(category: (typeof categoriesMock)[number], locale: Locale): CategoryView {
  return {
    id: category.id,
    slug: category.slug,
    name: pickLocalized(locale, category.name),
    description: pickLocalized(locale, category.description),
    image: mapLocalizedImage(locale, category.image, pickLocalized(locale, category.name)),
    introHtml: undefined,
    faqItems: [],
    seoTitle: pickLocalized(locale, category.seoTitle, pickLocalized(locale, category.name)),
    seoDescription: pickLocalized(locale, category.seoDescription),
  }
}

function mapProductToView(product: (typeof productsMock)[number], locale: Locale): ProductView {
  const category = findCategoryById(product.categoryId)

  return {
    id: product.id,
    slug: product.slug,
    name: pickLocalized(locale, product.name),
    description: pickLocalized(locale, product.description),
    image: mapLocalizedImage(locale, product.image, pickLocalized(locale, product.name)) ?? {
      src: "/placeholder.jpg",
      alt: pickLocalized(locale, product.name),
    },
    categoryId: product.categoryId,
    categorySlug: category?.slug ?? "",
    specs: [],
    contentHtml: undefined,
    applicationHtml: undefined,
    faqItems: [],
    price: undefined,
  }
}

function mapArticleToView(article: (typeof articlesMock)[number], locale: Locale): ArticleView {
  const title = pickLocalized(locale, article.title)
  const excerpt = pickLocalized(locale, article.excerpt)
  const content = normalizeRichText(pickLocalized(locale, article.content)) ?? ""

  return {
    id: article.id,
    slug: article.slug,
    title,
    excerpt,
    content,
    blocks: [],
    authorName: "168 Innovative",
    coverImage: mapLocalizedImage(locale, article.coverImage, title),
    category: article.category,
    tags: [],
    publishedAt: article.publishedAt,
    updatedAt: article.publishedAt,
    seoTitle: title,
    metaDescription: excerpt,
    canonicalUrl: undefined,
    focusKeyword: undefined,
    readingTimeMinutes: undefined,
    faqItems: [],
  }
}

export function isMockModeEnabled() {
  const value = process.env.NEXT_PUBLIC_USE_MOCK

  if (!value) {
    logMockModeStatusOnce(false)
    return false
  }

  const normalized = value.trim().toLowerCase()
  const enabled =
    normalized === "true" || normalized === "1" || normalized === "yes"

  logMockModeStatusOnce(enabled)

  return enabled
}

function logMockModeStatusOnce(enabled: boolean) {
  if (!globalThis.__MOCK_MODE_STATUS_LOGGED__) {
    globalThis.__MOCK_MODE_STATUS_LOGGED__ = new Set()
  }

  const key = [
    process.env.NODE_ENV ?? "",
    process.env.VERCEL_ENV ?? "",
    process.env.VERCEL_TARGET_ENV ?? "",
    process.env.NEXT_PUBLIC_USE_MOCK ?? "",
    enabled ? "enabled" : "disabled",
  ].join("|")

  if (globalThis.__MOCK_MODE_STATUS_LOGGED__.has(key)) {
    return
  }

  globalThis.__MOCK_MODE_STATUS_LOGGED__.add(key)

  console.info("[mock-mode]", {
    enabled,
    nodeEnv: process.env.NODE_ENV ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelTargetEnv: process.env.VERCEL_TARGET_ENV ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
    nextPublicUseMock: process.env.NEXT_PUBLIC_USE_MOCK ?? null,
  })
}

export function getMockHeroSlides(locale: Locale): HeroSlideView[] {
  return homeMock.hero.slides.map((slide) => ({
    id: slide.id,
    title: pickLocalized(locale, slide.title),
    subtitle: pickLocalized(locale, slide.subtitle),
    description: pickLocalized(locale, slide.description),
    image: mapLocalizedImage(locale, slide.image, pickLocalized(locale, slide.title)) ?? {
      src: "/placeholder.jpg",
      alt: pickLocalized(locale, slide.title),
    },
    ctaPrimary: {
      href: slide.ctaPrimary.href,
      label: pickLocalized(locale, slide.ctaPrimary.label),
    },
    ctaSecondary: slide.ctaSecondary
      ? {
          href: slide.ctaSecondary.href,
          label: pickLocalized(locale, slide.ctaSecondary.label),
        }
      : undefined,
  }))
}

export function getMockCategories(locale: Locale): CategoryView[] {
  return getMockCategoriesRaw().map((category) => mapCategoryToView(category, locale))
}

export function getMockAllCategorySlugs() {
  return getMockCategoriesRaw().map((category) => category.slug)
}

export function getMockCategoryBySlug(slug: string, locale: Locale) {
  const category = getMockCategoriesRaw().find((item) => item.slug === slug)
  return category ? mapCategoryToView(category, locale) : null
}

export function getMockCategoryIdBySlug(slug: string) {
  const categoryIndex = getMockCategoriesRaw().findIndex((item) => item.slug === slug)
  return categoryIndex >= 0 ? categoryIndex + 1 : null
}

export function getMockProducts(locale: Locale): ProductView[] {
  return getMockProductsRaw().map((product) => mapProductToView(product, locale))
}

export function getMockProductsByCategory(slug: string, locale: Locale, page = 1) {
  const products = getMockProducts(locale).filter((product) => product.categorySlug === slug)
  const totalCount = products.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PRODUCTS_PER_PAGE))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE

  return {
    products: products.slice(start, start + PRODUCTS_PER_PAGE),
    totalPages,
    totalCount,
  }
}

export function getMockAllProductsByCategory(slug: string, locale: Locale) {
  return getMockProducts(locale).filter((product) => product.categorySlug === slug)
}

export function getMockProductBySlug(slug: string, locale: Locale) {
  const product = getMockProductsRaw().find((item) => item.slug === slug)
  return product ? mapProductToView(product, locale) : null
}

export function getMockRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  locale: Locale
) {
  return getMockProducts(locale)
    .filter(
      (product) =>
        product.categorySlug === categorySlug && product.id !== currentProductId
    )
    .slice(0, 4)
}

export function getMockAllProductsForSitemap() {
  return getMockProducts("th")
    .filter((product) => product.categorySlug)
    .map((product) => ({
      slug: product.slug,
      modified: MOCK_LAST_MODIFIED,
      categorySlug: product.categorySlug,
    }))
}

export function getMockIndexableProductsForSitemap() {
  return getMockProductsRaw()
    .map((product) => {
      const thProduct = mapProductToView(product, "th")
      const enProduct = mapProductToView(product, "en")

      if (!thProduct.categorySlug) {
        return null
      }

      return {
        slug: product.slug,
        modified: MOCK_LAST_MODIFIED,
        categorySlug: thProduct.categorySlug,
        indexTh: shouldIndexProduct(thProduct),
        indexEn: shouldIndexProduct(enProduct),
      }
    })
    .filter(
      (
        product
      ): product is {
        slug: string
        modified: string
        categorySlug: string
        indexTh: boolean
        indexEn: boolean
      } => product !== null
    )
}

export function getMockCompany(locale: Locale): CompanyView {
  return {
    logo: mapLocalizedImage(locale, companyMock.logo, "168 Innovative") ?? {
      src: "/logo.png",
      alt: "168 Innovative",
    },
    name: pickLocalized(locale, companyMock.name),
    address: pickLocalized(locale, companyMock.address),
    phones: companyMock.phones.map((phone) => ({
      number: phone.number,
      label: pickLocalized(locale, phone.label),
    })),
    email: [...companyMock.email],
    socials: companyMock.socials.map((social) => ({
      type: social.type,
      url: social.url,
      icon: social.icon
        ? {
            src: social.icon.src,
            alt: social.icon.alt,
          }
        : undefined,
    })),
    lineQrCode: mapLocalizedImage(locale, companyMock.lineQrCode, "LINE QR code"),
    contactImage: mapLocalizedImage(
      locale,
      companyMock.contactImage,
      "168 Innovative"
    ),
    contactGallery: companyMock.contactGallery?.map((image) => ({
      src: image.src,
      alt: pickLocalized(locale, image.alt),
    })),
  }
}

export function getMockAbout(locale: Locale): Omit<AboutView, "why"> {
  return {
    hero: {
      title: pickLocalized(locale, aboutMock.hero.title),
      description: pickLocalized(locale, aboutMock.hero.description),
      image1: mapLocalizedImage(
        locale,
        aboutMock.hero.image,
        pickLocalized(locale, aboutMock.hero.title)
      ),
      image2: undefined,
    },
    whoAreWe: {
      title: pickLocalized(locale, aboutMock.whoAreWe.title),
      description: pickLocalized(locale, aboutMock.whoAreWe.description),
      image: mapLocalizedImage(
        locale,
        aboutMock.whoAreWe.image,
        pickLocalized(locale, aboutMock.whoAreWe.title)
      ),
    },
    seoTitle: pickLocalized(locale, seoMock.about.title),
    seoDescription: pickLocalized(locale, seoMock.about.description),
  }
}

export function getMockWhy(locale: Locale): WhyItemView[] {
  return whyMock.map((item) => ({
    title: pickLocalized(locale, item.title),
    description: pickLocalized(locale, item.description),
    image: mapLocalizedImage(locale, item.image, pickLocalized(locale, item.title)),
  }))
}

export function getMockArticles(locale: Locale): ArticleView[] {
  return getMockArticlesRaw().map((article) => mapArticleToView(article, locale))
}

export function getMockArticlesForSitemap(locale: Locale): MockArticleSitemapView[] {
  return getMockArticles(locale).map((article) => ({
    slug: article.slug,
    canonicalUrl: article.canonicalUrl,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
  }))
}

export function getMockAllArticleSlugs() {
  return getMockArticlesRaw().map((article) => article.slug)
}

export function getMockArticleBySlug(slug: string, locale: Locale) {
  const article = getMockArticlesRaw().find((item) => item.slug === slug)
  return article ? mapArticleToView(article, locale) : null
}

export function getMockLastModified() {
  return MOCK_LAST_MODIFIED
}
