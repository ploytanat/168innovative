// lib/api/about.ts
import { Locale } from '../types/content'
import { AboutView } from '../types/view'

const BASE = process.env.WP_API_URL!

async function getMediaMap(ids: number[]) {
  const uniqueIds = Array.from(new Set(ids)).filter(
    (id): id is number => typeof id === 'number' && id > 0
  )
  if (!uniqueIds.length) return {}

  try {
    const res = await fetch(
      `${BASE}/wp-json/wp/v2/media?include=${uniqueIds.join(',')}&per_page=100`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return {}
    const data = await res.json()
    const map: Record<number, string> = {}
    data.forEach((m: any) => {
      map[m.id] = m.source_url
    })
    return map
  } catch {
    return {}
  }
}

// ✅ รับ whyItems จากภายนอกแทน เพื่อไม่ให้ fetch ซ้ำกับ page.tsx
export async function getAbout(locale: Locale): Promise<Omit<AboutView, 'why'> | null> {
  // ✅ cache 1 ชั่วโมง แทน no-store
  const res = await fetch(
    `${BASE}/wp-json/wp/v2/about?per_page=1`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) return null
  const data = await res.json()
  if (!data[0]) return null

  const acf = data[0].acf

  const imageIds = [
    acf.hero_image_1,
    acf.hero_image_2,
    acf.who_image,
  ].filter((id): id is number => typeof id === 'number' && id > 0)

  const mediaMap = await getMediaMap(imageIds)
  const getUrl = (id: number) => mediaMap[id]

  return {
    hero: {
      title: locale === 'th' ? acf.hero_title_th : acf.hero_title_en || acf.hero_title_th,
      description: locale === 'th' ? acf.hero_description_th : acf.hero_description_en || acf.hero_description_th,
      image1: acf.hero_image_1 && getUrl(acf.hero_image_1)
        ? {
            src: getUrl(acf.hero_image_1)!,
            alt: locale === 'th' ? acf.hero_image_1_alt_th || '' : acf.hero_image_1_alt_en || '',
          }
        : undefined,
      image2: acf.hero_image_2 && getUrl(acf.hero_image_2)
        ? {
            src: getUrl(acf.hero_image_2)!,
            alt: locale === 'th' ? acf.hero_image_2_alt_th || '' : acf.hero_image_2_alt_en || '',
          }
        : undefined,
    },
    whoAreWe: {
      title: locale === 'th' ? acf.who_title_th : acf.who_title_en || acf.who_title_th,
      description: locale === 'th' ? acf.who_description_th : acf.who_description_en || acf.who_description_th,
      image: acf.who_image && getUrl(acf.who_image)
        ? {
            src: getUrl(acf.who_image)!,
            alt: locale === 'th' ? acf.who_image_alt_th || '' : acf.who_image_alt_en || '',
          }
        : undefined,
    },
  }
}