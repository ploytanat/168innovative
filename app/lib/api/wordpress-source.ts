import {
  mapFaqItems,
  normalizeRichText,
  pickLocalizedText,
} from "./acf"
import { fetchWordPressCollection, fetchWordPressJson } from "./wp"
import { shouldIndexProduct } from "../seo/indexability"
import type {
  Locale,
  WPArticle,
  WPArticleContentBlock,
  WPFeaturedMedia,
  WPMediaItem,
  WPProduct,
  WPProductVariantOption,
  WPTerm,
} from "../types/content"
import type {
  AboutView,
  ArticleBlockView,
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

const PRODUCTS_PER_PAGE = 15
const WORDPRESS_PRODUCTS_FETCH_PAGE_SIZE = 24
const HERO_THEMES: HeroSlideView["theme"][] = ["rose", "sky", "emerald", "violet"]

type WPMediaDetailsSize = {
  source_url?: string
}

type WPMediaLike = WPMediaItem & {
  alt_text?: string
  media_details?: {
    sizes?: Record<string, WPMediaDetailsSize>
  }
  source_url?: string
  title?: {
    rendered?: string
  }
}

type EmbeddedMediaLike = WPFeaturedMedia & {
  guid?: {
    rendered?: string
  }
  media_details?: {
    sizes?: Record<string, WPMediaDetailsSize>
  }
  source_url?: string
  title?: {
    rendered?: string
  }
}

type WPCategoryTerm = {
  id: number
  slug: string
  name: string
  description?: string
  image_url?: string
  count?: number
  acf?: {
    canonical_url_en?: string
    canonical_url_th?: string
    description_en?: string
    description_th?: string
    faq_items?: unknown
    image?: number
    image_alt_en?: string
    image_alt_th?: string
    intro_html_en?: string
    intro_html_th?: string
    name_en?: string
    name_th?: string
    og_image?: number | string
    robots_follow?: boolean
    robots_index?: boolean
    seo_description_en?: string
    seo_description_th?: string
    seo_title_en?: string
    seo_title_th?: string
  }
}

type WPAboutEntry = {
  id: number
  modified?: string
  slug: string
  acf?: {
    hero_description_en?: string
    hero_description_th?: string
    hero_image_1?: number
    hero_image_1_alt_en?: string
    hero_image_1_alt_th?: string
    hero_image_2?: number
    hero_image_2_alt_en?: string
    hero_image_2_alt_th?: string
    hero_title_en?: string
    hero_title_th?: string
    og_image?: number
    seo_description_en?: string
    seo_description_th?: string
    seo_title_en?: string
    seo_title_th?: string
    who_description_en?: string
    who_description_th?: string
    who_image?: number
    who_image_alt_en?: string
    who_image_alt_th?: string
    who_title_en?: string
    who_title_th?: string
  }
}

type WPCompanyEntry = {
  id: number
  modified?: string
  slug: string
  acf?: {
    address_en?: string
    address_th?: string
    contact_image?: number
    contact_image_1?: number
    contact_image_1_alt_en?: string
    contact_image_1_alt_th?: string
    contact_image_2?: number
    contact_image_2_alt_en?: string
    contact_image_2_alt_th?: string
    contact_image_3?: number
    contact_image_3_alt_en?: string
    contact_image_3_alt_th?: string
    contact_image_4?: number
    contact_image_4_alt_en?: string
    contact_image_4_alt_th?: string
    email_1?: string
    email_2?: string
    email_3?: string
    line_qr?: number
    logo?: number
    name_en?: string
    name_th?: string
    phone_1_label_en?: string
    phone_1_label_th?: string
    phone_1_number?: string
    phone_2_label_en?: string
    phone_2_label_th?: string
    phone_2_number?: string
    phone_3_label_en?: string
    phone_3_label_th?: string
    phone_3_number?: string
    social_1_icon?: number
    social_1_type?: string
    social_1_url?: string
    social_2_icon?: number
    social_2_type?: string
    social_2_url?: string
    social_3_icon?: number
    social_3_type?: string
    social_3_url?: string
  }
}

type WPHeroSlideEntry = {
  id: number
  slug: string
  acf?: {
    cta_primary_link?: string
    cta_primary_text_en?: string
    cta_primary_text_th?: string
    cta_secondary_link?: string
    cta_secondary_text_en?: string
    cta_secondary_text_th?: string
    description_en?: string
    description_th?: string
    subtitle_en?: string
    subtitle_th?: string
    title_en?: string
    title_th?: string
  }
  _embedded?: {
    ["wp:featuredmedia"]?: WPMediaLike[]
  }
}

type WPWhyEntry = {
  id: number
  modified?: string
  slug: string
  acf?: {
    description_en?: string
    description_th?: string
    image?: number
    image_alt_en?: string
    image_alt_th?: string
    order?: number
    title_en?: string
    title_th?: string
  }
}

type WPSinglePageEntry = {
  id: number
  modified?: string
  slug: string
  acf?: {
    seo_description_en?: string
    seo_description_th?: string
    seo_title_en?: string
    seo_title_th?: string
  }
}

type ProductSitemapView = {
  slug: string
  modified?: string
  categorySlug: string
}

type ProductIndexableSitemapView = ProductSitemapView & {
  indexEn: boolean
  indexTh: boolean
}

type CategorySummary = {
  id: string
  name: string
  slug: string
}

function sortById<T extends { id: number }>(items: T[]) {
  return [...items].sort((left, right) => left.id - right.id)
}

function uniqueNumbers(values: Array<number | undefined | null>) {
  return Array.from(
    new Set(
      values.filter(
        (value): value is number =>
          typeof value === "number" && Number.isInteger(value) && value > 0
      )
    )
  )
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

function trimText(value?: string | null) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeAvailabilityStatus(value: unknown) {
  if (value === true) {
    return "in-stock"
  }

  if (value === false) {
    return "out-of-stock"
  }

  const text = trimText(typeof value === "string" ? value : undefined)

  if (!text) {
    return undefined
  }

  const normalized = text.toLowerCase().replace(/_/g, "-")

  if (normalized === "in-stock" || normalized === "available") {
    return "in-stock"
  }

  if (normalized === "out-of-stock" || normalized === "unavailable") {
    return "out-of-stock"
  }

  if (normalized === "made-to-order" || normalized === "mto") {
    return "made-to-order"
  }

  return normalized
}

function extractRelatedProductIds(
  value: Array<number | { ID?: number } | { id?: number }> | undefined
) {
  if (!Array.isArray(value)) {
    return []
  }

  return uniqueNumbers(
    value.map((item) => {
      if (typeof item === "number") {
        return item
      }

      if (item && typeof item === "object") {
        const relation = item as { ID?: number; id?: number }
        return typeof relation.ID === "number" ? relation.ID : relation.id
      }

      return undefined
    })
  )
}

function getSpecMap(specs: ProductSpecView[]) {
  return new Map(
    specs
      .filter((spec) => spec.label && spec.value)
      .map((spec) => [normalizeToken(spec.label), spec.value.trim()])
  )
}

function chooseSyntheticVariantGroup(
  products: ProductView[],
  locale: Locale
) {
  const preferred = [
    "model",
    "sku",
    "variant type",
    "type",
    "style",
    "capacity",
    "inner diameter mm",
    "inner diameter",
    "diameter",
    "size",
    "material",
  ]

  const specMaps = products.map((product) => getSpecMap(product.specs))

  for (const key of preferred) {
    const values = specMaps.map((specMap) => specMap.get(key))

    if (values.some((value) => !value)) {
      continue
    }

    if (new Set(values).size <= 1) {
      continue
    }

    return {
      key: key.replace(/\s+/g, "-"),
      label:
        key === "model"
          ? locale === "th"
            ? "รุ่น"
            : "Model"
          : products[0]?.specs.find((spec) => normalizeToken(spec.label) === key)?.label ??
            (locale === "th" ? "ตัวเลือก" : "Option"),
      values: new Map(products.map((product, index) => [product.id, values[index]!])),
    }
  }

  return {
    key: "variant",
    label: locale === "th" ? "รุ่น" : "Variant",
    values: new Map(
      products.map((product) => [
        product.id,
        product.sku || product.name || product.slug,
      ])
    ),
  }
}

function buildGroupedProductView(
  parent: ProductView,
  members: ProductView[],
  locale: Locale
) {
  const variantGroup = chooseSyntheticVariantGroup(members, locale)
  const variants = members.map((member) => {
    const selectedVariant =
      member.variants.find((variant) => variant.slug === member.defaultVariantSlug) ??
      member.variants[0]

    return {
      id: member.id,
      slug: member.slug,
      sku: member.sku,
      name: member.name,
      description: selectedVariant?.description || member.description,
      image: selectedVariant?.image ?? member.image,
      gallery: selectedVariant?.gallery?.length ? selectedVariant.gallery : member.gallery,
      specs: selectedVariant?.specs?.length ? selectedVariant.specs : member.specs,
      options: [
        {
          groupKey: variantGroup.key,
          groupLabel: variantGroup.label,
          valueKey: member.slug,
          valueLabel:
            variantGroup.values.get(member.id) ?? member.sku ?? member.name ?? member.slug,
        },
      ],
      availabilityStatus: normalizeAvailabilityStatus(
        selectedVariant?.availabilityStatus ?? member.availabilityStatus
      ),
      moq: selectedVariant?.moq ?? member.moq,
      leadTime: selectedVariant?.leadTime ?? member.leadTime,
    } satisfies ProductVariantView
  })

  const defaultVariant =
    variants.find((variant) => variant.slug === parent.slug) ?? variants[0]
  const variantGroups = buildVariantGroups(variants)

  const groupedProduct: ProductView = {
    ...parent,
    description: defaultVariant?.description || parent.description,
    image: defaultVariant?.image ?? parent.image,
    gallery: defaultVariant?.gallery?.length ? defaultVariant.gallery : parent.gallery,
    specs: defaultVariant?.specs?.length ? defaultVariant.specs : parent.specs,
    availabilityStatus: normalizeAvailabilityStatus(
      defaultVariant?.availabilityStatus ?? parent.availabilityStatus
    ),
    moq: defaultVariant?.moq ?? parent.moq,
    leadTime: defaultVariant?.leadTime ?? parent.leadTime,
    familySlug: parent.slug,
    familyName: parent.familyName || parent.name,
    variantCount: variants.length,
    variantSummary: variantGroups.map((group) => group.label).join(" / ") || undefined,
    variantGroups,
    variants,
    defaultVariantSlug: defaultVariant?.slug,
    searchText: "",
  }

  return {
    ...groupedProduct,
    searchText: buildProductSearchText(groupedProduct),
  }
}

function normalizeImageUrl(value?: string) {
  const url = trimText(value)
  return url || undefined
}

function pickMediaUrl(media?: EmbeddedMediaLike) {
  return (
    media?.media_details?.sizes?.large?.source_url ??
    media?.media_details?.sizes?.medium_large?.source_url ??
    media?.media_details?.sizes?.medium?.source_url ??
    media?.media_details?.sizes?.thumbnail?.source_url ??
    media?.source_url ??
    media?.guid?.rendered
  )
}

function resolveMediaImage(
  media: EmbeddedMediaLike | undefined,
  fallbackAlt?: string
): ImageView | undefined {
  const src = normalizeImageUrl(pickMediaUrl(media))

  if (!src) {
    return undefined
  }

  return {
    src,
    alt: trimText(media?.alt_text) || trimText(media?.title?.rendered) || fallbackAlt || "",
  }
}

function resolveImageFromField(
  image:
    | number
    | string
    | {
        alt?: string
        alt_text?: string
        sizes?: {
          large?: string
          medium?: string
          medium_large?: string
          thumbnail?: string
        }
        title?: string
        url?: string
      }
    | undefined,
  mediaMap: Map<number, WPMediaLike>,
  fallbackAlt?: string
): ImageView | undefined {
  if (typeof image === "number") {
    return resolveMediaImage(mediaMap.get(image), fallbackAlt)
  }

  if (typeof image === "string") {
    const src = normalizeImageUrl(image)
    return src ? { src, alt: fallbackAlt || "" } : undefined
  }

  if (!image) {
    return undefined
  }

  const src = normalizeImageUrl(
    image.url ??
      image.sizes?.large ??
      image.sizes?.medium_large ??
      image.sizes?.medium ??
      image.sizes?.thumbnail
  )

  if (!src) {
    return undefined
  }

  return {
    src,
    alt:
      trimText(image.alt) ||
      trimText(image.alt_text) ||
      trimText(image.title) ||
      fallbackAlt ||
      "",
  }
}

function buildImageView(
  options: {
    alt?: string
    fallbackSrc?: string
    image?:
      | number
      | string
      | {
          alt?: string
          alt_text?: string
          sizes?: {
            large?: string
            medium?: string
            medium_large?: string
            thumbnail?: string
          }
          title?: string
          url?: string
        }
    media?: EmbeddedMediaLike
    mediaMap?: Map<number, WPMediaLike>
  }
) {
  const fromField =
    options.image && options.mediaMap
      ? resolveImageFromField(options.image, options.mediaMap, options.alt)
      : undefined

  if (fromField) {
    return fromField
  }

  const fromMedia = resolveMediaImage(options.media, options.alt)

  if (fromMedia) {
    return fromMedia
  }

  const fallbackSrc = normalizeImageUrl(options.fallbackSrc)

  if (!fallbackSrc) {
    return undefined
  }

  return {
    src: fallbackSrc,
    alt: options.alt || "",
  }
}

function parseJsonValue(value: unknown) {
  if (typeof value !== "string") {
    return value
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

function humanizeSpecLabel(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatSpecValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => formatSpecValue(item))
      .filter((item): item is string => Boolean(item))

    return normalized.length > 0 ? normalized.join(", ") : undefined
  }

  if (value && typeof value === "object") {
    const normalized = Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => {
        const formatted = formatSpecValue(nestedValue)
        return formatted ? `${humanizeSpecLabel(key)}: ${formatted}` : undefined
      })
      .filter((item): item is string => Boolean(item))

    return normalized.length > 0 ? normalized.join(" | ") : undefined
  }

  const text = trimText(String(value ?? ""))
  return text || undefined
}

function mapSpecs(specsInput: unknown): ProductSpecView[] {
  const value = parseJsonValue(specsInput)

  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return []
      }

      const row = item as Record<string, unknown>
      const label =
        trimText(String(row.spec_label ?? row.label ?? row.key ?? "")) || undefined
      const formattedValue = formatSpecValue(row.spec_value ?? row.value)

      return label && formattedValue
        ? [{ label, value: formattedValue }]
        : []
    })
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, entryValue]) => {
        const formattedValue = formatSpecValue(entryValue)

        return formattedValue
          ? [{ label: humanizeSpecLabel(key), value: formattedValue }]
          : []
      }
    )
  }

  return []
}

