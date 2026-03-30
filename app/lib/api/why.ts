// lib/api/why.ts
import { Locale, WPMediaItem } from "../types/content"
import { pickLocalizedText } from "./acf"
import { fetchWithDevCache } from "./dev-cache"
import { getMockWhy, isMockModeEnabled } from "../mock/runtime"
import { WhyItemView } from "../types/view"

const BASE = process.env.WP_API_URL!

interface WhyAcf {
  order?: number
  image?: number
  title_th?: string
  title_en?: string
  description_th?: string
  description_en?: string
}

type WPWhyEntry = {
  acf?: WhyAcf
}

// Fetch media URLs for multiple WordPress media IDs in one request.
async function getMediaMap(ids: number[]) {
  const uniqueIds = Array.from(new Set(ids)).filter(
    (id): id is number => typeof id === "number" && id > 0
  )

  if (!uniqueIds.length) return {}

  try {
    const res = await fetchWithDevCache(
      `${BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`,
      { next: { revalidate: 3600 } },
      3600
    )

    if (!res.ok) return {}

    const data = (await res.json()) as WPMediaItem[]
    const map: Record<number, string> = {}

    data.forEach((media) => {
      map[media.id] = media.source_url ?? media.guid?.rendered ?? ""
    })

    return map
  } catch {
    return {}
  }
}

export async function getWhy(locale: Locale): Promise<WhyItemView[]> {
  if (isMockModeEnabled()) {
    return getMockWhy(locale)
  }

  try {
    const res = await fetchWithDevCache(
      `${BASE}/wp-json/wp/v2/why?per_page=20`,
      { next: { revalidate: 3600 } },
      3600
    )

    if (!res.ok) return []

    const data = (await res.json()) as WPWhyEntry[]
    const imageIds = data
      .map((wp) => wp.acf?.image)
      .filter((id): id is number => typeof id === "number")
    const mediaMap = await getMediaMap(imageIds)

    return data
      .sort((a, b) => (a.acf?.order ?? 0) - (b.acf?.order ?? 0))
      .map((wp) => {
        const acf = wp.acf
        const imageId = acf?.image
        const title =
          locale === "th" ? acf?.title_th : acf?.title_en || acf?.title_th

        return {
          title: title || "",
          description: pickLocalizedText(
            locale,
            acf?.description_th,
            acf?.description_en
          ),
          image:
            imageId && mediaMap[imageId]
              ? {
                  src: mediaMap[imageId],
                  alt: title || "",
                }
              : undefined,
        }
      })
  } catch (error) {
    console.error("Error fetching Why Choose Us:", error)
    return []
  }
}
