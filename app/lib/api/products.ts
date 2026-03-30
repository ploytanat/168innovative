// app/lib/api/products.ts — MariaDB backend

import { unstable_cache } from 'next/cache'
import { normalizeRichText, pickLocalizedText } from './acf'
import {
  getMockAllProductsByCategory,
  getMockAllProductsForSitemap,
  getMockIndexableProductsForSitemap,
  getMockProductBySlug,
  getMockProducts,
  getMockProductsByCategory,
  getMockRelatedProducts,
  isMockModeEnabled,
} from '../mock/runtime'
import { getCategoryIdBySlug } from './categories'
import { shouldIndexProduct } from '../seo/indexability'
import {
  queryAllProducts,
  queryProductsByCategoryId,
  queryAllProductsByCategoryId,
  queryProductBySlug,
  queryRelatedProducts,
  queryVariantsByProductIds,
  queryOptionsByVariantIds,
  querySpecsByProductIds,
  queryMediaByProductIds,
  queryCategoryIdBySlug as dbGetCategoryIdBySlug,
} from '../db/products'
import { queryFaqItemsByOwner } from '../db/categories'
import type { Locale } from '../types/content'
import type {
  ImageView,
  ProductSpecView,
  ProductVariantGroupView,
  ProductVariantOptionView,
  ProductVariantView,
  ProductView,
} from '../types/view'
import type {
  DBProduct,
  DBProductVariant,
  DBVariantOption,
  DBProductSpec,
  DBProductMedia,
  DBFaqItem,
} from '../db/types'

/* ─────────────────────────────
   Helpers
───────────────────────────── */

function toImageView(src: string, alt: string): ImageView {
  return { src: src || '/images/placeholder.webp', alt }
}

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function dedupeImages(images: ImageView[]) {
  return Array.from(new Map(images.map((img) => [img.src, img])).values())
}

function ensureGallery(primary: ImageView, gallery: ImageView[]) {
  return dedupeImages([primary, ...(gallery.length > 0 ? gallery : [primary])])
}

const SPEC_LABEL_MAP: Record<string, { th: string; en: string }> = {
  width_mm: { th: 'ความกว้าง (มม.)', en: 'Width (mm)' },
  height_mm: { th: 'ความสูง (มม.)', en: 'Height (mm)' },
  length_mm: { th: 'ความยาว (มม.)', en: 'Length (mm)' },
  diameter_mm: { th: 'เส้นผ่านศูนย์กลาง (มม.)', en: 'Diameter (mm)' },
  neck_size_mm: { th: 'ขนาดคอ (มม.)', en: 'Neck Size (mm)' },
  capacity_ml: { th: 'ความจุ (มล.)', en: 'Capacity (ml)' },
  shape: { th: 'รูปทรง', en: 'Shape' },
  color: { th: 'สี', en: 'Color' },
  cap_color: { th: 'สีฝา', en: 'Cap Color' },
  material: { th: 'วัสดุ', en: 'Material' },
  application: { th: 'การใช้งาน', en: 'Application' },
  usage: { th: 'การใช้งาน', en: 'Usage' },
}

function formatSpecLabel(key: string, locale: Locale) {
  const normalized = key.trim().toLowerCase().replace(/\s+/g, '_')
  const mapped = SPEC_LABEL_MAP[normalized]?.[locale]
  if (mapped) return mapped
  return normalized
    .replace(/[_-]+/g, ' ')
    .replace(/\b(mm|ml|pp|pe|pet|hdpe|ldpe|as)\b/gi, (v) => v.toUpperCase())
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildVariantGroups(variants: ProductVariantView[]): ProductVariantGroupView[] {
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
      const groupKey = option.groupKey || normalizeToken(option.groupLabel) || 'option'
      const valueKey = option.valueKey || normalizeToken(option.valueLabel) || variant.slug
      const existing = groups.get(groupKey)

      if (!existing) {
        groups.set(groupKey, {
          key: groupKey,
          label: option.groupLabel,
          values: new Map([[valueKey, { valueKey, valueLabel: option.valueLabel, variantSlug: variant.slug }]]),
        })
        return
      }
      if (!existing.values.has(valueKey)) {
        existing.values.set(valueKey, { valueKey, valueLabel: option.valueLabel, variantSlug: variant.slug })
      }
    })
  })

  return Array.from(groups.values()).map((g) => ({
    key: g.key,
    label: g.label,
    values: Array.from(g.values.values()),
  }))
}

