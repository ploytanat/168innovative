import type { Locale, WPFaqItem } from "../types/content"
import type { FAQItemView } from "../types/view"

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

export function normalizeRichText(value: unknown) {
  const text = normalizeText(value)
  if (!text) return undefined

  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text
  }

  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("")
}

export function pickLocalizedText(
  locale: Locale,
  thValue: unknown,
  enValue: unknown,
  fallback?: unknown
) {
  const primary = locale === "th" ? normalizeText(thValue) : normalizeText(enValue)
  const secondary = locale === "th" ? normalizeText(enValue) : normalizeText(thValue)
  const fallbackValue = normalizeText(fallback)

  return primary ?? secondary ?? fallbackValue ?? ""
}

export function mapFaqItems(rawItems: unknown, locale: Locale): FAQItemView[] {
  if (!Array.isArray(rawItems)) return []

  return rawItems
    .map((item) => item as WPFaqItem)
    .map((item) => {
      const question = pickLocalizedText(
        locale,
        item.question_th,
        item.question_en
      )
      const answer = normalizeRichText(
        locale === "th" ? item.answer_th ?? item.answer_en : item.answer_en ?? item.answer_th
      )

      if (!question || !answer) return null

      return { question, answer }
    })
    .filter((item): item is FAQItemView => item !== null)
}
