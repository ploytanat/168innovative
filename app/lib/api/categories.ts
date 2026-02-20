// lib/api/categories.ts

import { Locale } from "../types/content";
import { CategoryView } from "../types/view";

const BASE = process.env.WP_API_URL;

if (!BASE) {
  throw new Error("WP_API_URL is not defined");
}

/* ================= Helper ================= */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 300 }, // 5 นาที (production friendly)
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }

  return res.json();
}

/* ================= All Categories ================= */

export async function getCategories(
  locale: Locale
): Promise<CategoryView[]> {

  const data = await fetchJSON<any[]>(
    `${BASE}/wp-json/wp/v2/product_category?per_page=100`
  );

  return data.map((wp) =>
    mapCategory(wp, locale)
  );
}

/* ================= Single Category ================= */

export async function getCategoryBySlug(
  slug: string,
  locale: Locale
): Promise<CategoryView | null> {

  const data = await fetchJSON<any[]>(
    `${BASE}/wp-json/wp/v2/product_category?slug=${slug}`
  );

  if (!data.length) return null;

  return mapCategory(data[0], locale);
}

/* ================= Mapper ================= */

function mapCategory(
  wp: any,
  locale: Locale
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

    image: wp.image_url
      ? {
          src: wp.image_url,
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