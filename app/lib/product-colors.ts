export type ProductColorView = { id: string; name: string; hex?: string; image: string }

/** Accept ACF textarea JSON or an already decoded array. Never invent colours. */
export function parseProductColors(raw: unknown, locale: "th" | "en"): ProductColorView[] {
  try {
    const rows: unknown = typeof raw === "string" ? JSON.parse(raw) : raw
    if (!Array.isArray(rows)) return []
    const seen = new Set<string>()
    return rows.flatMap((row): ProductColorView[] => {
      if (!row || typeof row !== "object") return []
      const id = typeof row.id === "string" ? row.id.trim() : ""
      const name = [row[`name_${locale}`], row.name_th, row.name_en].find(v => typeof v === "string" && v.trim())
      const image = typeof row.image_url === "string" ? row.image_url.trim() : ""
      if (!id || seen.has(id) || !name || !image) return []
      if (!/^\/(?!\/)/.test(image)) {
        try { if (!["https:", "http:"].includes(new URL(image).protocol)) return [] } catch { return [] }
      }
      seen.add(id)
      return [{ id, name: name.trim(), image, hex: typeof row.hex === "string" && /^#[0-9a-f]{6}$/i.test(row.hex) ? row.hex : undefined }]
    })
  } catch { return [] }
}