function buildVariantSummary(
  variantGroups: ProductVariantGroupView[],
  variantCount: number,
  locale: Locale
) {
  if (!variantGroups.length || variantCount <= 1) return undefined
  const summary = variantGroups.slice(0, 2).map((g) => g.label).filter(Boolean).join(' / ')
  if (summary) return summary
  return locale === 'th' ? `${variantCount} ตัวเลือก` : `${variantCount} options`
}

function buildSearchText(product: ProductView) {
  const variantText = product.variants.flatMap((v) => [
    v.slug, v.sku ?? '', v.name, v.description ?? '',
    ...v.options.flatMap((o) => [o.groupLabel, o.valueLabel]),
  ])
  return [product.slug, product.name, product.description, ...variantText]
    .filter(Boolean)
    .join(' ')
}

/* ─────────────────────────────
   Mapper: DB rows → ProductView
───────────────────────────── */

interface ProductRelated {
  variants: DBProductVariant[]
  options: DBVariantOption[]
  specs: DBProductSpec[]
  media: DBProductMedia[]
  faqRows: DBFaqItem[]
}

function mapDbSpecRow(row: DBProductSpec, locale: Locale): ProductSpecView {
  const label = pickLocalizedText(locale, row.label_th, row.label_en) || formatSpecLabel(row.spec_key, locale)
  const value = pickLocalizedText(locale, row.value_th, row.value_en)
  return { label, value }
}

function mapDbVariantOption(row: DBVariantOption, locale: Locale): ProductVariantOptionView {
  const groupLabel = pickLocalizedText(locale, row.group_label_th, row.group_label_en, row.group_key)
  const valueLabel = pickLocalizedText(locale, row.value_th, row.value_en, row.value_key)
  return {
    groupKey: row.group_key || normalizeToken(groupLabel) || 'option',
    groupLabel,
    valueKey: row.value_key || normalizeToken(valueLabel) || valueLabel,
    valueLabel,
  }
}

function mapDbVariantToView(
  product: DBProduct,
  variant: DBProductVariant,
  options: DBVariantOption[],
  specs: DBProductSpec[],
  media: DBProductMedia[],
  locale: Locale,
  fallbackName: string,
  fallbackDescription: string,
  fallbackImage: ImageView,
  fallbackGallery: ImageView[],
  fallbackSpecs: ProductSpecView[]
): ProductVariantView {
  const optionViews = options.map((o) => mapDbVariantOption(o, locale))
  const explicitName = pickLocalizedText(locale, variant.label_th, variant.label_en)
  const name =
    explicitName ||
    [fallbackName, optionViews.map((o) => o.valueLabel).join(' / ')].filter(Boolean).join(' - ')
  const description =
    pickLocalizedText(locale, variant.description_th, variant.description_en) || fallbackDescription

  const variantMedia = media.filter((m) => m.variant_id === variant.id)
  const primaryMedia = variantMedia.find((m) => m.is_primary) ?? variantMedia[0]
  const primaryImage = primaryMedia
    ? toImageView(primaryMedia.url, pickLocalizedText(locale, primaryMedia.alt_th, primaryMedia.alt_en, name))
    : variant.image_url
    ? toImageView(variant.image_url, name)
    : fallbackImage

  const galleryImages = variantMedia.map((m) =>
    toImageView(m.url, pickLocalizedText(locale, m.alt_th, m.alt_en, name))
  )
  const gallery = ensureGallery(primaryImage, galleryImages.length > 0 ? galleryImages : fallbackGallery)

  const variantSpecs = specs.filter((s) => s.variant_id === variant.id)
  const resolvedSpecs =
    variantSpecs.length > 0
      ? variantSpecs.map((s) => mapDbSpecRow(s, locale))
      : fallbackSpecs

  return {
    id: `${product.id}-${variant.slug}`,
    slug: variant.slug,
    sku: variant.sku ?? undefined,
    name,
    description,
    image: primaryImage,
    gallery,
    specs: resolvedSpecs,
    options: optionViews,
    availabilityStatus: variant.availability_status ?? undefined,
    moq: variant.moq ?? undefined,
    leadTime: variant.lead_time ?? undefined,
  }
}

