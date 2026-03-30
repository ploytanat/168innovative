// app/lib/api/products.ts

import { unstable_cache } from "next/cache"
import { mapFaqItems, normalizeRichText, pickLocalizedText } from "./acf"
import { fetchWithDevCache } from "./dev-cache"
import {
  getMockAllProductsByCategory,
  getMockAllProductsForSitemap,
  getMockIndexableProductsForSitemap,
  getMockProductBySlug,
  getMockProducts,
  getMockProductsByCategory,
  getMockRelatedProducts,
  isMockModeEnabled,
} from "../mock/runtime"
import { getCategoryIdBySlug } from "./categories"
import { shouldIndexProduct } from "../seo/indexability"
import {
  Locale,
  WPProduct,
  WPProductGalleryItem,
  WPProductVariant,
} from "../types/content"
import {
  ImageView,
  ProductSpecView,
  ProductVariantGroupView,
  ProductVariantOptionView,
  ProductVariantView,
  ProductView,
} from "../types/view"

const BASE = process.env.WP_API_URL
if (!BASE) throw new Error("WP_API_URL is not defined")

const PRODUCT_FIELDS =
  "id,slug,title,acf,featured_image_url,product_category"

/* ─────────────────────────────
   Fetch helpers
───────────────────────────── */

async function fetchJSON<T>(
  url: string,
  fallback: T,
  label: string
): Promise<T> {
  try {
    const res = await fetchWithDevCache(
      url,
      { next: { revalidate: 60 } },
      60
    )
    if (!res.ok) {
      console.error(`Fetch failed for ${label}: ${res.status} ${url}`)
      return fallback
    }
    return res.json()
  } catch (error) {
    console.error(`Fetch failed for ${label}:`, error)
    return fallback
  }
}

/* ─────────────────────────────
   Safe JSON Parser
───────────────────────────── */

function safeParseJSON(value: unknown): Record<string, unknown> | null {
  if (!value) return null

  if (typeof value === "object") {
    return value as Record<string, unknown>
  }

  if (typeof value === "string") {
    const cleaned = value.trim()
    if (!cleaned) return null

    try {
      return JSON.parse(cleaned)
    } catch {
      console.warn("Invalid specs_json:", cleaned)
      return null
    }
  }

  return null
}

function toImageView(src: string | undefined, alt: string): ImageView {
  return {
    src: src || "/images/placeholder.webp",
    alt,
  }
}

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function mapSpecsFromRaw(
  value: unknown,
  locale: Locale,
  fallback: ProductSpecView[] = []
) {
  const parsedSpecs = safeParseJSON(value)

  if (!parsedSpecs) {
    return fallback
  }

  return Object.entries(parsedSpecs).map(([key, specValue]) => ({
    label: formatSpecLabel(key, locale),
    value: Array.isArray(specValue)
      ? specValue.join(", ")
      : String(specValue),
  }))
}

function resolveMediaUrl(
  media:
    | WPProductGalleryItem["image"]
    | WPProductVariant["image"]
    | undefined
) {
  if (typeof media === "string") {
    return media
  }

  if (!media || typeof media !== "object") {
    return undefined
  }

  return (
    media.sizes?.large ??
    media.sizes?.medium_large ??
    media.sizes?.medium ??
    media.sizes?.thumbnail ??
    media.url
  )
}

function resolveMediaAlt(
  media:
    | WPProductGalleryItem["image"]
    | WPProductVariant["image"]
    | undefined
) {
  if (!media || typeof media !== "object") {
    return undefined
  }

  return media.alt ?? media.alt_text ?? media.title
}

function dedupeImages(images: ImageView[]) {
  return Array.from(
    new Map(images.map((image) => [image.src, image])).values()
  )
}

