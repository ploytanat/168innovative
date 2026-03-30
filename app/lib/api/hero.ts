// lib/api/hero.ts

import { pickLocalizedText } from "./acf"
import { fetchWithDevCache } from "./dev-cache"
import { getMockHeroSlides, isMockModeEnabled } from "../mock/runtime"
import { Locale, WPFeaturedMedia } from "../types/content"

const BASE = process.env.WP_API_URL

if (!BASE) {
  throw new Error("WP_API_URL is not defined")
}

interface HeroSlideAcf {
  title_th?: string
  title_en?: string
  subtitle_th?: string
  subtitle_en?: string
  description_th?: string
  description_en?: string
  cta_primary_link?: string
  cta_primary_text_th?: string
  cta_primary_text_en?: string
  cta_secondary_link?: string
  cta_secondary_text_th?: string
  cta_secondary_text_en?: string
}

type WPHeroSlide = {
  id: number
  acf?: HeroSlideAcf
  _embedded?: {
    ["wp:featuredmedia"]?: WPFeaturedMedia[]
  }
}

export async function getHeroSlides(locale: Locale) {
  if (isMockModeEnabled()) {
    return getMockHeroSlides(locale)
  }

  const res = await fetchWithDevCache(
    `${BASE}/wp-json/wp/v2/hero_slide?_embed`,
    { next: { revalidate: 60 } },
    60
  )

  if (!res.ok) {
    throw new Error("Failed to fetch hero slides")
  }

  const data = (await res.json()) as WPHeroSlide[]

  return data.map((wp) => {
    const acf = wp.acf ?? {}

    return {
      id: wp.id,

      title: pickLocalizedText(locale, acf.title_th, acf.title_en),

      subtitle: pickLocalizedText(locale, acf.subtitle_th, acf.subtitle_en),

      description: pickLocalizedText(
        locale,
        acf.description_th,
        acf.description_en
      ),

      image: {
        src:
          wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
        alt:
          wp._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? "",
      },

      ctaPrimary: {
        href: acf.cta_primary_link ?? "/",
        label: pickLocalizedText(
          locale,
          acf.cta_primary_text_th,
          acf.cta_primary_text_en
        ),
      },

      ctaSecondary: {
        href: acf.cta_secondary_link ?? "/",
        label: pickLocalizedText(
          locale,
          acf.cta_secondary_text_th,
          acf.cta_secondary_text_en
        ),
      },
    }
  })
}
