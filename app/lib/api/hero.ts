// lib/api/hero.ts

import { Locale } from "../types/content";

const BASE = process.env.WP_API_URL;

export async function getHeroSlides(locale: Locale) {
  const res = await fetch(
    `${BASE}/wp-json/wp/v2/hero_slide?_embed`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch hero slides");
  }

  const data = await res.json();

  return data.map((wp: any) => ({
    id: wp.id,

    title:
      locale === "th"
        ? wp.acf?.title_th
        : wp.acf?.title_en,

    subtitle:
      locale === "th"
        ? wp.acf?.subtitle_th
        : wp.acf?.subtitle_en,

    description:
      locale === "th"
        ? wp.acf?.description_th
        : wp.acf?.description_en,

    image: {
      src:
        wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
      alt:
        wp._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? "",
    },

    ctaPrimary: {
      href: wp.acf?.cta_primary_link ?? "/",
      label:
        locale === "th"
          ? wp.acf?.cta_primary_text_th
          : wp.acf?.cta_primary_text_en,
    },

    ctaSecondary: {
      href: wp.acf?.cta_secondary_link ?? "/",
      label:
        locale === "th"
          ? wp.acf?.cta_secondary_text_th
          : wp.acf?.cta_secondary_text_en,
    },
  }));
}
