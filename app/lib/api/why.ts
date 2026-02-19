import { Locale } from "../types/content"

const BASE = process.env.WP_API_URL

export async function getWhy(locale: Locale) {
  const res = await fetch(
    `${BASE}/wp-json/wp/v2/why?per_page=10`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) return []

  const data = await res.json()

  return data
    .sort((a: any, b: any) =>
      (a.acf?.order ?? 0) - (b.acf?.order ?? 0)
    )
    .map((wp: any) => ({
      id: wp.id,
      image: {
        src: wp.acf?.image?.url,
        alt:
          locale === "th"
            ? wp.acf?.title_th
            : wp.acf?.title_en,
      },
      title:
        locale === "th"
          ? wp.acf?.title_th
          : wp.acf?.title_en,
      description:
        locale === "th"
          ? wp.acf?.description_th
          : wp.acf?.description_en,
    }))
}