function mapGalleryImages(
  gallery: WPProductGalleryItem[] | undefined,
  locale: Locale,
  fallbackAlt: string
) {
  if (!Array.isArray(gallery)) {
    return []
  }

  return dedupeImages(
    gallery
      .map((item) => {
        const src = resolveMediaUrl(item.image)

        if (!src) {
          return null
        }

        return toImageView(
          src,
          pickLocalizedText(
            locale,
            item.alt_th,
            item.alt_en,
            resolveMediaAlt(item.image) ?? fallbackAlt
          )
        )
      })
      .filter((image): image is ImageView => image !== null)
  )
}

function ensureGallery(primaryImage: ImageView, gallery: ImageView[]) {
  const normalized = gallery.length > 0 ? gallery : [primaryImage]
  return dedupeImages([primaryImage, ...normalized])
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
      const groupKey = option.groupKey || normalizeToken(option.groupLabel) || "option"
      const valueKey = option.valueKey || normalizeToken(option.valueLabel) || variant.slug
      const existingGroup = groups.get(groupKey)

      if (!existingGroup) {
        groups.set(groupKey, {
          key: groupKey,
          label: option.groupLabel,
          values: new Map([
            [
              valueKey,
              {
                valueKey,
                valueLabel: option.valueLabel,
                variantSlug: variant.slug,
              },
            ],
          ]),
        })
        return
      }

      if (!existingGroup.values.has(valueKey)) {
        existingGroup.values.set(valueKey, {
          valueKey,
          valueLabel: option.valueLabel,
          variantSlug: variant.slug,
        })
      }
    })
  })

  return Array.from(groups.values()).map<ProductVariantGroupView>((group) => ({
    key: group.key,
    label: group.label,
    values: Array.from(group.values.values()),
  }))
}

function buildVariantSummary(
  variantGroups: ProductVariantGroupView[],
  variantCount: number,
  locale: Locale
) {
  if (!variantGroups.length || variantCount <= 1) {
    return undefined
  }

  const summary = variantGroups
    .slice(0, 2)
    .map((group) => group.label)
    .filter(Boolean)
    .join(" / ")

  if (summary) {
    return summary
  }

  return locale === "th"
    ? `${variantCount} ตัวเลือก`
    : `${variantCount} options`
}

function buildSearchText(product: ProductView) {
  const variantText = product.variants.flatMap((variant) => [
    variant.slug,
    variant.sku ?? "",
    variant.name,
    variant.description ?? "",
    ...variant.options.flatMap((option) => [option.groupLabel, option.valueLabel]),
  ])

  return [product.slug, product.name, product.description, ...variantText]
    .filter(Boolean)
    .join(" ")
}

const SPEC_LABEL_MAP: Record<string, { th: string; en: string }> = {
  width_mm: { th: "ความกว้าง (มม.)", en: "Width (mm)" },
  height_mm: { th: "ความสูง (มม.)", en: "Height (mm)" },
  length_mm: { th: "ความยาว (มม.)", en: "Length (mm)" },
  diameter_mm: { th: "เส้นผ่านศูนย์กลาง (มม.)", en: "Diameter (mm)" },
  neck_size_mm: { th: "ขนาดคอ (มม.)", en: "Neck Size (mm)" },
  capacity_ml: { th: "ความจุ (มล.)", en: "Capacity (ml)" },
  shape: { th: "รูปทรง", en: "Shape" },
  color: { th: "สี", en: "Color" },
  cap_color: { th: "สีฝา", en: "Cap Color" },
  material: { th: "วัสดุ", en: "Material" },
  application: { th: "การใช้งาน", en: "Application" },
  usage: { th: "การใช้งาน", en: "Usage" },
}

