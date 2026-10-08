export type SavedProduct = { key: string; slug: string; categorySlug: string; name: string; image: string; specs: { label: string; value: string }[] }
export const MAX_SAVED = 20
export const MAX_COMPARE = 3
export function productKey(product: { categorySlug: string; slug: string }) { return `${product.categorySlug}/${product.slug}` }
export function parseSaved(raw: string | null): SavedProduct[] {
  try {
    const data: unknown = JSON.parse(raw || "[]")
    if (!Array.isArray(data)) return []
    const seen = new Set<string>()
    return data.filter((p): p is SavedProduct => {
      if (!p || typeof p !== "object" || typeof p.slug !== "string" || typeof p.categorySlug !== "string" || typeof p.name !== "string" || typeof p.image !== "string" || !Array.isArray(p.specs)) return false
      if (!p.slug || !p.categorySlug || !p.name || p.key !== productKey(p) || seen.has(p.key)) return false
      if (!p.specs.every((s: {label?: unknown; value?: unknown}) => s && typeof s.label === "string" && typeof s.value === "string")) return false
      seen.add(p.key); return true
    }).slice(0, MAX_SAVED)
  } catch { return [] }
}
export function specRows(products: SavedProduct[]) {
  const labels = new Map<string, string>()
  products.forEach(p => p.specs.forEach(s => { if (s.label.trim()) labels.set(s.label.trim().toLowerCase(), s.label.trim()) }))
  return [...labels].map(([key, label]) => ({ label, values: products.map(p => p.specs.find(s => s.label.trim().toLowerCase() === key)?.value || "—") }))
}
