// app/lib/api/products.ts

import { unstable_cache } from "next/cache"
import { mapFaqItems, normalizeRichText, pickLocalizedText } from "./acf"
import { getCategoryIdBySlug } from "./categories"
import { shouldIndexProduct } from "../seo/indexability"
import { Locale, WPProduct } from "../types/content"
import { ProductView, ProductSpecView } from "../types/view"

const BASE = process.env.WP_API_URL
if (!BASE) throw new Error("WP_API_URL is not defined")

const PRODUCT_FIELDS =
  "id,slug,title,acf,featured_image_url,product_category"

/* ─────────────────────────────
   Fetch helpers
───────────────────────────── */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`Fetch failed: ${url}`)
  return res.json()
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
      `${BASE}/wp-json/wp/v2/product_category?_fields=id,slug&per_page=100`
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
      `${BASE}/wp-json/wp/v2/product?per_page=100&_fields=${PRODUCT_FIELDS}`
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
      const res = await fetch(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=15&page=${page}&_fields=${PRODUCT_FIELDS}`,
        { next: { revalidate: 3600 } }
      )

      if (!res.ok) {
        throw new Error(`Fetch failed: category ${categoryId} page ${page}`)
      }

      const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1)
      const totalCount = Number(res.headers.get("X-WP-Total") ?? 0)

      const data = (await res.json()) as WPProduct[]

      return { data, totalPages, totalCount }
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
      const res = await fetch(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=${perPage}&page=${page}&_fields=${PRODUCT_FIELDS}`,
        { next: { revalidate: 3600 } }
      )

      if (!res.ok) {
        throw new Error(
          `Fetch failed: category ${categoryId} page ${page} per_page ${perPage}`
        )
      }

      const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1)
      const totalCount = Number(res.headers.get("X-WP-Total") ?? 0)
      const data = (await res.json()) as WPProduct[]

      return { data, totalPages, totalCount }
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
        `${BASE}/wp-json/wp/v2/product?slug=${slug}&_fields=${PRODUCT_FIELDS}`
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
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=5&_fields=${PRODUCT_FIELDS}`
      ),
    [`products-related-${categoryId}-v2`],
    { revalidate: 3600, tags: ["products"] }
  )()
}

/* ─────────────────────────────
   Mapper
───────────────────────────── */

function mapWPToProductView(
  wp: WPProduct,
  locale: Locale,
  catMap: Record<number, string>
): ProductView {
  const parsedSpecs = safeParseJSON(wp.acf?.specs_json)

  const specs: ProductSpecView[] = parsedSpecs
    ? Object.entries(parsedSpecs).map(([key, value]) => ({
        label: formatSpecLabel(key, locale),
        value: Array.isArray(value) ? value.join(", ") : String(value),
      }))
    : []

  const categoryId = wp.product_category?.[0] ?? 0

  return {
    id: wp.id.toString(),
    slug: wp.slug,
    name: pickLocalizedText(locale, wp.acf?.name_th, wp.acf?.name_en, wp.title.rendered),
    description: pickLocalizedText(locale, wp.acf?.description_th, wp.acf?.description_en),
    image: {
      src: wp.featured_image_url ?? "/images/placeholder.webp",
      alt: pickLocalizedText(locale, wp.acf?.image_alt_th, wp.acf?.image_alt_en, wp.title.rendered),
    },
    categoryId: categoryId.toString(),
    categorySlug: catMap[categoryId] ?? "",
    specs,
    contentHtml: normalizeRichText(
      locale === "th" ? wp.acf?.content_th : wp.acf?.content_en
    ),
    applicationHtml: normalizeRichText(
      locale === "th" ? wp.acf?.application_th : wp.acf?.application_en
    ),
    faqItems: mapFaqItems(wp.acf?.faq_items, locale),
    price: undefined,
  }
}

/* ─────────────────────────────
   Sitemap Helper
───────────────────────────── */

export async function getAllProductsForSitemap() {
  const [products, catMap] = await Promise.all([
    fetchJSON<{ slug: string; modified: string; product_category: number[] }[]>(
      `${BASE}/wp-json/wp/v2/product?per_page=100&_fields=slug,modified,product_category`
    ),
    _getCategoryMap(),
  ])

  return products
    .map((p) => {
      const catId = p.product_category?.[0]
      const catSlug = catId ? catMap[catId] : null
      if (!catSlug) return null

      return {
        slug: p.slug,
        modified: p.modified,
        categorySlug: catSlug,
      }
    })
    .filter(
      (p): p is { slug: string; modified: string; categorySlug: string } =>
        p !== null
    )
}

export async function getIndexableProductsForSitemap() {
  const [products, catMap] = await Promise.all([
    fetchJSON<Array<WPProduct & { modified: string }>>(
      `${BASE}/wp-json/wp/v2/product?per_page=100&_fields=${PRODUCT_FIELDS},modified`
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
        slug: wp.slug,
        modified: wp.modified,
        categorySlug,
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
  const [raw, catMap] = await Promise.all([
    _getProductRaw(slug),
    _getCategoryMap(),
  ])

  if (!raw.length) return null

  return mapWPToProductView(raw[0], locale, catMap)
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  locale: Locale
) {
  const [categoryId, catMap] = await Promise.all([
    getCategoryIdBySlug(categorySlug),
    _getCategoryMap(),
  ])

  if (!categoryId) return []

  const raw = await _getRelatedRaw(categoryId)

  return raw
    .filter((p) => p.id.toString() !== currentProductId)
    .slice(0, 4)
    .map((wp) => mapWPToProductView(wp, locale, catMap))
}
