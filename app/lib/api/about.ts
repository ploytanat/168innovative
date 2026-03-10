// lib/api/about.ts

import { Locale, WPMediaItem } from "../types/content"
import { pickLocalizedText } from "./acf"
import { AboutView } from "../types/view"

const BASE = process.env.WP_API_URL!

interface AboutAcf {
  hero_title_th?: string
  hero_title_en?: string
  hero_description_th?: string
  hero_description_en?: string
  hero_image_1?: number
  hero_image_1_alt_th?: string
  hero_image_1_alt_en?: string
  hero_image_2?: number
  hero_image_2_alt_th?: string
  hero_image_2_alt_en?: string
  who_title_th?: string
  who_title_en?: string
  who_description_th?: string
  who_description_en?: string
  who_image?: number
  who_image_alt_th?: string
  who_image_alt_en?: string
  seo_title_th?: string
  seo_title_en?: string
  seo_description_th?: string
  seo_description_en?: string
}

type WPAboutEntry = {
  acf?: AboutAcf
}

/* =====================================================
   Fetch Media Map
   ===================================================== */

async function getMediaMap(ids: number[]) {
  const uniqueIds = Array.from(new Set(ids)).filter(
    (id): id is number => typeof id === "number" && id > 0
  )

  if (!uniqueIds.length) return {}

  try {
    const res = await fetch(
      `${BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`,
      {
        next: { revalidate: 3600 },
      }
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

/* =====================================================
   Get About Content
   ===================================================== */

export async function getAbout(
  locale: Locale
): Promise<Omit<AboutView, "why"> | null> {
  try {
    const res = await fetch(`${BASE}/wp-json/wp/v2/about?per_page=1`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    const data = (await res.json()) as WPAboutEntry[]

    if (!data?.length) return null

    const acf: AboutAcf = data[0].acf ?? {}

    /* ===============================
       Collect Image IDs
    =============================== */

    const imageIds = [
      acf.hero_image_1,
      acf.hero_image_2,
      acf.who_image,
    ].filter((id): id is number => typeof id === "number" && id > 0)

    const mediaMap = await getMediaMap(imageIds)

    const getUrl = (id?: number) => (id ? mediaMap[id] : undefined)

    /* ===============================
       Hero Section
    =============================== */

    const hero = {
      title: pickLocalizedText(locale, acf.hero_title_th, acf.hero_title_en),

      description: pickLocalizedText(
        locale,
        acf.hero_description_th,
        acf.hero_description_en
      ),

      image1:
        acf.hero_image_1 && getUrl(acf.hero_image_1)
          ? {
              src: getUrl(acf.hero_image_1)!,
              alt:
                locale === "th"
                  ? acf.hero_image_1_alt_th || ""
                  : acf.hero_image_1_alt_en || "",
            }
          : undefined,

      image2:
        acf.hero_image_2 && getUrl(acf.hero_image_2)
          ? {
              src: getUrl(acf.hero_image_2)!,
              alt:
                locale === "th"
                  ? acf.hero_image_2_alt_th || ""
                  : acf.hero_image_2_alt_en || "",
            }
          : undefined,
    }

    /* ===============================
       Who We Are Section
    =============================== */

    const whoAreWe = {
      title: pickLocalizedText(locale, acf.who_title_th, acf.who_title_en),

      description: pickLocalizedText(
        locale,
        acf.who_description_th,
        acf.who_description_en
      ),

      image:
        acf.who_image && getUrl(acf.who_image)
          ? {
              src: getUrl(acf.who_image)!,
              alt:
                locale === "th"
                  ? acf.who_image_alt_th || ""
                  : acf.who_image_alt_en || "",
            }
          : undefined,
    }

    /* ===============================
       SEO Fields (ACF)
    =============================== */

    const seoTitle =
      locale === "th"
        ? acf.seo_title_th
        : acf.seo_title_en || acf.seo_title_th

    const seoDescription =
      locale === "th"
        ? acf.seo_description_th
        : acf.seo_description_en || acf.seo_description_th

    /* ===============================
       Return View Model
    =============================== */

    return {
      hero,
      whoAreWe,

      seoTitle,
      seoDescription,
    }
  } catch (error) {
    console.error("About API error:", error)
    return null
  }
}