function ensureGallery(primaryImage?: ImageView, gallery: ImageView[] = []) {
  const entries = [primaryImage, ...gallery].filter(
    (item): item is ImageView => Boolean(item?.src)
  )

  return Array.from(new Map(entries.map((item) => [item.src, item])).values())
}

function getEmbeddedFeaturedMedia(
  entry: {
    _embedded?: {
      ["wp:featuredmedia"]?: EmbeddedMediaLike[]
    }
  }
) {
  return entry._embedded?.["wp:featuredmedia"]?.[0]
}

function getEmbeddedTerms(
  entry: {
    _embedded?: {
      ["wp:term"]?: WPTerm[][]
    }
  },
  taxonomy: string
) {
  return (
    entry._embedded?.["wp:term"]
      ?.flat()
      .filter((term): term is WPTerm => term.taxonomy === taxonomy) ?? []
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

  for (const variant of variants) {
    for (const option of variant.options) {
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
        continue
      }

      if (!existing.values.has(option.valueKey)) {
        existing.values.set(option.valueKey, {
          valueKey: option.valueKey,
          valueLabel: option.valueLabel,
          variantSlug: variant.slug,
        })
      }
    }
  }

  return Array.from(groups.values()).map((group) => ({
    key: group.key,
    label: group.label,
    values: Array.from(group.values.values()),
  }))
}

