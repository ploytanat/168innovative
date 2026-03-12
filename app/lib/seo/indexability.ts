import type { CategoryView, ProductView } from "@/app/lib/types/view"

function stripHtml(value?: string) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function textLength(value?: string) {
  return stripHtml(value).length
}

export function hasDistinctText(
  candidate?: string,
  baseline?: string | Array<string | undefined>
) {
  const normalizedCandidate = stripHtml(candidate)

  if (!normalizedCandidate) {
    return false
  }

  const comparisons = (Array.isArray(baseline) ? baseline : [baseline])
    .map((value) => stripHtml(value))
    .filter(Boolean)

  if (!comparisons.length) {
    return true
  }

  return comparisons.every((value) => value !== normalizedCandidate)
}

export function shouldIndexCategory(
  _category: Pick<CategoryView, "description" | "introHtml" | "faqItems">,
  currentPage: number
) {
  if (currentPage > 1) {
    return false
  }

  return true
}

export function shouldIndexProduct(
  product: Pick<
    ProductView,
    "description" | "contentHtml" | "applicationHtml" | "faqItems" | "specs"
  >
) {
  return (
    textLength(product.description) > 0 ||
    textLength(product.contentHtml) > 0 ||
    textLength(product.applicationHtml) > 0 ||
    product.specs.length > 0 ||
    product.faqItems.length > 0
  )
}