function mapDbProductToView(
  product: DBProduct,
  related: ProductRelated,
  locale: Locale
): ProductView {
  const productName = pickLocalizedText(locale, product.name_th, product.name_en, product.name_th)
  const familyName = pickLocalizedText(locale, product.family_name_th, product.family_name_en, productName)
  const description = pickLocalizedText(locale, product.description_th, product.description_en) ?? ''

  const productMedia = related.media.filter((m) => m.product_id === product.id && !m.variant_id)
  const primaryMedia = productMedia.find((m) => m.is_primary) ?? productMedia[0]
  const baseImage = primaryMedia
    ? toImageView(primaryMedia.url, pickLocalizedText(locale, primaryMedia.alt_th, primaryMedia.alt_en, productName))
    : product.image_url
    ? toImageView(product.image_url, pickLocalizedText(locale, product.image_alt_th, product.image_alt_en, productName))
    : toImageView('/images/placeholder.webp', productName)

  const baseGallery = ensureGallery(
    baseImage,
    productMedia.map((m) => toImageView(m.url, pickLocalizedText(locale, m.alt_th, m.alt_en, productName)))
  )

  const productSpecs = related.specs
    .filter((s) => s.product_id === product.id && !s.variant_id)
    .map((s) => mapDbSpecRow(s, locale))

  const productVariants = related.variants.filter((v) => v.product_id === product.id)
  const fallbackVariant: ProductVariantView = {
    id: `${product.id}-default`,
    slug: product.slug,
    sku: product.sku ?? undefined,
    name: productName,
    description,
    image: baseImage,
    gallery: baseGallery,
    specs: productSpecs,
    options: [],
    availabilityStatus: product.availability_status ?? undefined,
    moq: product.moq ?? undefined,
    leadTime: product.lead_time ?? undefined,
  }

  const variants =
    productVariants.length > 0
      ? productVariants.map((variant) => {
          const variantOptions = related.options.filter((o) => o.variant_id === variant.id)
          return mapDbVariantToView(
            product, variant, variantOptions,
            related.specs, related.media,
            locale, productName, description, baseImage, baseGallery, productSpecs
          )
        })
      : [fallbackVariant]

  const defaultVariantSlug =
    product.default_variant_slug &&
    variants.some((v) => v.slug === product.default_variant_slug)
      ? product.default_variant_slug
      : variants[0]?.slug

  const defaultVariant = variants.find((v) => v.slug === defaultVariantSlug) ?? variants[0] ?? fallbackVariant
  const variantGroups = buildVariantGroups(variants)

  const faqItems = related.faqRows
    .filter((f) => f.owner_id === product.id)
    .map((f) => ({
      question: pickLocalizedText(locale, f.question_th, f.question_en),
      answer: normalizeRichText(locale === 'th' ? f.answer_th : f.answer_en) ?? '',
    }))
    .filter((f) => f.question && f.answer)

  const productView: ProductView = {
    id: String(product.id),
    slug: product.slug,
    name: variants.length > 1 ? familyName : productName,
    description: description || defaultVariant.description || '',
    image: defaultVariant.image,
    categoryId: String(product.category_id),
    categorySlug: product.category_slug,
    gallery: defaultVariant.gallery,
    specs: defaultVariant.specs,
    contentHtml: normalizeRichText(locale === 'th' ? product.content_th : product.content_en),
    applicationHtml: normalizeRichText(locale === 'th' ? product.application_th : product.application_en),
    faqItems,
    price: undefined,
    sku: defaultVariant.sku ?? product.sku ?? undefined,
    availabilityStatus: defaultVariant.availabilityStatus ?? product.availability_status ?? undefined,
    moq: defaultVariant.moq ?? product.moq ?? undefined,
    leadTime: defaultVariant.leadTime ?? product.lead_time ?? undefined,
    familySlug: product.slug,
    familyName,
    variantCount: variants.length,
    variantSummary: buildVariantSummary(variantGroups, variants.length, locale),
    variantGroups,
    variants,
    defaultVariantSlug,
    searchText: '',
  }

  return { ...productView, searchText: buildSearchText(productView) }
}

/* ─────────────────────────────
   Shared loader for related data
───────────────────────────── */

async function loadRelatedData(products: DBProduct[]): Promise<ProductRelated> {
  const productIds = products.map((p) => p.id)
  const [variants, specs, media, faqRows] = await Promise.all([
    queryVariantsByProductIds(productIds),
    querySpecsByProductIds(productIds),
    queryMediaByProductIds(productIds),
    queryFaqItemsByOwner('product', productIds),
  ])
  const variantIds = variants.map((v) => v.id)
  const options = await queryOptionsByVariantIds(variantIds)
  return { variants, options, specs, media, faqRows }
}