function buildProductSearchText(product: ProductView) {
  return [
    product.slug,
    product.name,
    product.description,
    product.familyName,
    ...product.specs.flatMap((spec) => [spec.label, spec.value]),
    ...product.variants.flatMap((variant) => [
      variant.slug,
      variant.sku ?? "",
      variant.name,
      variant.description ?? "",
      ...variant.specs.flatMap((spec) => [spec.label, spec.value]),
      ...variant.options.flatMap((option) => [
        option.groupLabel,
        option.valueLabel,
      ]),
    ]),
  ]
    .filter((value): value is string => Boolean(trimText(value)))
    .join(" ")
}

function mapVariantOptions(
  locale: Locale,
  options: WPProductVariantOption[] | undefined
) {
  return (options ?? []).flatMap((option) => {
    const groupKey = trimText(option?.group_key)
    const valueKey =
      trimText(option?.value_key) ||
      trimText(
        pickLocalizedText(locale, option?.value_th, option?.value_en)
      )
    const groupLabel = trimText(
      pickLocalizedText(locale, option?.group_label_th, option?.group_label_en)
    )
    const valueLabel = trimText(
      pickLocalizedText(locale, option?.value_th, option?.value_en)
    )

    if (!groupKey || !valueKey || !groupLabel || !valueLabel) {
      return []
    }

    return [
      {
        groupKey,
        groupLabel,
        valueKey,
        valueLabel,
      } satisfies ProductVariantOptionView,
    ]
  })
}

async function fetchMediaMap(ids: number[]) {
  const mediaMap = new Map<number, WPMediaLike>()

  for (const mediaIds of chunk(uniqueNumbers(ids), 50)) {
    if (!mediaIds.length) {
      continue
    }

    const items = await fetchWordPressCollection<WPMediaLike>("wp/v2/media", {
      perPage: mediaIds.length,
      searchParams: {
        include: mediaIds.join(","),
      },
      tags: ["wordpress", "media"],
    })

    for (const item of items) {
      mediaMap.set(item.id, item)
    }
  }

  return mediaMap
}

async function fetchWordPressCategoriesRaw() {
  return sortById(
    await fetchWordPressCollection<WPCategoryTerm>("wp/v2/product_category", {
      tags: ["wordpress", "categories"],
    })
  )
}

async function fetchWordPressProductsRaw() {
  return sortById(
    await fetchWordPressCollection<WPProduct>("wp/v2/product", {
      perPage: WORDPRESS_PRODUCTS_FETCH_PAGE_SIZE,
      searchParams: {
        _embed: 1,
      },
      tags: ["wordpress", "products"],
    })
  )
}

async function fetchWordPressArticlesRaw() {
  return sortById(
    await fetchWordPressCollection<WPArticle>("wp/v2/article", {
      searchParams: {
        _embed: 1,
      },
      tags: ["wordpress", "articles"],
    })
  )
}

