import { normalizeRichText } from "../api/acf"
import { shouldIndexProduct } from "../seo/indexability"
import type { Locale, LocalizedText } from "../types/content"
import type {
  AboutView,
  ArticleView,
  CategoryView,
  CompanyView,
  HeroSlideView,
  ImageView,
  ProductSpecView,
  ProductVariantOptionView,
  ProductVariantView,
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

type MockVariantOptionConfig = {
  groupKey: string
  groupLabel: LocalizedText
  valueKey?: string
  valueLabel: LocalizedText
}

type MockVariantConfig = {
  slug: string
  sku?: string
  options: MockVariantOptionConfig[]
  specs?: Array<{
    label: LocalizedText
    value: LocalizedText
  }>
}

type MockProductFamilyConfig = {
  familySlug: string
  familyName: LocalizedText
  description?: LocalizedText
  members: MockVariantConfig[]
}

const MOCK_PRODUCT_FAMILIES: MockProductFamilyConfig[] = [
  {
    familySlug: "spout-screw-cap",
    familyName: {
      th: "จุกเกลียวพลาสติก",
      en: "Plastic Screw Spout",
    },
    description: {
      th: "จุกเกลียวสำหรับซองบรรจุภัณฑ์ที่เลือกขนาดคอได้ตามงานใช้งาน",
      en: "Screw spout family for pouch packaging with selectable neck sizes.",
    },
    members: [
      {
        slug: "spout-screw-cap-16mm",
        sku: "SP-SC-16",
        options: [
          {
            groupKey: "size",
            groupLabel: { th: "ขนาด", en: "Size" },
            valueKey: "16mm",
            valueLabel: { th: "16 mm", en: "16 mm" },
          },
        ],
        specs: [
          {
            label: { th: "ขนาดคอ", en: "Neck Size" },
            value: { th: "16 mm", en: "16 mm" },
          },
        ],
      },
      {
        slug: "spout-screw-cap-20mm",
        sku: "SP-SC-20",
        options: [
          {
            groupKey: "size",
            groupLabel: { th: "ขนาด", en: "Size" },
            valueKey: "20mm",
            valueLabel: { th: "20 mm", en: "20 mm" },
          },
        ],
        specs: [
          {
            label: { th: "ขนาดคอ", en: "Neck Size" },
            value: { th: "20 mm", en: "20 mm" },
          },
        ],
      },
    ],
  },
  {
    familySlug: "cosmetic-jar",
    familyName: {
      th: "กระปุกครีม",
      en: "Cosmetic Jar",
    },
    description: {
      th: "กระปุกครีมทรงเดียวกัน เลือกความจุได้หลายขนาด",
      en: "Cosmetic jar family with multiple filling capacities.",
    },
    members: [
      {
        slug: "cosmetic-jar-50g",
        sku: "JAR-050",
        options: [
          {
            groupKey: "capacity",
            groupLabel: { th: "ความจุ", en: "Capacity" },
            valueKey: "50g",
            valueLabel: { th: "50 g", en: "50 g" },
          },
        ],
        specs: [
          {
            label: { th: "ความจุ", en: "Capacity" },
            value: { th: "50 g", en: "50 g" },
          },
        ],
      },
      {
        slug: "cosmetic-jar-100g",
        sku: "JAR-100",
        options: [
          {
            groupKey: "capacity",
            groupLabel: { th: "ความจุ", en: "Capacity" },
            valueKey: "100g",
            valueLabel: { th: "100 g", en: "100 g" },
          },
        ],
        specs: [
          {
            label: { th: "ความจุ", en: "Capacity" },
            value: { th: "100 g", en: "100 g" },
          },
        ],
      },
    ],
  },
  {
    familySlug: "airless-bottle",
    familyName: {
      th: "ขวด Airless",
      en: "Airless Bottle",
    },
    description: {
      th: "ขวด Airless สำหรับเซรั่มและสกินแคร์ที่ต้องการลดการสัมผัสอากาศ",
      en: "Airless bottle family for serums and skincare that need reduced air exposure.",
    },
    members: [
      {
        slug: "airless-bottle-30ml",
        sku: "AIRLESS-30",
        options: [
          {
            groupKey: "capacity",
            groupLabel: { th: "ความจุ", en: "Capacity" },
            valueKey: "30ml",
            valueLabel: { th: "30 ml", en: "30 ml" },
          },
        ],
        specs: [
          {
            label: { th: "ความจุ", en: "Capacity" },
            value: { th: "30 ml", en: "30 ml" },
          },
        ],
      },
      {
        slug: "airless-bottle-50ml",
        sku: "AIRLESS-50",
        options: [
          {
            groupKey: "capacity",
            groupLabel: { th: "ความจุ", en: "Capacity" },
            valueKey: "50ml",
            valueLabel: { th: "50 ml", en: "50 ml" },
          },
        ],
        specs: [
          {
            label: { th: "ความจุ", en: "Capacity" },
            value: { th: "50 ml", en: "50 ml" },
          },
        ],
      },
    ],
  },
]

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

function ensureGallery(image: ImageView, gallery: ImageView[] = []) {
  return Array.from(
    new Map([image, ...gallery].map((item) => [item.src, item])).values()
  )
}

function buildVariantGroups(variants: ProductVariantView[]) {
  const groups = new Map<
    string,
    {
      key: string
      label: string
      values: Map<string, { valueKey: string; valueLabel: string; variantSlug: string }>
    }
  >()

  variants.forEach((variant) => {
    variant.options.forEach((option) => {
      const existing = groups.get(option.groupKey)

      if (!existing) {
        groups.set(option.groupKey, {
          key: option.groupKey,
          label: option.groupLabel,
          values: new Map([
            [
              option.valueKey,
              {
                valueKey: option.valueKey,
                valueLabel: option.valueLabel,
                variantSlug: variant.slug,
              },
            ],
          ]),
        })
        return
      }

      if (!existing.values.has(option.valueKey)) {
        existing.values.set(option.valueKey, {
          valueKey: option.valueKey,
          valueLabel: option.valueLabel,
          variantSlug: variant.slug,
        })
      }
    })
  })

  return Array.from(groups.values()).map((group) => ({
    key: group.key,
    label: group.label,
    values: Array.from(group.values.values()),
  }))
}

function buildSearchText(product: ProductView) {
  return [
    product.slug,
    product.name,
    product.description,
    ...product.variants.flatMap((variant) => [
      variant.slug,
      variant.sku ?? "",
      variant.name,
      variant.description ?? "",
      ...variant.options.flatMap((option) => [option.groupLabel, option.valueLabel]),
    ]),
  ]
    .filter(Boolean)
    .join(" ")
}

function mapMockSpecRows(
  locale: Locale,
  specs?: MockVariantConfig["specs"]
): ProductSpecView[] {
  return (specs ?? []).map((spec) => ({
    label: pickLocalized(locale, spec.label),
    value: pickLocalized(locale, spec.value),
  }))
}

function mapMockSingleProductToView(
  product: (typeof productsMock)[number],
  locale: Locale
): ProductView {
  const category = findCategoryById(product.categoryId)
  const image =
    mapLocalizedImage(locale, product.image, pickLocalized(locale, product.name)) ?? {
      src: "/placeholder.jpg",
      alt: pickLocalized(locale, product.name),
    }
  const variant: ProductVariantView = {
    id: product.id,
    slug: product.slug,
    name: pickLocalized(locale, product.name),
    description: pickLocalized(locale, product.description),
    image,
    gallery: ensureGallery(image),
    specs: [],
    options: [],
  }
  const productView: ProductView = {
    id: product.id,
    slug: product.slug,
    name: variant.name,
    description: variant.description ?? "",
    image,
    categoryId: product.categoryId,
    categorySlug: category?.slug ?? "",
    gallery: variant.gallery,
    specs: variant.specs,
    contentHtml: undefined,
    applicationHtml: undefined,
    faqItems: [],
    price: undefined,
    sku: undefined,
    availabilityStatus: undefined,
    moq: undefined,
    leadTime: undefined,
    familySlug: product.slug,
    familyName: variant.name,
    variantCount: 1,
    variantSummary: undefined,
    variantGroups: [],
    variants: [variant],
    defaultVariantSlug: variant.slug,
    searchText: "",
  }

  return {
    ...productView,
    searchText: buildSearchText(productView),
  }
}

function mapMockFamilyToView(
  family: MockProductFamilyConfig,
  locale: Locale
): ProductView | null {
  const memberProducts = family.members
    .map((member) => {
      const product = getMockProductsRaw().find((item) => item.slug === member.slug)
      return product ? { member, product } : null
    })
    .filter(
      (
        item
      ): item is {
        member: MockVariantConfig
        product: (typeof productsMock)[number]
      } => item !== null
    )

  if (!memberProducts.length) {
    return null
  }

  const category = findCategoryById(memberProducts[0].product.categoryId)
  const variants = memberProducts.map<ProductVariantView>(({ member, product }) => {
    const image =
      mapLocalizedImage(locale, product.image, pickLocalized(locale, product.name)) ?? {
        src: "/placeholder.jpg",
        alt: pickLocalized(locale, product.name),
      }
    const options = member.options.map<ProductVariantOptionView>((option) => ({
      groupKey: option.groupKey,
      groupLabel: pickLocalized(locale, option.groupLabel),
      valueKey: option.valueKey ?? pickLocalized(locale, option.valueLabel),
      valueLabel: pickLocalized(locale, option.valueLabel),
    }))

    return {
      id: product.id,
      slug: product.slug,
      sku: member.sku,
      name: pickLocalized(locale, product.name),
      description: pickLocalized(locale, product.description),
      image,
      gallery: ensureGallery(image),
      specs: mapMockSpecRows(locale, member.specs),
      options,
    }
  })

  const variantGroups = buildVariantGroups(variants)
  const defaultVariant = variants[0]
  const productView: ProductView = {
    id: `family-${family.familySlug}`,
    slug: family.familySlug,
    name: pickLocalized(locale, family.familyName),
    description:
      pickLocalized(locale, family.description) || defaultVariant.description || "",
    image: defaultVariant.image,
    categoryId: memberProducts[0].product.categoryId,
    categorySlug: category?.slug ?? "",
    gallery: defaultVariant.gallery,
    specs: defaultVariant.specs,
    contentHtml: undefined,
    applicationHtml: undefined,
    faqItems: [],
    price: undefined,
    sku: defaultVariant.sku,
    availabilityStatus: undefined,
    moq: undefined,
    leadTime: undefined,
    familySlug: family.familySlug,
    familyName: pickLocalized(locale, family.familyName),
    variantCount: variants.length,
    variantSummary: variantGroups.map((group) => group.label).join(" / ") || undefined,
    variantGroups,
    variants,
    defaultVariantSlug: defaultVariant.slug,
    searchText: "",
  }

  return {
    ...productView,
    searchText: buildSearchText(productView),
  }
}

function getMockProductViews(locale: Locale) {
  const groupedVariantSlugs = new Set(
    MOCK_PRODUCT_FAMILIES.flatMap((family) => family.members.map((member) => member.slug))
  )
  const familyProducts = MOCK_PRODUCT_FAMILIES.map((family) =>
    mapMockFamilyToView(family, locale)
  ).filter((product): product is ProductView => product !== null)
  const singleProducts = getMockProductsRaw()
    .filter((product) => !groupedVariantSlugs.has(product.slug))
    .map((product) => mapMockSingleProductToView(product, locale))

  return [...familyProducts, ...singleProducts]
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
    theme: slide.theme,
    badge: {
      text: pickLocalized(locale, slide.badge.text),
      variant: slide.badge.variant,
    },
    title: pickLocalized(locale, slide.title),
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
    highlight: slide.highlight
      ? { value: slide.highlight.value, label: pickLocalized(locale, slide.highlight.label) }
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
  return getMockProductViews(locale)
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
  return (
    getMockProductViews(locale).find(
      (product) =>
        product.slug === slug ||
        product.variants.some((variant) => variant.slug === slug)
    ) ?? null
  )
}

export function getMockRelatedProducts(
  categorySlug: string,
  currentProductSlug: string,
  locale: Locale
) {
  return getMockProducts(locale)
    .filter(
      (product) =>
        product.categorySlug === categorySlug &&
        product.slug !== currentProductSlug &&
        !product.variants.some((variant) => variant.slug === currentProductSlug)
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
  const productsTh = getMockProducts("th")
  const productsEn = new Map(
    getMockProducts("en").map((product) => [product.slug, product])
  )

  return productsTh
    .map((product) => {
      const enProduct = productsEn.get(product.slug)

      if (!product.categorySlug || !enProduct) {
        return null
      }

      return {
        slug: product.slug,
        modified: MOCK_LAST_MODIFIED,
        categorySlug: product.categorySlug,
        indexTh: shouldIndexProduct(product),
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
