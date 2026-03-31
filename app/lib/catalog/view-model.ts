import type { ProductVariantGroupView, ProductVariantView, ProductView } from "@/app/lib/types/view"

export type CatalogFacetSection = {
  key: string
  label: string
  options: string[]
  source: "spec" | "variant"
}

export type CatalogFacetState = Record<string, string[]>

export type SortOrder = "default" | "asc" | "desc" | "moq-asc"

type FacetCandidate = CatalogFacetSection & {
  score: number
}

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function specValueMap(product: ProductView) {
  return new Map(
    product.specs
      .filter((spec) => spec.label && spec.value)
      .map((spec) => [normalizeToken(spec.label), spec.value.trim()])
  )
}

function preferredScore(label: string) {
  const normalized = normalizeToken(label)

  if (
    normalized.includes("shape") ||
    normalized.includes("type") ||
    normalized.includes("style")
  ) {
    return 6
  }

  if (
    normalized.includes("capacity") ||
    normalized.includes("diameter") ||
    normalized.includes("size") ||
    normalized.includes("width") ||
    normalized.includes("height")
  ) {
    return 5
  }

  if (
    normalized.includes("material") ||
    normalized.includes("finish") ||
    normalized.includes("color")
  ) {
    return 4
  }

  if (normalized.includes("application") || normalized.includes("usage")) {
    return 3
  }

  return 1
}

export function getCatalogFacetSections(products: ProductView[]) {
  const candidates = new Map<string, FacetCandidate>()

  products.forEach((product) => {
    product.variantGroups.forEach((group) => {
      const options = new Set(group.values.map((value) => value.valueLabel.trim()).filter(Boolean))

      if (options.size <= 1 || options.size > 10) {
        return
      }

      const key = `variant:${group.key}`
      const existing = candidates.get(key)

      if (existing) {
        options.forEach((option) => existing.options.includes(option) || existing.options.push(option))
        return
      }

      candidates.set(key, {
        key,
        label: group.label,
        options: Array.from(options),
        source: "variant",
        score: 20 + preferredScore(group.label),
      })
    })

    specValueMap(product).forEach((value, key) => {
      const label = product.specs.find((spec) => normalizeToken(spec.label) === key)?.label ?? key
      const existing = candidates.get(key)

      if (existing) {
        if (!existing.options.includes(value)) {
          existing.options.push(value)
        }
        return
      }

      candidates.set(key, {
        key,
        label,
        options: [value],
        source: "spec",
        score: 10 + preferredScore(label),
      })
    })
  })

  return Array.from(candidates.values())
    .filter((candidate) => candidate.options.length > 1 && candidate.options.length <= 10)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      if (left.options.length !== right.options.length) {
        return left.options.length - right.options.length
      }

      return left.label.localeCompare(right.label)
    })
    .slice(0, 3)
    .map((candidate) => ({
      key: candidate.key,
      label: candidate.label,
      source: candidate.source,
      options: [...candidate.options].sort((left, right) =>
        left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" })
      ),
    }))
}

export function filterCatalogProducts(
  products: ProductView[],
  query: string,
  activeFilters: CatalogFacetState
) {
  const normalizedQuery = query.trim().toLowerCase()

  return products.filter((product) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [product.name, product.description, product.searchText, product.slug, product.sku]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)

    if (!matchesQuery) {
      return false
    }

    return Object.entries(activeFilters).every(([key, values]) => {
      if (!values.length) {
        return true
      }

      if (key.startsWith("variant:")) {
        const groupKey = key.replace("variant:", "")
        const group = product.variantGroups.find((item) => item.key === groupKey)

        if (!group) {
          return false
        }

        return group.values.some((value) => values.includes(value.valueLabel))
      }

      const specMap = specValueMap(product)
      return values.includes(specMap.get(key) ?? "")
    })
  })
}

function parseMoq(moq?: string | null): number {
  if (!moq) return Infinity
  const n = parseInt(moq.replace(/[^0-9]/g, ""), 10)
  return isNaN(n) ? Infinity : n
}

export function sortCatalogProducts(
  products: ProductView[],
  sort: SortOrder,
  locale: "th" | "en"
) {
  if (sort === "default") return products

  const next = [...products]

  if (sort === "moq-asc") {
    next.sort((a, b) => parseMoq(a.moq) - parseMoq(b.moq))
    return next
  }

  next.sort((left, right) =>
    sort === "asc"
      ? left.name.localeCompare(right.name, locale)
      : right.name.localeCompare(left.name, locale)
  )
  return next
}

export function resolveSelectedVariant(
  product: ProductView,
  selectedVariantSlug?: string
) {
  return (
    product.variants.find((variant) => variant.slug === selectedVariantSlug) ??
    product.variants.find((variant) => variant.slug === product.defaultVariantSlug) ??
    product.variants[0]
  )
}

export function resolveCatalogVariantForValue(
  variants: ProductVariantView[],
  groups: ProductVariantGroupView[],
  currentVariant: ProductVariantView,
  changedGroupKey: string,
  changedValueLabel: string
) {
  const selectedOptions = new Map(
    currentVariant.options.map((option) => [option.groupKey, option.valueLabel])
  )
  selectedOptions.set(changedGroupKey, changedValueLabel)

  const directMatch = variants.find((variant) =>
    groups.every((group) => {
      const desiredValue = selectedOptions.get(group.key)

      if (!desiredValue) {
        return true
      }

      return variant.options.some(
        (option) => option.groupKey === group.key && option.valueLabel === desiredValue
      )
    })
  )

  if (directMatch) {
    return directMatch
  }

  const compatibleVariants = variants.filter((variant) =>
    variant.options.some(
      (option) =>
        option.groupKey === changedGroupKey && option.valueLabel === changedValueLabel
    )
  )

  if (!compatibleVariants.length) {
    return currentVariant
  }

  return (
    compatibleVariants
      .map((variant) => ({
        variant,
        score: variant.options.filter(
          (option) =>
            option.groupKey !== changedGroupKey &&
            selectedOptions.get(option.groupKey) === option.valueLabel
        ).length,
      }))
      .sort((left, right) => right.score - left.score)[0]?.variant ?? currentVariant
  )
}

export function buildCategoryProductHref(
  locale: "th" | "en",
  categorySlug: string,
  productSlug: string,
  variantSlug?: string
) {
  const basePath =
    locale === "en"
      ? `/en/categories/${categorySlug}/${productSlug}`
      : `/categories/${categorySlug}/${productSlug}`

  if (!variantSlug || variantSlug === productSlug) {
    return basePath
  }

  return `${basePath}?v=${encodeURIComponent(variantSlug)}`
}