async function fetchWordPressAboutRaw() {
  const items = await fetchWordPressCollection<WPAboutEntry>("wp/v2/about", {
    tags: ["wordpress", "about"],
  })

  return items[0] ?? null
}

async function fetchWordPressCompanyRaw() {
  const items = await fetchWordPressCollection<WPCompanyEntry>("wp/v2/company", {
    tags: ["wordpress", "company"],
  })

  return items[0] ?? null
}

async function fetchWordPressHeroSlidesRaw() {
  return sortById(
    await fetchWordPressCollection<WPHeroSlideEntry>("wp/v2/hero_slide", {
      searchParams: {
        _embed: 1,
      },
      tags: ["wordpress", "hero"],
    })
  )
}

async function fetchWordPressWhyRaw() {
  return sortById(
    await fetchWordPressCollection<WPWhyEntry>("wp/v2/why", {
      tags: ["wordpress", "why"],
    })
  )
}

async function fetchWordPressHomePageRaw() {
  const items = await fetchWordPressCollection<WPSinglePageEntry>("wp/v2/pages", {
    searchParams: {
      slug: "home",
    },
    tags: ["wordpress", "home"],
  })

  return items[0] ?? null
}

function mapCategoryTermToView(term: WPCategoryTerm, locale: Locale): CategoryView {
  const name = pickLocalizedText(locale, term.acf?.name_th, term.acf?.name_en, term.name)
  const description = pickLocalizedText(
    locale,
    term.acf?.description_th,
    term.acf?.description_en,
    term.description
  )

  return {
    id: String(term.id),
    slug: term.slug,
    name,
    description,
    image: term.image_url
      ? {
          src: term.image_url,
          alt: pickLocalizedText(
            locale,
            term.acf?.image_alt_th,
            term.acf?.image_alt_en,
            name
          ),
        }
      : undefined,
    introHtml: normalizeRichText(
      pickLocalizedText(locale, term.acf?.intro_html_th, term.acf?.intro_html_en)
    ),
    faqItems: mapFaqItems(term.acf?.faq_items, locale),
    seoTitle: pickLocalizedText(locale, term.acf?.seo_title_th, term.acf?.seo_title_en, name),
    seoDescription: pickLocalizedText(
      locale,
      term.acf?.seo_description_th,
      term.acf?.seo_description_en,
      description
    ),
  }
}

function mapArticleBlocks(
  blocks: WPArticleContentBlock[] | undefined,
  locale: Locale
): ArticleBlockView[] {
  if (!Array.isArray(blocks)) {
    return []
  }

  return blocks.reduce<ArticleBlockView[]>((accumulator, block) => {
    const type = block.acf_fc_layout

    if (type === "rich_text") {
      const body = normalizeRichText(
        pickLocalizedText(locale, block.body_th, block.body_en)
      )

      if (!body) {
        return accumulator
      }

      accumulator.push({
          type: "rich_text",
          anchorId: trimText(block.anchor_id),
          eyebrow: trimText(
            pickLocalizedText(locale, block.eyebrow_th, block.eyebrow_en)
          ),
          heading: trimText(
            pickLocalizedText(locale, block.heading_th, block.heading_en)
          ),
          body,
        } satisfies ArticleBlockView)

      return accumulator
    }

    if (type === "checklist") {
      const heading = trimText(
        pickLocalizedText(locale, block.heading_th, block.heading_en)
      )

      if (!heading) {
        return accumulator
      }

      const items = (block.items ?? [])
        .map((item) =>
          trimText(pickLocalizedText(locale, item.item_th, item.item_en))
        )
        .filter((item): item is string => Boolean(item))

      if (!items.length) {
        return accumulator
      }

      accumulator.push({
          type: "checklist",
          anchorId: trimText(block.anchor_id),
          heading,
          intro: trimText(
            pickLocalizedText(locale, block.intro_th, block.intro_en)
          ),
          items,
        } satisfies ArticleBlockView)

      return accumulator
    }

    if (type === "callout") {
      const body = normalizeRichText(
        pickLocalizedText(locale, block.body_th, block.body_en)
      )

      if (!body) {
        return accumulator
      }

      const calloutStyle =
        block.style === "info" ||
        block.style === "success" ||
        block.style === "warning" ||
        block.style === "note"
          ? block.style
          : "note"

      accumulator.push({
          type: "callout",
          style: calloutStyle,
          heading: trimText(
            pickLocalizedText(locale, block.heading_th, block.heading_en)
          ),
          body,
        } satisfies ArticleBlockView)

      return accumulator
    }

    if (type === "comparison_table") {
      const heading = trimText(
        pickLocalizedText(locale, block.heading_th, block.heading_en)
      )
      const leftLabel = trimText(
        pickLocalizedText(locale, block.left_label_th, block.left_label_en)
      )
      const rightLabel = trimText(
        pickLocalizedText(locale, block.right_label_th, block.right_label_en)
      )

      if (!heading || !leftLabel || !rightLabel) {
        return accumulator
      }

      const rows = (block.rows ?? []).flatMap((row) => {
        const criterion = trimText(
          pickLocalizedText(locale, row.criterion_th, row.criterion_en)
        )

        if (!criterion) {
          return []
        }

        return [
          {
            criterion,
            leftValue: trimText(
              pickLocalizedText(locale, row.left_value_th, row.left_value_en)
            ),
            rightValue: trimText(
              pickLocalizedText(locale, row.right_value_th, row.right_value_en)
            ),
          },
        ]
      })

      if (!rows.length) {
        return accumulator
      }

      accumulator.push({
          type: "comparison_table",
          heading,
          leftLabel,
          rightLabel,
          rows,
        } satisfies ArticleBlockView)

      return accumulator
    }

    if (type === "cta") {
      const heading = trimText(
        pickLocalizedText(locale, block.heading_th, block.heading_en)
      )
      const buttonLabel = trimText(
        pickLocalizedText(
          locale,
          block.button_label_th,
          block.button_label_en
        )
      )

      if (!heading || !buttonLabel) {
        return accumulator
      }

      accumulator.push({
          type: "cta",
          style:
            block.style === "info" ||
            block.style === "success" ||
            block.style === "warning" ||
            block.style === "note"
              ? "soft"
              : block.style,
          heading,
          body: trimText(
            pickLocalizedText(locale, block.body_th, block.body_en)
          ),
          buttonLabel,
          buttonUrl: trimText(block.button_url),
        } satisfies ArticleBlockView)
    }

    return accumulator
  }, [])
}

