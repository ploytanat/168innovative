// app/lib/api/products.ts

import { unstable_cache } from 'next/cache'
import { Locale, WPProduct } from '../types/content'
import { ProductView, ProductSpecView } from '../types/view'

const BASE = process.env.WP_API_URL
if (!BASE) throw new Error('WP_API_URL is not defined')

/* ─────────────────────────────
   Shared fields (ลด payload)
   ───────────────────────────── */

const PRODUCT_FIELDS =
  'id,slug,title,acf,featured_image_url,product_category'

/* ─────────────────────────────
   Utils
   ───────────────────────────── */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Fetch failed: ${url}`)
  return res.json() as Promise<T>
}

/* ─────────────────────────────
   Category Map (cached)
   ───────────────────────────── */

// ✅ Global cache map — key ไม่ขึ้นกับ param จึงใช้ key คงที่ได้
const _getCategoryMap = unstable_cache(
  async (): Promise<Record<number, string>> => {
    const terms = await fetchJSON<{ id: number; slug: string }[]>(
      `${BASE}/wp-json/wp/v2/product_category?_fields=id,slug&per_page=100`
    )
    return Object.fromEntries(terms.map((t) => [t.id, t.slug]))
  },
  ['category-map-v2'],
  { revalidate: 3600, tags: ['categories'] }
)

// ✅ แก้: key รวม slug เพื่อ cache แยกกันแต่ละ slug
function _getCategoryIdBySlug(slug: string): Promise<number | null> {
  return unstable_cache(
    async () => {
      const terms = await fetchJSON<{ id: number }[]>(
        `${BASE}/wp-json/wp/v2/product_category?slug=${slug}&_fields=id`
      )
      return terms[0]?.id ?? null
    },
    [`category-id-${slug}`],
    { revalidate: 3600, tags: ['categories'] }
  )()
}

/* ─────────────────────────────
   Products Fetchers (optimized)
   ───────────────────────────── */

// Homepage products (limit small) — key คงที่ได้เพราะไม่มี param
const _getProductsRaw = unstable_cache(
  async (): Promise<WPProduct[]> =>
    fetchJSON<WPProduct[]>(
      `${BASE}/wp-json/wp/v2/product?per_page=8&_fields=${PRODUCT_FIELDS}`
    ),
  ['products-home-v2'],
  { revalidate: 3600, tags: ['products'] }
)

// ✅ แก้: key รวม categoryId
function _getProductsByCategoryId(categoryId: number): Promise<WPProduct[]> {
  return unstable_cache(
    async () =>
      fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=24&_fields=${PRODUCT_FIELDS}`
      ),
    [`products-category-${categoryId}`],
    { revalidate: 3600, tags: ['products'] }
  )()
}