/* ─────────────────────────────
   Sitemap Helpers
───────────────────────────── */

export async function getAllProductsForSitemap() {
  if (isMockModeEnabled()) return getMockAllProductsForSitemap()

  return unstable_cache(
    async () => {
      const products = await queryAllProducts()
      return products
        .filter((p) => p.category_slug)
        .map((p) => ({ slug: p.slug, modified: new Date().toISOString(), categorySlug: p.category_slug }))
    },
    ['products-sitemap-db-v1'],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export async function getIndexableProductsForSitemap() {
  if (isMockModeEnabled()) return getMockIndexableProductsForSitemap()

  return unstable_cache(
    async () => {
      const products = await queryAllProducts()
      const related = await loadRelatedData(products)
      return products
        .filter((p) => p.category_slug)
        .map((p) => {
          const thProduct = mapDbProductToView(p, related, 'th')
          const enProduct = mapDbProductToView(p, related, 'en')
          return {
            slug: p.slug,
            modified: new Date().toISOString(),
            categorySlug: p.category_slug,
            indexTh: shouldIndexProduct(thProduct),
            indexEn: shouldIndexProduct(enProduct),
          }
        })
    },
    ['products-sitemap-indexable-db-v1'],
    { revalidate: 3600, tags: ['products'] }
  )()
}

/* ─────────────────────────────
   Public API
───────────────────────────── */

export async function getProducts(locale: Locale) {
  if (isMockModeEnabled()) return getMockProducts(locale)

  return unstable_cache(
    async () => {
      const products = await queryAllProducts()
      const related = await loadRelatedData(products)
      return products.map((p) => mapDbProductToView(p, related, locale))
    },
    [`products-all-db-${locale}-v1`],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export async function getProductsByCategory(
  slug: string,
  locale: Locale,
  page = 1
) {
  if (isMockModeEnabled()) return getMockProductsByCategory(slug, locale, page)

  const perPage = 15
  return unstable_cache(
    async () => {
      const categoryId = await dbGetCategoryIdBySlug(slug)
      if (!categoryId) return { products: [], totalPages: 1, totalCount: 0 }

      const { data, totalCount } = await queryProductsByCategoryId(categoryId, page, perPage)
      const related = await loadRelatedData(data)
      const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

      return {
        products: data.map((p) => mapDbProductToView(p, related, locale)),
        totalPages,
        totalCount,
      }
    },
    [`products-category-db-${slug}-p${page}-${locale}-v1`],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export async function getAllProductsByCategory(slug: string, locale: Locale) {
  if (isMockModeEnabled()) return getMockAllProductsByCategory(slug, locale)

  return unstable_cache(
    async () => {
      const categoryId = await dbGetCategoryIdBySlug(slug)
      if (!categoryId) return []

      const data = await queryAllProductsByCategoryId(categoryId)
      const related = await loadRelatedData(data)
      return data.map((p) => mapDbProductToView(p, related, locale))
    },
    [`products-all-category-db-${slug}-${locale}-v1`],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export async function getProductBySlug(slug: string, locale: Locale) {
  if (isMockModeEnabled()) return getMockProductBySlug(slug, locale)

  return unstable_cache(
    async () => {
      const product = await queryProductBySlug(slug)
      if (!product) return null
      const related = await loadRelatedData([product])
      return mapDbProductToView(product, related, locale)
    },
    [`product-db-${slug}-${locale}-v1`],
    { revalidate: 3600, tags: ['products'] }
  )()
}

export async function getRelatedProducts(
  categorySlug: string,
  currentProductSlug: string,
  locale: Locale
) {
  if (isMockModeEnabled()) return getMockRelatedProducts(categorySlug, currentProductSlug, locale)

  return unstable_cache(
    async () => {
      const categoryId = await getCategoryIdBySlug(categorySlug)
      if (!categoryId) return []

      const products = await queryRelatedProducts(categoryId, currentProductSlug, 5)
      const related = await loadRelatedData(products)
      return products
        .map((p) => mapDbProductToView(p, related, locale))
        .filter(
          (p) =>
            p.slug !== currentProductSlug &&
            !p.variants.some((v) => v.slug === currentProductSlug)
        )
        .slice(0, 4)
    },
    [`products-related-db-${categorySlug}-${currentProductSlug}-${locale}-v1`],
    { revalidate: 3600, tags: ['products'] }
  )()
}