async function loadWordPressProductViews(locale: Locale) {
  const rawProducts = await fetchWordPressProductsRaw()
  const mediaIds = uniqueNumbers(
    rawProducts.flatMap((product) => [
      product.featured_media,
      ...(product.acf?.gallery_images ?? []).map((item) =>
        typeof item.image === "number" ? item.image : undefined
      ),
      ...(product.acf?.variants ?? []).flatMap((variant) => [
        typeof variant.image === "number" ? variant.image : undefined,
        ...(variant.gallery_images ?? []).map((item) =>
          typeof item.image === "number" ? item.image : undefined
        ),
      ]),
    ])
  )
  const mediaMap = await fetchMediaMap(mediaIds)

  const mappedProducts = rawProducts.map((product) => {
    const embeddedCategory = getEmbeddedTerms(product, "product_category")[0] as
      | (WPTerm & WPCategoryTerm)
      | undefined
    const categorySlug = embeddedCategory?.slug ?? ""
    const categoryId = embeddedCategory?.id
      ? String(embeddedCategory.id)
      : String(product.product_category?.[0] ?? "")
    const baseName = pickLocalizedText(
      locale,
      product.acf?.name_th,
      product.acf?.name_en,
      product.title.rendered
    )
    const familyName = trimText(
      pickLocalizedText(
        locale,
        product.acf?.family_name_th,
        product.acf?.family_name_en,
        baseName
      )
    )
    const fallbackAlt = pickLocalizedText(
      locale,
      product.acf?.image_alt_th,
      product.acf?.image_alt_en,
      baseName
    )
    const primaryImage =
      buildImageView({
        alt: fallbackAlt,
        fallbackSrc: product.featured_image_url,
        media: getEmbeddedFeaturedMedia(product),
        mediaMap,
      }) ?? {
        src: "/placeholder.jpg",
        alt: fallbackAlt || baseName,
      }
    const gallery = ensureGallery(
      primaryImage,
      (product.acf?.gallery_images ?? [])
        .map((item) =>
          buildImageView({
            alt: pickLocalizedText(locale, item.alt_th, item.alt_en, fallbackAlt),
            image: item.image,
            mediaMap,
          })
        )
        .filter((item): item is ImageView => Boolean(item))
    )
    const variants = (product.acf?.variants?.length
      ? product.acf.variants.map((variant, index) => {
          const variantName = trimText(
            pickLocalizedText(
              locale,
              variant.label_th,
              variant.label_en,
              baseName
            )
          ) || `${baseName} ${index + 1}`
          const variantImage =
            buildImageView({
              alt: variantName,
              image: variant.image,
              fallbackSrc: variant.image_url,
              mediaMap,
            }) ?? primaryImage
          const variantGallery = ensureGallery(
            variantImage,
            (variant.gallery_images ?? [])
              .map((item) =>
                buildImageView({
                  alt: pickLocalizedText(locale, item.alt_th, item.alt_en, variantName),
                  image: item.image,
                  mediaMap,
                })
              )
              .filter((item): item is ImageView => Boolean(item))
          )

          return {
            id: `${product.id}-${variant.slug ?? index + 1}`,
            slug: trimText(variant.slug) || `${product.slug}-variant-${index + 1}`,
            sku: trimText(variant.sku) || trimText(product.acf?.sku),
            name: variantName,
            description: trimText(
              pickLocalizedText(
                locale,
                variant.description_th,
                variant.description_en,
                product.acf?.description_th
              )
            ),
            image: variantImage,
            gallery: variantGallery,
            specs: mapSpecs(variant.specs_json),
            options: mapVariantOptions(locale, variant.options),
            availabilityStatus: normalizeAvailabilityStatus(variant.availability_status),
            moq: trimText(variant.moq),
            leadTime: trimText(variant.lead_time),
          } satisfies ProductVariantView
        })
      : [
          {
            id: String(product.id),
            slug: product.slug,
            sku: trimText(product.acf?.sku),
            name: baseName,
            description: trimText(
              pickLocalizedText(
                locale,
                product.acf?.description_th,
                product.acf?.description_en
              )
            ),
            image: primaryImage,
            gallery,
            specs: mapSpecs(product.acf?.specs_json),
            options: [],
            availabilityStatus: normalizeAvailabilityStatus(product.acf?.availability_status),
            moq: trimText(product.acf?.moq),
            leadTime: trimText(product.acf?.lead_time),
          } satisfies ProductVariantView,
        ]) as ProductVariantView[]
    const defaultVariant =
      variants.find((variant) => variant.slug === product.acf?.default_variant_slug) ??
      variants[0]
    const specs =
      defaultVariant?.specs.length ? defaultVariant.specs : mapSpecs(product.acf?.specs_json)
    const productView: ProductView = {
      id: String(product.id),
      slug: product.slug,
      name: familyName || baseName,
      description:
        trimText(
          pickLocalizedText(
            locale,
            product.acf?.description_th,
            product.acf?.description_en
          )
        ) ||
        trimText(
          pickLocalizedText(
            locale,
            product.acf?.content_th,
            product.acf?.content_en,
            product.content.rendered
          )
        ) ||
        "",
      image: primaryImage,
      categoryId,
      categorySlug,
      gallery,
      specs,
      contentHtml: normalizeRichText(
        pickLocalizedText(
          locale,
          product.acf?.content_th,
          product.acf?.content_en,
          product.content.rendered
        )
      ),
      applicationHtml: normalizeRichText(
        pickLocalizedText(
          locale,
          product.acf?.application_th,
          product.acf?.application_en
        )
      ),
      faqItems: mapFaqItems(product.acf?.faq_items, locale),
      price: undefined,
      sku: trimText(product.acf?.sku),
      availabilityStatus: normalizeAvailabilityStatus(product.acf?.availability_status),
      moq: trimText(product.acf?.moq),
      leadTime: trimText(product.acf?.lead_time),
      familySlug: product.slug,
      familyName: familyName || baseName,
      variantCount: variants.length,
      variantSummary: undefined,
      variantGroups: buildVariantGroups(variants),
      variants,
      defaultVariantSlug: defaultVariant?.slug,
      searchText: "",
    }

    return {
      product: {
        ...productView,
        variantSummary:
          productView.variantGroups.map((group) => group.label).join(" / ") || undefined,
        searchText: buildProductSearchText(productView),
      },
      relatedProductIds: extractRelatedProductIds(product.acf?.related_products),
    }
  })

  const productById = new Map(
    mappedProducts.map((entry) => [Number(entry.product.id), entry.product])
  )
  const childIds = new Set(
    mappedProducts.flatMap((entry) => entry.relatedProductIds)
  )

  return mappedProducts.flatMap((entry) => {
    const productId = Number(entry.product.id)

    if (childIds.has(productId) && entry.relatedProductIds.length === 0) {
      return []
    }

    if (entry.relatedProductIds.length === 0) {
      return [entry.product]
    }

    const members = [entry.product]

    for (const id of entry.relatedProductIds) {
      const relatedProduct = productById.get(id)

      if (relatedProduct) {
        members.push(relatedProduct)
      }
    }

    return [buildGroupedProductView(entry.product, members, locale)]
  })
}

