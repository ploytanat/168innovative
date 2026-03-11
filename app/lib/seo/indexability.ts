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
  category: Pick<CategoryView, "description" | "introHtml" | "faqItems">,
  currentPage: number
) {
  if (currentPage > 1) {
    return false
  }

  return (
    textLength(category.description) >= 80 ||
    textLength(category.introHtml) >= 140 ||
    category.faqItems.length > 0
  )
}

export function shouldIndexProduct(
  product: Pick<
    ProductView,
    "description" | "contentHtml" | "applicationHtml" | "faqItems" | "specs"
  >
) {
  const descriptionScore = textLength(product.description)
  const distinctContentScore = hasDistinctText(
    product.contentHtml,
    product.description
  )
    ? textLength(product.contentHtml)
    : 0
  const distinctApplicationScore = hasDistinctText(product.applicationHtml, [
    product.description,
    product.contentHtml,
  ])
    ? textLength(product.applicationHtml)
    : 0

  return (
    descriptionScore >= 90 &&
    (
      product.specs.length >= 3 ||
      product.faqItems.length > 0 ||
      distinctContentScore >= 120 ||
      distinctApplicationScore >= 80
    )
  )
}
