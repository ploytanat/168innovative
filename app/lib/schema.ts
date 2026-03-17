import { COMPANY_NAME, SITE_NAME, SITE_URL, withLocalePath, withSiteUrl } from "@/app/config/site"
import type { Locale } from "@/app/lib/types/content"
import type { FAQItemView, ProductView } from "@/app/lib/types/view"

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

type BuildProductJsonLdInput = {
  locale: Locale
  product: ProductView
  categoryName: string
  productUrl: string
  faqPageId?: string
  relatedProducts?: Array<{
    name: string
    url: string
  }>
}

export function buildProductJsonLd({
  locale,
  product,
  categoryName,
  productUrl,
  faqPageId,
  relatedProducts,
}: BuildProductJsonLdInput) {
  const additionalProperty = product.specs
    .filter((spec) => spec.label.trim() && spec.value.trim())
    .map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    }))
  const inquiryUrl = withSiteUrl(
    withLocalePath(`/contact?product=${encodeURIComponent(product.name)}`, locale)
  )
  const isRelatedTo = relatedProducts?.length
    ? relatedProducts.map((item) => ({
        "@type": "Product",
        name: item.name,
        url: withSiteUrl(item.url),
      }))
    : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    url: productUrl,
    mainEntityOfPage: productUrl,
    inLanguage: locale,
    name: product.name,
    image: [withSiteUrl(product.image.src)],
    description: stripHtml(product.description),
    sku: product.slug,
    identifier: product.slug,
    category: categoryName,
    brand: { "@type": "Brand", name: SITE_NAME, sameAs: [SITE_URL] },
    manufacturer: { "@type": "Organization", name: COMPANY_NAME },
    potentialAction: {
      "@type": "CommunicateAction",
      target: inquiryUrl,
    },
    ...(faqPageId
      ? {
          subjectOf: {
            "@type": "FAQPage",
            "@id": faqPageId,
          },
        }
      : {}),
    ...(isRelatedTo ? { isRelatedTo } : {}),
    ...(additionalProperty.length ? { additionalProperty } : {}),
  }
}

export function buildFaqJsonLd(
  items?: FAQItemView[] | null,
  options?: { pageId?: string }
) {
  if (!Array.isArray(items) || items.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(options?.pageId ? { "@id": options.pageId } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(item.answer),
      },
    })),
  }
}

type BreadcrumbListItemInput = {
  name: string
  item: string
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbListItemInput[],
  options?: { id?: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(options?.id ? { "@id": options.id } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}
