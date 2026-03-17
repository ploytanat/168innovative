import type { FAQItemView } from "@/app/lib/types/view"

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
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
