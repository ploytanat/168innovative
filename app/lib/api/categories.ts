// lib/api/categories.ts

import { unstable_cache } from "next/cache";
import { mapFaqItems, normalizeRichText, pickLocalizedText } from "./acf";
import { Locale } from "../types/content";
import { CategoryView } from "../types/view";

const BASE = process.env.WP_API_URL;
const CATEGORY_FIELDS = "id,slug,name,image_url,acf";

if (!BASE) {
  throw new Error("WP_API_URL is not defined");
}

interface CategoryAcf {
  name_th?: string
  name_en?: string
  description_th?: string
  description_en?: string
  image_alt_th?: string
  image_alt_en?: string
  intro_html_th?: string
  intro_html_en?: string
  faq_items?: unknown
  seo_title_th?: string
  seo_title_en?: string
  seo_description_th?: string
  seo_description_en?: string
}

interface WPProductCategory {
  id: number
  slug: string
  name: string
  image_url?: string
  acf?: CategoryAcf
}

/* ================= Helper ================= */

async function fetchJSON<T>(
  url: string,
  fallback: T,
  label: string
): Promise<T> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${label}: ${res.status} ${url}`);
      return fallback;
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${label}:`, error);
    return fallback;
  }
}

/* ================= All Categories ================= */

export function getCategories(locale: Locale): Promise<CategoryView[]> {
  return unstable_cache(
    async () => {
      const data = await fetchJSON<WPProductCategory[]>(
        `${BASE}/wp-json/wp/v2/product_category?per_page=100&_fields=${CATEGORY_FIELDS}`,
        [],
        `categories (${locale})`
      );
      return data.map((wp) => mapCategory(wp, locale));
    },
    [`categories-${locale}-v2`],
    { revalidate: 300, tags: ["categories"] }
  )();
}

export function getAllCategorySlugs(): Promise<string[]> {
  return unstable_cache(
    async () => {
      const data = await fetchJSON<Array<{ slug?: string }>>(
        `${BASE}/wp-json/wp/v2/product_category?_fields=slug&per_page=100`,
        [],
        "category slugs"
      );
      return data
        .map((item) => item.slug)
        .filter((slug): slug is string => Boolean(slug));
    },
    ["category-slugs-v1"],
    { revalidate: 300, tags: ["categories"] }
  )();
}

/* ================= Single Category ================= */

function getCategoryRawBySlug(slug: string): Promise<WPProductCategory | null> {
  return unstable_cache(
    async () => {
      const data = await fetchJSON<WPProductCategory[]>(
        `${BASE}/wp-json/wp/v2/product_category?slug=${slug}&per_page=1&_fields=${CATEGORY_FIELDS}`,
        [],
        `category ${slug}`
      );
      return data[0] ?? null;
    },
    [`category-raw-${slug}-v1`],
    { revalidate: 300, tags: ["categories"] }
  )();
}

export async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  const category = await getCategoryRawBySlug(slug);
  return category?.id ?? null;
}

export function getCategoryBySlug(
  slug: string,
  locale: Locale
): Promise<CategoryView | null> {
  return unstable_cache(
    async () => {
      const category = await getCategoryRawBySlug(slug);
      if (!category) return null;
      return mapCategory(category, locale);
    },
    [`category-${slug}-${locale}-v2`],
    { revalidate: 300, tags: ["categories"] }
  )();
}

/* ================= Mapper ================= */

function mapCategory(wp: WPProductCategory, locale: Locale): CategoryView {
  return {
    id: String(wp.id),
    slug: wp.slug,

    name: pickLocalizedText(locale, wp.acf?.name_th, wp.acf?.name_en, wp.name),

    description: pickLocalizedText(
      locale,
      wp.acf?.description_th,
      wp.acf?.description_en
    ),

    image: wp.image_url
      ? {
          src: wp.image_url,
          alt: pickLocalizedText(
            locale,
            wp.acf?.image_alt_th,
            wp.acf?.image_alt_en,
            wp.name
          ),
        }
      : undefined,
    introHtml: normalizeRichText(
      locale === "th" ? wp.acf?.intro_html_th : wp.acf?.intro_html_en
    ),
    faqItems: mapFaqItems(wp.acf?.faq_items, locale),

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