function formatSpecLabel(key: string, locale: Locale) {
  const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_")
  const mappedLabel = SPEC_LABEL_MAP[normalizedKey]?.[locale]

  if (mappedLabel) {
    return mappedLabel
  }

  return normalizedKey
    .replace(/[_-]+/g, " ")
    .replace(/\b(mm|ml|pp|pe|pet|hdpe|ldpe|as)\b/gi, (value) =>
      value.toUpperCase()
    )
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/* ─────────────────────────────
   Category Map
───────────────────────────── */

const _getCategoryMap = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const terms = await fetchJSON<{ id: number; slug: string }[]>(
      `${BASE}/wp-json/wp/v2/product_category?_fields=id,slug&per_page=100`,
      [],
      "product category map"
    )
    return Object.fromEntries(terms.map((t) => [t.id, t.slug]))
  },
  ["category-map-v5"],
  { revalidate: 3600, tags: ["categories"] }
)

/* ─────────────────────────────
   Homepage products (8 items)
───────────────────────────── */

const _getProductsRaw = unstable_cache(
  async (): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?per_page=100&_fields=${PRODUCT_FIELDS}`,
      [],
      "all products"
    ),
  ["products-home-v6"],
  { revalidate: 3600, tags: ["products"] }
)

/* ─────────────────────────────
   Category products (pagination + prefetch)
───────────────────────────── */

function _getProductsByCategoryId(
  categoryId: number,
  page: number
): Promise<{ data: WPProduct[]; totalPages: number; totalCount: number }> {
  return unstable_cache(
    async () => {
      try {
        const res = await fetchWithDevCache(
          `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=15&page=${page}&_fields=${PRODUCT_FIELDS}`,
          { next: { revalidate: 3600 } },
          3600
        )

        if (!res.ok) {
          console.error(`Fetch failed: category ${categoryId} page ${page}`)
          return { data: [], totalPages: 1, totalCount: 0 }
        }

        const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1)
        const totalCount = Number(res.headers.get("X-WP-Total") ?? 0)

        const data = (await res.json()) as WPProduct[]

        return { data, totalPages, totalCount }
      } catch (error) {
        console.error(`Fetch failed: category ${categoryId} page ${page}`, error)
        return { data: [], totalPages: 1, totalCount: 0 }
      }
    },
    [`products-category-${categoryId}-p${page}-v2`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

function _getProductsByCategoryBatch(
  categoryId: number,
  page: number,
  perPage: number
): Promise<{ data: WPProduct[]; totalPages: number; totalCount: number }> {
  return unstable_cache(
    async () => {
      try {
        const res = await fetchWithDevCache(
          `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=${perPage}&page=${page}&_fields=${PRODUCT_FIELDS}`,
          { next: { revalidate: 3600 } },
          3600
        )

        if (!res.ok) {
          console.error(
            `Fetch failed: category ${categoryId} page ${page} per_page ${perPage}`
          )
          return { data: [], totalPages: 1, totalCount: 0 }
        }

        const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1)
        const totalCount = Number(res.headers.get("X-WP-Total") ?? 0)
        const data = (await res.json()) as WPProduct[]

        return { data, totalPages, totalCount }
      } catch (error) {
        console.error(
          `Fetch failed: category ${categoryId} page ${page} per_page ${perPage}`,
          error
        )
        return { data: [], totalPages: 1, totalCount: 0 }
      }
    },
    [`products-category-${categoryId}-p${page}-pp${perPage}-v1`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

/* ─────────────────────────────
   Single product
───────────────────────────── */

function _getProductRaw(slug: string): Promise<WPProduct[]> {
  return unstable_cache(
    async () =>
      fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?slug=${slug}&_fields=${PRODUCT_FIELDS}`,
        [],
        `product ${slug}`
      ),
    [`product-single-${slug}-v2`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

/* ─────────────────────────────
   Related products
───────────────────────────── */

function _getRelatedRaw(categoryId: number): Promise<WPProduct[]> {
  return unstable_cache(
    async () =>
      fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=5&_fields=${PRODUCT_FIELDS}`,
        [],
        `related products for category ${categoryId}`
      ),
    [`products-related-${categoryId}-v2`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

/* ─────────────────────────────
   Mapper
───────────────────────────── */

function mapVariantOptions(
  options: WPProductVariant["options"],
  locale: Locale
) {
  if (!Array.isArray(options)) {
    return []
  }

  return options
    .map<ProductVariantOptionView | null>((option) => {
      const groupLabel = pickLocalizedText(
        locale,
        option.group_label_th,
        option.group_label_en,
        option.group_key
      )
      const valueLabel = pickLocalizedText(
        locale,
        option.value_th,
        option.value_en,
        option.value_key
      )

      if (!groupLabel || !valueLabel) {
        return null
      }

      return {
        groupKey: option.group_key || normalizeToken(groupLabel) || "option",
        groupLabel,
        valueKey: option.value_key || normalizeToken(valueLabel) || valueLabel,
        valueLabel,
      }
    })
    .filter((option): option is ProductVariantOptionView => option !== null)
}

function mapWPVariantToView(input: {
  product: WPProduct
  variant: WPProductVariant
  index: number
  locale: Locale
  fallbackName: string
  fallbackDescription: string
  fallbackImage: ImageView
  fallbackGallery: ImageView[]
  fallbackSpecs: ProductSpecView[]
}) {
  const optionViews = mapVariantOptions(input.variant.options, input.locale)
  const explicitName = pickLocalizedText(
    input.locale,
    input.variant.label_th,
    input.variant.label_en
  )
  const name =
    explicitName ||
    [input.fallbackName, optionViews.map((option) => option.valueLabel).join(" / ")]
      .filter(Boolean)
      .join(" - ")
  const description =
    pickLocalizedText(
      input.locale,
      input.variant.description_th,
      input.variant.description_en
    ) || input.fallbackDescription
  const primaryImage = toImageView(
    input.variant.image_url ??
      resolveMediaUrl(input.variant.image) ??
      input.fallbackImage.src,
    pickLocalizedText(
      input.locale,
      undefined,
      undefined,
      resolveMediaAlt(input.variant.image) ?? name
    )
  )
  const variantGallery = mapGalleryImages(
    input.variant.gallery_images,
    input.locale,
    name
  )
  const gallery = ensureGallery(
    primaryImage,
    variantGallery.length > 0 ? variantGallery : input.fallbackGallery
  )

  return {
    id: `${input.product.id}-${input.variant.slug || input.index + 1}`,
    slug:
      input.variant.slug ||
      `${input.product.slug}-${normalizeToken(name) || input.index + 1}`,
    sku: input.variant.sku,
    name,
    description,
    image: primaryImage,
    gallery,
    specs: mapSpecsFromRaw(
      input.variant.specs_json,
      input.locale,
      input.fallbackSpecs
    ),
    options: optionViews,
    availabilityStatus: input.variant.availability_status,
    moq: input.variant.moq,
    leadTime: input.variant.lead_time,
  } satisfies ProductVariantView
}

function mapWPToProductView(
  wp: WPProduct,
  locale: Locale,
  catMap: Record<number, string>
): ProductView {
  const productName = pickLocalizedText(
    locale,
    wp.acf?.name_th,
    wp.acf?.name_en,
    wp.title.rendered
  )
  const familyName = pickLocalizedText(
    locale,
    wp.acf?.family_name_th,
    wp.acf?.family_name_en,
    productName
  )
  const description = pickLocalizedText(
    locale,
    wp.acf?.description_th,
    wp.acf?.description_en
  )
  const baseImage = toImageView(
    wp.featured_image_url,
    pickLocalizedText(
      locale,
      wp.acf?.image_alt_th,
      wp.acf?.image_alt_en,
      wp.title.rendered
    )
  )
  const baseGallery = ensureGallery(
    baseImage,
    mapGalleryImages(wp.acf?.gallery_images, locale, familyName || productName)
  )
  const baseSpecs = mapSpecsFromRaw(wp.acf?.specs_json, locale)
  const categoryId = wp.product_category?.[0] ?? 0
  const fallbackVariant: ProductVariantView = {
    id: `${wp.id}-default`,
    slug: wp.slug,
    sku: wp.acf?.sku,
    name: productName,
    description,
    image: baseImage,
    gallery: baseGallery,
    specs: baseSpecs,
    options: [],
    availabilityStatus: wp.acf?.availability_status,
    moq: wp.acf?.moq,
    leadTime: wp.acf?.lead_time,
  }
  const variants =
    Array.isArray(wp.acf?.variants) && wp.acf.variants.length > 0
      ? wp.acf.variants.map((variant, index) =>
          mapWPVariantToView({
            product: wp,
            variant,
            index,
            locale,
            fallbackName: productName,
            fallbackDescription: description,
            fallbackImage: baseImage,
            fallbackGallery: baseGallery,
            fallbackSpecs: baseSpecs,
          })
        )
      : [fallbackVariant]
  const defaultVariantSlug =
    wp.acf?.default_variant_slug &&
    variants.some((variant) => variant.slug === wp.acf?.default_variant_slug)
      ? wp.acf.default_variant_slug
      : variants[0]?.slug
  const defaultVariant =
    variants.find((variant) => variant.slug === defaultVariantSlug) ??
    variants[0] ??
    fallbackVariant
  const variantGroups = buildVariantGroups(variants)
  const productView: ProductView = {
    id: wp.id.toString(),
    slug: wp.slug,
    name: variants.length > 1 ? familyName : productName,
    description: description || defaultVariant.description || "",
    image: defaultVariant.image,
    categoryId: categoryId.toString(),
    categorySlug: catMap[categoryId] ?? "",
    gallery: defaultVariant.gallery,
    specs: defaultVariant.specs,
    contentHtml: normalizeRichText(
      locale === "th" ? wp.acf?.content_th : wp.acf?.content_en
    ),
    applicationHtml: normalizeRichText(
      locale === "th" ? wp.acf?.application_th : wp.acf?.application_en
    ),
    faqItems: mapFaqItems(wp.acf?.faq_items, locale),
    price: undefined,
    sku: defaultVariant.sku ?? wp.acf?.sku,
    availabilityStatus:
      defaultVariant.availabilityStatus ?? wp.acf?.availability_status,
    moq: defaultVariant.moq ?? wp.acf?.moq,
    leadTime: defaultVariant.leadTime ?? wp.acf?.lead_time,
    familySlug: wp.slug,
    familyName,
    variantCount: variants.length,
    variantSummary: buildVariantSummary(variantGroups, variants.length, locale),
    variantGroups,
    variants,
    defaultVariantSlug,
    searchText: "",
  }

  return {
    ...productView,
    searchText: buildSearchText(productView),
  }
}

/* ─────────────────────────────
   Sitemap Helper
───────────────────────────── */

export async function getAllProductsForSitemap() {
  if (isMockModeEnabled()) {
    return getMockAllProductsForSitemap()
  }

  const [products, catMap] = await Promise.all([
    fetchJSON<Array<WPProduct & { modified: string }>>(
      `${BASE}/wp-json/wp/v2/product?per_page=100&_fields=${PRODUCT_FIELDS},modified`,
      [],
      "products for sitemap"
    ),
    _getCategoryMap(),
  ])

  return Array.from(
    new Map(
      products
        .map((wp) => {
          const product = mapWPToProductView(wp, "th", catMap)

          if (!product.categorySlug) {
            return null
          }

          return [
            product.slug,
            {
              slug: product.slug,
              modified: wp.modified,
              categorySlug: product.categorySlug,
            },
          ] as const
        })
        .filter(
          (
            item
          ): item is readonly [
            string,
            { slug: string; modified: string; categorySlug: string }
          ] => item !== null
        )
    ).values()
  )
}

export async function getIndexableProductsForSitemap() {
  if (isMockModeEnabled()) {
    return getMockIndexableProductsForSitemap()
  }

  const [products, catMap] = await Promise.all([
    fetchJSON<Array<WPProduct & { modified: string }>>(
      `${BASE}/wp-json/wp/v2/product?per_page=100&_fields=${PRODUCT_FIELDS},modified`,
      [],
      "indexable products for sitemap"
    ),
    _getCategoryMap(),
  ])

  return products
    .map((wp) => {
      const categoryId = wp.product_category?.[0]
      const categorySlug = categoryId ? catMap[categoryId] : null

      if (!categorySlug) {
        return null
      }

      const thProduct = mapWPToProductView(wp, "th", catMap)
      const enProduct = mapWPToProductView(wp, "en", catMap)

      return {
        slug: thProduct.slug,
        modified: wp.modified,
        categorySlug: thProduct.categorySlug || categorySlug,
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

/* ─────────────────────────────
   Public API
───────────────────────────── */

export async function getProducts(locale: Locale) {
  if (isMockModeEnabled()) {
    return getMockProducts(locale)
  }

  const [raw, catMap] = await Promise.all([
    _getProductsRaw(),
    _getCategoryMap(),
  ])

  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductsByCategory(
  slug: string,
  locale: Locale,
  page: number = 1
) {
  if (isMockModeEnabled()) {
    return getMockProductsByCategory(slug, locale, page)
  }

  const [categoryId, catMap] = await Promise.all([
    getCategoryIdBySlug(slug),
    _getCategoryMap(),
  ])

  if (!categoryId) {
    return { products: [], totalPages: 1, totalCount: 0 }
  }

  const { data, totalPages, totalCount } =
    await _getProductsByCategoryId(categoryId, page)

  return {
    products: data.map((wp) => mapWPToProductView(wp, locale, catMap)),
    totalPages,
    totalCount,
  }
}

export async function getAllProductsByCategory(slug: string, locale: Locale) {
  if (isMockModeEnabled()) {
    return getMockAllProductsByCategory(slug, locale)
  }

  const [categoryId, catMap] = await Promise.all([
    getCategoryIdBySlug(slug),
    _getCategoryMap(),
  ])

  if (!categoryId) {
    return []
  }

  const firstBatch = await _getProductsByCategoryBatch(categoryId, 1, 100)
  let data = firstBatch.data

  if (firstBatch.totalPages > 1) {
    const remainingBatches = await Promise.all(
      Array.from({ length: firstBatch.totalPages - 1 }, (_, index) =>
        _getProductsByCategoryBatch(categoryId, index + 2, 100)
      )
    )

    data = data.concat(remainingBatches.flatMap((batch) => batch.data))
  }

  return data.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductBySlug(slug: string, locale: Locale) {
  if (isMockModeEnabled()) {
    return getMockProductBySlug(slug, locale)
  }

  const [raw, allProducts, catMap] = await Promise.all([
    _getProductRaw(slug),
    _getProductsRaw(),
    _getCategoryMap(),
  ])

  const matchedProduct =
    raw[0] ??
    allProducts.find(
      (product) =>
        product.slug === slug ||
        product.acf?.variants?.some((variant) => variant.slug === slug)
    )

  if (!matchedProduct) return null

  return mapWPToProductView(matchedProduct, locale, catMap)
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductSlug: string,
  locale: Locale
) {
  if (isMockModeEnabled()) {
    return getMockRelatedProducts(categorySlug, currentProductSlug, locale)
  }

  const [categoryId, catMap] = await Promise.all([
    getCategoryIdBySlug(categorySlug),
    _getCategoryMap(),
  ])

  if (!categoryId) return []

  const raw = await _getRelatedRaw(categoryId)

  return raw
    .map((wp) => mapWPToProductView(wp, locale, catMap))
    .filter(
      (product) =>
        product.slug !== currentProductSlug &&
        !product.variants.some((variant) => variant.slug === currentProductSlug)
    )
    .slice(0, 4)
}
