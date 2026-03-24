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

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
}

function hasHtmlMarkup(value: string) {
  return /<[a-z][\s\S]*>/i.test(value)
}

function hasEncodedHtmlMarkup(value: string) {
  return /&lt;\/?[a-z][\w:-]*[\s\S]*?&gt;/i.test(value)
}

function normalizeRichTextSource(value: unknown) {
  const text = normalizeText(value)
  if (!text) return undefined

  return hasEncodedHtmlMarkup(text) ? decodeHtmlEntities(text) : text
}

function stripHtml(value: string) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|blockquote|tr)>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim()
}

function normalizePlainText(value: unknown) {
  if (typeof value !== "string") return undefined

  const text = stripHtml(value)
  return text || undefined
}

export function normalizeRichText(value: unknown) {
  const text = normalizeRichTextSource(value)
  if (!text) return undefined

  if (hasHtmlMarkup(text)) {
    return text
  }

  return decodeHtmlEntities(text)
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

function pickLocalizedField(
  locale: Locale,
  item: Record<string, unknown>,
  thKeys: string[],
  enKeys: string[],
  fallbackKeys: string[] = []
) {
  const primaryKeys = locale === "th" ? thKeys : enKeys
  const secondaryKeys = locale === "th" ? enKeys : thKeys

  for (const key of [...primaryKeys, ...secondaryKeys, ...fallbackKeys]) {
    const value = normalizeText(item[key])
    if (value) return value
  }

  return undefined
}

function normalizeComparableText(value?: string) {
  return stripHtml(value ?? "").toLowerCase()
}

function extractFaqItemFromHtmlFragment(fragment: string): FAQItemView | null {
  const html = normalizeRichTextSource(fragment)
  if (!html) return null

  const headingMatch = html.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i)
  if (!headingMatch) return null

  const question = normalizePlainText(headingMatch[1])
  const answer = normalizeRichText(html.replace(headingMatch[0], "").trim())

  if (!question || !answer) return null

  return { question, answer }
}

function extractFaqItemsFromHtml(html: string) {
  const normalizedHtml = normalizeRichTextSource(html)
  if (!normalizedHtml) return []

  const blockMatches = Array.from(
    normalizedHtml.matchAll(
      /<div\b[^>]*class=(["'])[^"']*\bfaq-item\b[^"']*\1[^>]*>([\s\S]*?)<\/div>/gi
    )
  )

  if (blockMatches.length > 0) {
    return blockMatches
      .map((match) => extractFaqItemFromHtmlFragment(match[2]))
      .filter((item): item is FAQItemView => item !== null)
  }

  const singleItem = extractFaqItemFromHtmlFragment(normalizedHtml)
  return singleItem ? [singleItem] : []
}

function mapFaqItem(rawItem: unknown, locale: Locale): FAQItemView[] {
  if (typeof rawItem === "string") {
    return extractFaqItemsFromHtml(rawItem)
  }

  if (!rawItem || typeof rawItem !== "object") {
    return []
  }

  const item = rawItem as WPFaqItem & Record<string, unknown>
  const question = pickLocalizedField(
    locale,
    item,
    ["question_th", "title_th", "heading_th"],
    ["question_en", "title_en", "heading_en"],
    ["question", "title", "heading"]
  )
  const answerSource = pickLocalizedField(
    locale,
    item,
    ["answer_th", "content_th", "html_th", "body_th"],
    ["answer_en", "content_en", "html_en", "body_en"],
    ["answer", "content", "html", "body"]
  )

  if (!answerSource) {
    return []
  }

  const parsedFromHtml = extractFaqItemsFromHtml(answerSource)
  if (parsedFromHtml.length > 1) {
    return parsedFromHtml
  }

  if (parsedFromHtml.length === 1) {
    const parsedItem = parsedFromHtml[0]

    if (!question) {
      return [parsedItem]
    }

    if (
      normalizeComparableText(parsedItem.question) ===
      normalizeComparableText(question)
    ) {
      return [{ question: normalizePlainText(question) ?? parsedItem.question, answer: parsedItem.answer }]
    }
  }

  const normalizedQuestion = normalizePlainText(question)
  const normalizedAnswer = normalizeRichText(answerSource)

  if (!normalizedQuestion || !normalizedAnswer) {
    return []
  }

  return [{ question: normalizedQuestion, answer: normalizedAnswer }]
}

export function mapFaqItems(rawItems: unknown, locale: Locale): FAQItemView[] {
  const items = Array.isArray(rawItems) ? rawItems : [rawItems]

  return items.flatMap((item) => mapFaqItem(item, locale))
}
