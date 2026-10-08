import { mapFacebookUpdates, type FacebookUpdate } from "../facebook-updates"

export async function getFacebookUpdates(locale: "th" | "en"): Promise<FacebookUpdate[]> {
  const base = process.env.WP_API_URL?.replace(/\/$/, "")
  if (!base) return []
  async function read(path: string): Promise<unknown> {
    const response = await fetch(`${base}/wp-json/wp/v2/${path}`, {
      next: { revalidate: 60, tags: ["facebook-updates"] },
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return null
    return await response.json()
  }
  try {
    const categories = await read(`categories?slug=facebook-updates-${locale}&_fields=id`)
    const categoryId = Array.isArray(categories) ? categories[0]?.id : undefined
    if (!Number.isInteger(categoryId) || categoryId <= 0) return []
    const posts = await read(`posts?categories=${categoryId}&status=publish&per_page=12&orderby=date&order=desc&_embed=wp:featuredmedia&_fields=id,title,excerpt,content,_links,_embedded`)
    return mapFacebookUpdates(posts, base)
  } catch {
    // A social-content outage must not prevent visitors browsing products.
    return []
  }
}
