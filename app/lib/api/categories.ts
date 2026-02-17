// lib/api/categories.ts

import { Locale } from "../types/content";
import { CategoryView } from "../types/view";

const BASE = process.env.WP_API_URL;

/* ================= Media Helper ================= */

async function getMediaUrl(id?: number): Promise<string | null> {
  if (!id) return null;

  try {
    const res = await fetch(
      `${BASE}/wp-json/wp/v2/media/${id}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.source_url ?? null;
  } catch {
    return null;
  }
}

/* ================= All Categories ================= */

export async function getCategories(
  locale: Locale
): Promise<CategoryView[]> {
  const res = await fetch(
    `${BASE}/wp-json/wp/v2/product_category?per_page=100`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  return Promise.all(
    data.map(async (wp: any) => {
      const imageUrl = await getMediaUrl(wp.acf?.image);

      return mapCategory(wp, locale, imageUrl);
    })
  );
}

/* ================= Single Category ================= */

export async function getCategoryBySlug(
  slug: string,
  locale: Locale
): Promise<CategoryView | null> {
  const res = await fetch(
    `${BASE}/wp-json/wp/v2/product_category?slug=${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;

  const data = await res.json();

  if (!data.length) return null;

  const wp = data[0];
  const imageUrl = await getMediaUrl(wp.acf?.image);

  return mapCategory(wp, locale, imageUrl);
}

/* ================= Mapper ================= */

function mapCategory(
  wp: any,
  locale: Locale,
  imageUrl?: string | null
): CategoryView {
  return {
    id: String(wp.id),

    slug: wp.slug,

    name:
      locale === "th"
        ? wp.name
        : wp.acf?.name_en ?? wp.name,

    description:
      locale === "th"
        ? wp.acf?.description_th ?? ""
        : wp.acf?.description_en ?? "",

    image: imageUrl
      ? {
          src: imageUrl,
          alt: wp.name,
        }
      : undefined,

    seoTitle:
      locale === "th"
        ? wp.acf?.seo_title_th ?? wp.name
        : wp.acf?.seo_title_en ?? wp.name,

    seoDescription:
      locale === "th"
        ? wp.acf?.seo_description_th ?? ""
        : wp.acf?.seo_description_en ?? "",
  };
}