export async function getWordPressCategories(locale: Locale) {
  const rawCategories = await fetchWordPressCategoriesRaw()
  return rawCategories.map((category) => mapCategoryTermToView(category, locale))
}

export async function getWordPressAllCategorySlugs() {
  const rawCategories = await fetchWordPressCategoriesRaw()
  return rawCategories.map((category) => category.slug)
}

export async function getWordPressCategoryIdBySlug(slug: string) {
  const rawCategories = await fetchWordPressCategoriesRaw()
  const category = rawCategories.find((item) => item.slug === slug)
  return category ? Number(category.id) : null
}

export async function getWordPressCategoryBySlug(slug: string, locale: Locale) {
  const rawCategories = await fetchWordPressCategoriesRaw()
  const category = rawCategories.find((item) => item.slug === slug)
  return category ? mapCategoryTermToView(category, locale) : null
}

export async function getWordPressProducts(locale: Locale) {
  return loadWordPressProductViews(locale)
}

export async function getWordPressProductsByCategory(
  slug: string,
  locale: Locale,
  page = 1
) {
  const products = (await loadWordPressProductViews(locale)).filter(
    (product) => product.categorySlug === slug
  )
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

export async function getWordPressAllProductsByCategory(
  slug: string,
  locale: Locale
) {
  return (await loadWordPressProductViews(locale)).filter(
    (product) => product.categorySlug === slug
  )
}

export async function getWordPressProductBySlug(slug: string, locale: Locale) {
  return (
    (await loadWordPressProductViews(locale)).find(
      (product) =>
        product.slug === slug ||
        product.variants.some((variant) => variant.slug === slug)
    ) ?? null
  )
}

export async function getWordPressRelatedProducts(
  categorySlug: string,
  currentProductSlug: string,
  locale: Locale
) {
  return (await loadWordPressProductViews(locale))
    .filter(
      (product) =>
        product.categorySlug === categorySlug &&
        product.slug !== currentProductSlug &&
        !product.variants.some((variant) => variant.slug === currentProductSlug)
    )
    .slice(0, 4)
}

export async function getWordPressAllProductsForSitemap(): Promise<ProductSitemapView[]> {
  const rawProducts = await fetchWordPressProductsRaw()

  return rawProducts.flatMap((product) => {
    const category = getEmbeddedTerms(product, "product_category")[0]
    const categorySlug = trimText(category?.slug)

    return categorySlug
      ? [
          {
            slug: product.slug,
            modified: product.modified,
            categorySlug,
          },
        ]
      : []
  })
}

export async function getWordPressIndexableProductsForSitemap(): Promise<
  ProductIndexableSitemapView[]
> {
  const productsTh = await loadWordPressProductViews("th")
  const productsEn = new Map(
    (await loadWordPressProductViews("en")).map((product) => [product.slug, product])
  )
  const rawProducts = new Map(
    (await fetchWordPressProductsRaw()).map((product) => [product.slug, product])
  )

  return productsTh.flatMap((product) => {
    const productEn = productsEn.get(product.slug)
    const rawProduct = rawProducts.get(product.slug)

    if (!product.categorySlug || !productEn) {
      return []
    }

    return [
      {
        slug: product.slug,
        modified: rawProduct?.modified,
        categorySlug: product.categorySlug,
        indexTh: shouldIndexProduct(product),
        indexEn: shouldIndexProduct(productEn),
      },
    ]
  })
}

export async function getWordPressArticles(locale: Locale): Promise<ArticleView[]> {
  const rawArticles = await fetchWordPressArticlesRaw()
  const mediaIds = uniqueNumbers(
    rawArticles.map((article) => article.acf?.image ?? article.featured_media)
  )
  const mediaMap = await fetchMediaMap(mediaIds)

  return rawArticles.map((article) => {
    const title = pickLocalizedText(
      locale,
      article.acf?.title_th,
      article.acf?.title_en,
      article.title.rendered
    )
    const excerpt = pickLocalizedText(
      locale,
      article.acf?.excerpt_th,
      article.acf?.excerpt_en
    )
    const coverImage = buildImageView({
      alt: pickLocalizedText(
        locale,
        article.acf?.image_alt_th,
        article.acf?.image_alt_en,
        title
      ),
      image: article.acf?.image,
      media: getEmbeddedFeaturedMedia(article),
      mediaMap,
    })
    const tags = getEmbeddedTerms(article, "article_tag").map((term) => ({
      id: Number(term.id),
      slug: term.slug,
      name: term.name,
    }))

    return {
      id: String(article.id),
      slug: article.slug,
      title,
      excerpt:
        excerpt ||
        pickLocalizedText(
          locale,
          article.acf?.meta_description_th,
          article.acf?.meta_description_en,
          title
        ),
      content:
        normalizeRichText(
          pickLocalizedText(
            locale,
            article.acf?.content_th,
            article.acf?.content_en,
            article.content.rendered
          )
        ) ?? "",
      blocks: mapArticleBlocks(article.acf?.content_blocks, locale),
      authorName: trimText(article.acf?.author_name) || "168 Innovative",
      coverImage,
      category: undefined,
      tags,
      publishedAt: trimText(article.acf?.published_at) || article.date,
      updatedAt: trimText(article.acf?.updated_at) || article.modified || article.date,
      seoTitle: trimText(
        pickLocalizedText(locale, article.acf?.seo_title_th, article.acf?.seo_title_en)
      ),
      metaDescription: trimText(
        pickLocalizedText(
          locale,
          article.acf?.meta_description_th,
          article.acf?.meta_description_en,
          excerpt
        )
      ),
      canonicalUrl: trimText(
        pickLocalizedText(
          locale,
          article.acf?.canonical_url_th,
          article.acf?.canonical_url_en
        )
      ),
      focusKeyword: trimText(
        pickLocalizedText(
          locale,
          article.acf?.focus_keyword_th ?? article.acf?.focus_keyword,
          article.acf?.focus_keyword_en ?? article.acf?.focus_keyword
        )
      ),
      readingTimeMinutes:
        typeof article.acf?.reading_time_minutes === "number"
          ? article.acf.reading_time_minutes
          : undefined,
      faqItems: mapFaqItems(article.acf?.faq_items, locale),
    }
  })
}

export async function getWordPressArticlesForSitemap(locale: Locale) {
  return (await getWordPressArticles(locale)).map((article) => ({
    slug: article.slug,
    canonicalUrl: article.canonicalUrl,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
  }))
}

export async function getWordPressAllArticleSlugs() {
  return (await fetchWordPressArticlesRaw()).map((article) => article.slug)
}

export async function getWordPressArticleBySlug(
  slug: string,
  locale: Locale
): Promise<ArticleView | null> {
  return (await getWordPressArticles(locale)).find((article) => article.slug === slug) ?? null
}

export async function getWordPressAbout(
  locale: Locale
): Promise<Omit<AboutView, "why"> | null> {
  const entry = await fetchWordPressAboutRaw()

  if (!entry) {
    return null
  }

  const mediaMap = await fetchMediaMap(
    uniqueNumbers([
      entry.acf?.hero_image_1,
      entry.acf?.hero_image_2,
      entry.acf?.who_image,
      entry.acf?.og_image,
    ])
  )
  const heroTitle = pickLocalizedText(
    locale,
    entry.acf?.hero_title_th,
    entry.acf?.hero_title_en,
    "About"
  )

  return {
    hero: {
      title: heroTitle,
      description: pickLocalizedText(
        locale,
        entry.acf?.hero_description_th,
        entry.acf?.hero_description_en
      ),
      image1: buildImageView({
        alt: pickLocalizedText(
          locale,
          entry.acf?.hero_image_1_alt_th,
          entry.acf?.hero_image_1_alt_en,
          heroTitle
        ),
        image: entry.acf?.hero_image_1,
        mediaMap,
      }),
      image2: buildImageView({
        alt: pickLocalizedText(
          locale,
          entry.acf?.hero_image_2_alt_th,
          entry.acf?.hero_image_2_alt_en,
          heroTitle
        ),
        image: entry.acf?.hero_image_2,
        mediaMap,
      }),
    },
    whoAreWe: {
      title: pickLocalizedText(
        locale,
        entry.acf?.who_title_th,
        entry.acf?.who_title_en,
        "Who We Are"
      ),
      description: pickLocalizedText(
        locale,
        entry.acf?.who_description_th,
        entry.acf?.who_description_en
      ),
      image: buildImageView({
        alt: pickLocalizedText(
          locale,
          entry.acf?.who_image_alt_th,
          entry.acf?.who_image_alt_en,
          heroTitle
        ),
        image: entry.acf?.who_image,
        mediaMap,
      }),
    },
    seoTitle: trimText(
      pickLocalizedText(locale, entry.acf?.seo_title_th, entry.acf?.seo_title_en, heroTitle)
    ),
    seoDescription: trimText(
      pickLocalizedText(
        locale,
        entry.acf?.seo_description_th,
        entry.acf?.seo_description_en,
        entry.acf?.hero_description_th
      )
    ),
  }
}

export async function getWordPressCompany(locale: Locale): Promise<CompanyView | null> {
  const entry = await fetchWordPressCompanyRaw()

  if (!entry) {
    return null
  }

  const mediaMap = await fetchMediaMap(
    uniqueNumbers([
      entry.acf?.logo,
      entry.acf?.line_qr,
      entry.acf?.contact_image,
      entry.acf?.contact_image_1,
      entry.acf?.contact_image_2,
      entry.acf?.contact_image_3,
      entry.acf?.contact_image_4,
      entry.acf?.social_1_icon,
      entry.acf?.social_2_icon,
      entry.acf?.social_3_icon,
    ])
  )
  const companyName = pickLocalizedText(
    locale,
    entry.acf?.name_th,
    entry.acf?.name_en,
    "168 Innovative"
  )

  return {
    logo:
      buildImageView({
        alt: companyName,
        image: entry.acf?.logo,
        mediaMap,
      }) ?? {
        src: "/logo.png",
        alt: companyName,
      },
    name: companyName,
    address: pickLocalizedText(
      locale,
      entry.acf?.address_th,
      entry.acf?.address_en
    ),
    phones: [
      {
        number: trimText(entry.acf?.phone_1_number),
        label: pickLocalizedText(
          locale,
          entry.acf?.phone_1_label_th,
          entry.acf?.phone_1_label_en
        ),
      },
      {
        number: trimText(entry.acf?.phone_2_number),
        label: pickLocalizedText(
          locale,
          entry.acf?.phone_2_label_th,
          entry.acf?.phone_2_label_en
        ),
      },
      {
        number: trimText(entry.acf?.phone_3_number),
        label: pickLocalizedText(
          locale,
          entry.acf?.phone_3_label_th,
          entry.acf?.phone_3_label_en
        ),
      },
    ].filter(
      (
        phone
      ): phone is {
        number: string
        label: string
      } => Boolean(phone.number)
    ),
    email: [
      trimText(entry.acf?.email_1),
      trimText(entry.acf?.email_2),
      trimText(entry.acf?.email_3),
    ].filter((email): email is string => Boolean(email)),
    socials: [
      {
        type: trimText(entry.acf?.social_1_type),
        url: trimText(entry.acf?.social_1_url),
        icon: buildImageView({
          alt: trimText(entry.acf?.social_1_type) || "Social icon",
          image: entry.acf?.social_1_icon,
          mediaMap,
        }),
      },
      {
        type: trimText(entry.acf?.social_2_type),
        url: trimText(entry.acf?.social_2_url),
        icon: buildImageView({
          alt: trimText(entry.acf?.social_2_type) || "Social icon",
          image: entry.acf?.social_2_icon,
          mediaMap,
        }),
      },
      {
        type: trimText(entry.acf?.social_3_type),
        url: trimText(entry.acf?.social_3_url),
        icon: buildImageView({
          alt: trimText(entry.acf?.social_3_type) || "Social icon",
          image: entry.acf?.social_3_icon,
          mediaMap,
        }),
      },
    ].flatMap((social) =>
      social.type && social.url
        ? [
            {
              type: social.type,
              url: social.url,
              icon: social.icon,
            },
          ]
        : []
    ),
    lineQrCode: buildImageView({
      alt: locale === "th" ? "LINE QR" : "LINE QR code",
      image: entry.acf?.line_qr,
      mediaMap,
    }),
    contactImage: buildImageView({
      alt: companyName,
      image: entry.acf?.contact_image,
      mediaMap,
    }),
    contactGallery: [
      buildImageView({
        alt: pickLocalizedText(
          locale,
          entry.acf?.contact_image_1_alt_th,
          entry.acf?.contact_image_1_alt_en,
          companyName
        ),
        image: entry.acf?.contact_image_1,
        mediaMap,
      }),
      buildImageView({
        alt: pickLocalizedText(
          locale,
          entry.acf?.contact_image_2_alt_th,
          entry.acf?.contact_image_2_alt_en,
          companyName
        ),
        image: entry.acf?.contact_image_2,
        mediaMap,
      }),
      buildImageView({
        alt: pickLocalizedText(
          locale,
          entry.acf?.contact_image_3_alt_th,
          entry.acf?.contact_image_3_alt_en,
          companyName
        ),
        image: entry.acf?.contact_image_3,
        mediaMap,
      }),
      buildImageView({
        alt: pickLocalizedText(
          locale,
          entry.acf?.contact_image_4_alt_th,
          entry.acf?.contact_image_4_alt_en,
          companyName
        ),
        image: entry.acf?.contact_image_4,
        mediaMap,
      }),
    ].filter((image): image is ImageView => Boolean(image)),
  }
}

export async function getWordPressHeroSlides(locale: Locale) {
  const slides = await fetchWordPressHeroSlidesRaw()

  return slides.map((slide, index) => {
    const title = pickLocalizedText(
      locale,
      slide.acf?.title_th,
      slide.acf?.title_en,
      `Slide ${index + 1}`
    )
    const subtitle = trimText(
      pickLocalizedText(locale, slide.acf?.subtitle_th, slide.acf?.subtitle_en)
    )
    const description = [
      trimText(
        pickLocalizedText(
          locale,
          slide.acf?.description_th,
          slide.acf?.description_en
        )
      ),
      subtitle,
    ]
      .filter((value): value is string => Boolean(value))
      .join(" ")
    const image =
      buildImageView({
        alt: title,
        media: getEmbeddedFeaturedMedia(slide),
      }) ?? {
        src: "/placeholder.jpg",
        alt: title,
      }

    return {
      id: slide.id,
      theme: HERO_THEMES[index % HERO_THEMES.length],
      badge: {
        text: subtitle || (locale === "th" ? "168 Innovative" : "168 Innovative"),
        variant: index === 0 ? "featured" : "promo",
      },
      title,
      description,
      image,
      ctaPrimary: {
        href: trimText(slide.acf?.cta_primary_link) || "/categories",
        label: pickLocalizedText(
          locale,
          slide.acf?.cta_primary_text_th,
          slide.acf?.cta_primary_text_en,
          locale === "th" ? "ดูสินค้า" : "View Products"
        ),
      },
      ctaSecondary: {
        href: trimText(slide.acf?.cta_secondary_link) || "/contact",
        label: pickLocalizedText(
          locale,
          slide.acf?.cta_secondary_text_th,
          slide.acf?.cta_secondary_text_en,
          locale === "th" ? "ติดต่อเรา" : "Contact Us"
        ),
      },
      highlight: undefined,
    } satisfies HeroSlideView
  })
}

export async function getWordPressWhy(locale: Locale): Promise<WhyItemView[]> {
  const items = await fetchWordPressWhyRaw()
  const mediaMap = await fetchMediaMap(
    uniqueNumbers(items.map((item) => item.acf?.image))
  )

  return [...items]
    .sort((left, right) => (left.acf?.order ?? left.id) - (right.acf?.order ?? right.id))
    .map((item) => {
      const title = pickLocalizedText(
        locale,
        item.acf?.title_th,
        item.acf?.title_en,
        item.slug
      )

      return {
        title,
        description: pickLocalizedText(
          locale,
          item.acf?.description_th,
          item.acf?.description_en
        ),
        image: buildImageView({
          alt: pickLocalizedText(
            locale,
            item.acf?.image_alt_th,
            item.acf?.image_alt_en,
            title
          ),
          image: item.acf?.image,
          mediaMap,
        }),
      }
    })
}

export async function getWordPressHomeSeo(locale: Locale) {
  const page = await fetchWordPressHomePageRaw()

  if (!page) {
    return null
  }

  return {
    title: trimText(
      pickLocalizedText(locale, page.acf?.seo_title_th, page.acf?.seo_title_en)
    ),
    description: trimText(
      pickLocalizedText(
        locale,
        page.acf?.seo_description_th,
        page.acf?.seo_description_en
      )
    ),
    modified: trimText(page.modified),
  }
}

async function fetchSingleModified(path: string, slug?: string) {
  const items = await fetchWordPressCollection<{ modified?: string }>(path, {
    searchParams: slug ? { slug } : undefined,
    perPage: 1,
    tags: ["wordpress", "sitemap"],
  })

  return trimText(items[0]?.modified) || null
}

export async function getWordPressAboutLastModified() {
  return fetchSingleModified("wp/v2/about")
}

export async function getWordPressCompanyLastModified() {
  return fetchSingleModified("wp/v2/company")
}

export async function getWordPressHeroLastModified() {
  const items = await fetchWordPressCollection<{ modified?: string }>(
    "wp/v2/hero_slide",
    {
      tags: ["wordpress", "sitemap"],
    }
  )

  const latest = items
    .map((item) => trimText(item.modified))
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1)

  return latest ?? null
}

export async function getWordPressWhyLastModified() {
  const items = await fetchWordPressCollection<{ modified?: string }>("wp/v2/why", {
    tags: ["wordpress", "sitemap"],
  })

  const latest = items
    .map((item) => trimText(item.modified))
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1)

  return latest ?? null
}

export async function getWordPressPosts() {
  return fetchWordPressJson<unknown[]>("wp/v2/posts", {
    searchParams: {
      per_page: 10,
    },
    tags: ["wordpress", "posts"],
  })
}

export async function getWordPressHomeCategorySummaries(
  locale: Locale
): Promise<CategorySummary[]> {
  const categories = await getWordPressCategories(locale)
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }))
}
