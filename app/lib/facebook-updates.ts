export type FacebookUpdate = {
  id: number
  title: string
  excerpt: string
  url: string
  image: string
  imageAlt: string
}

type WPUpdate = {
  id?: number
  title?: { rendered?: string }
  excerpt?: { rendered?: string }
  content?: { rendered?: string }
  _embedded?: { "wp:featuredmedia"?: Array<{
    source_url?: string
    alt_text?: string
    media_details?: { sizes?: Record<string, { source_url?: string }> }
  }> }
}

export function facebookUrl(value: unknown): string | null {
  if (typeof value !== "string") return null
  try {
    const url = new URL(value.trim().replace(/&amp;|&#0*38;|&#x0*26;/gi, "&"))
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null
    if (!["facebook.com", "www.facebook.com", "m.facebook.com", "web.facebook.com", "fb.watch"].includes(url.hostname)) return null
    // Login, redirect and sharing endpoints are not source posts or page links.
    if (/^\/(?:login|dialog|sharer|share\.php|l\.php|plugins|tr)(?:[/.]|$)/i.test(url.pathname)) return null
    return url.href
  } catch { return null }
}

function plainText(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|amp|quot|apos|lt|gt);|&#(?:x[\da-f]+|\d+);/gi, entity => {
      const named: Record<string, string> = { "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" }
      if (named[entity.toLowerCase()]) return named[entity.toLowerCase()]
      const hex = entity.slice(2, 3).toLowerCase() === "x"
      const code = parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ""
    }).replace(/\s+/g, " ").trim()
}

export function mapFacebookUpdates(input: unknown, wordpressUrl: string): FacebookUpdate[] {
  if (!Array.isArray(input)) return []
  const origin = new URL(wordpressUrl).origin
  const seen = new Set<string>()
  const results: FacebookUpdate[] = []
  for (const value of input) {
    if (!value || typeof value !== "object") continue
    const post = value as WPUpdate
    const content = typeof post.content?.rendered === "string" ? post.content.rendered : ""
    const candidates = content.match(/https:\/\/[^\s<>"']+/gi) ?? []
    const url = candidates.map(facebookUrl).find(Boolean)
    const title = plainText(post.title?.rendered)
    const media = post._embedded?.["wp:featuredmedia"]?.[0]
    const source = media?.media_details?.sizes?.medium_large?.source_url || media?.source_url
    if (!url || !title || !source || !Number.isInteger(post.id) || seen.has(url)) continue
    try {
      const image = new URL(source)
      if (image.protocol !== "https:" || image.origin !== origin || image.username || image.password) continue
      results.push({ id: post.id!, title, excerpt: plainText(post.excerpt?.rendered).slice(0, 220), url, image: image.href, imageAlt: plainText(media?.alt_text) || title })
      seen.add(url)
      if (results.length === 3) break
    } catch { /* Ignore incomplete or unsafe entries without breaking the homepage. */ }
  }
  return results
}