// ✅ แก้: key รวม slug
function _getProductRaw(slug: string): Promise<WPProduct[]> {
  return unstable_cache(
    async () =>
      fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?slug=${slug}&_fields=${PRODUCT_FIELDS}`
      ),
    [`product-single-${slug}`],
    { revalidate: 3600, tags: ['products'] }
  )()
}

// ✅ แก้: key รวม categoryId
function _getRelatedRaw(categoryId: number): Promise<WPProduct[]> {
  return unstable_cache(
    async () =>
      fetchJSON<WPProduct[]>(
        `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}&per_page=5&_fields=${PRODUCT_FIELDS}`
      ),
    [`products-related-${categoryId}`],
    { revalidate: 3600, tags: ['products'] }
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
  const parsedSpecs =
    typeof wp.acf?.specs_json === 'string'
      ? JSON.parse(wp.acf.specs_json.replace(/\\"/g, '"'))
      : wp.acf?.specs_json ?? null

  const SPEC_LABEL_TH: Record<string, string> = {
    model: 'รุ่น',
    material: 'วัสดุ',
    color: 'สี',
    size: 'ขนาด',
    weight: 'น้ำหนัก',
    capacity: 'ความจุ',
    application: 'การใช้งาน',
    inner_diameter_mm: 'เส้นผ่านศูนย์กลางใน (มม.)',
    outer_diameter_mm: 'เส้นผ่านศูนย์กลางนอก (มม.)',
    height_mm: 'ความสูง (มม.)',
    width_mm: 'ความกว้าง (มม.)',
    length_mm: 'ความยาว (มม.)',
    diameter_mm: 'เส้นผ่านศูนย์กลาง (มม.)',
    thickness_mm: 'ความหนา (มม.)',
    neck_size: 'ขนาดคอ',
    thread: 'เกลียว',
    finish: 'ชนิดปาก',
    closure: 'ฝาปิด',
    pump_type: 'ประเภทปั๊ม',
    dispense_volume_ml: 'ปริมาณต่อกด (มล.)',
    volume_ml: 'ปริมาตร (มล.)',
    moq: 'จำนวนขั้นต่ำ (MOQ)',
    surface: 'ผิวสัมผัส',
    shape: 'รูปทรง',
  }

  const SPEC_LABEL_EN: Record<string, string> = {
    model: 'Model',
    material: 'Material',
    color: 'Color',
    size: 'Size',
    weight: 'Weight',
    capacity: 'Capacity',
    application: 'Application',
    inner_diameter_mm: 'Inner Diameter (mm)',
    outer_diameter_mm: 'Outer Diameter (mm)',
    height_mm: 'Height (mm)',
    width_mm: 'Width (mm)',
    length_mm: 'Length (mm)',
    diameter_mm: 'Diameter (mm)',
    thickness_mm: 'Thickness (mm)',
    neck_size: 'Neck Size',
    thread: 'Thread',
    finish: 'Finish',
    closure: 'Closure',
    pump_type: 'Pump Type',
    dispense_volume_ml: 'Dispense Volume (ml)',
    volume_ml: 'Volume (ml)',
    moq: 'MOQ',
    surface: 'Surface',
    shape: 'Shape',
  }

  const SPEC_LABEL_MAP = locale === 'th' ? SPEC_LABEL_TH : SPEC_LABEL_EN

  const specs: ProductSpecView[] = parsedSpecs
    ? Object.entries(parsedSpecs).map(([key, value]) => {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '_')
        const label =
          SPEC_LABEL_MAP[normalizedKey] ??
          key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        return {
          label,
          value: Array.isArray(value) ? value.join(', ') : String(value),
        }
      })
    : []

  const categoryId = wp.product_category?.[0] ?? 0

  return {
    id: wp.id.toString(),
    slug: wp.slug,
    name:
      locale === 'th'
        ? wp.acf?.name_th ?? wp.title.rendered
        : wp.acf?.name_en ?? wp.title.rendered,
    description:
      locale === 'th'
        ? wp.acf?.description_th ?? ''
        : wp.acf?.description_en ?? '',
    image: {
      src: wp.featured_image_url ?? '/images/placeholder.webp',
      alt: wp.title.rendered,
    },
    categoryId: categoryId.toString(),
    categorySlug: catMap[categoryId] ?? '',
    specs,
    price: undefined,
  }
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

export async function getProductsByCategory(slug: string, locale: Locale) {
  // ✅ แก้: รัน categoryId และ catMap พร้อมกัน ไม่ต้องรอ sequential
  const [categoryId, catMap] = await Promise.all([
    _getCategoryIdBySlug(slug),
    _getCategoryMap(),
  ])
  if (!categoryId) return []

  const raw = await _getProductsByCategoryId(categoryId)
  return raw.map((wp) => mapWPToProductView(wp, locale, catMap))
}

export async function getProductBySlug(slug: string, locale: Locale) {
  // ✅ แก้: รัน productRaw และ catMap พร้อมกัน
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
  // ✅ แก้: รัน categoryId และ catMap พร้อมกัน
  const [categoryId, catMap] = await Promise.all([
    _getCategoryIdBySlug(categorySlug),
    _getCategoryMap(),
  ])
  if (!categoryId) return []

  const raw = await _getRelatedRaw(categoryId)

  return raw
    .filter((p) => p.id.toString() !== currentProductId)
    .slice(0, 4)
    .map((wp) => mapWPToProductView(wp, locale, catMap))
}