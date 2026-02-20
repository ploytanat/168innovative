// app/lib/api/products.ts

import { Locale, WPProduct } from "../types/content";
import { ProductView, ProductSpecView } from "../types/view";

const BASE = process.env.WP_API_URL;

if (!BASE) {
  throw new Error("WP_API_URL is not defined");
}

/* ================= Helper ================= */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${url}`);
  }

  return res.json() as Promise<T>;
}

/* ================= Category Slug Cache ================= */

let categoryMap: Record<string, string> | null = null;

async function getCategoryMap() {
  if (categoryMap) return categoryMap;

  const terms = await fetchJSON<any[]>(
    `${BASE}/wp-json/wp/v2/product_category?per_page=100`
  );

  categoryMap = {};
  terms.forEach((term) => {
    categoryMap![term.id] = term.slug;
  });

  return categoryMap;
}

/* ================= Mapper ================= */

async function mapWPToProductView(
  wp: WPProduct,
  locale: Locale
): Promise<ProductView> {

  /* ===== Parse specs_json ===== */

  let specs: ProductSpecView[] = [];

  if (wp.acf?.specs_json) {
    try {
      const parsed = JSON.parse(wp.acf.specs_json);

      if (Array.isArray(parsed)) {
        specs = parsed.map((s) => ({
          label: s.label ?? "",
          value: s.value ?? "",
        }));
      } else if (typeof parsed === "object" && parsed !== null) {
        specs = Object.entries(parsed).map(([key, value]) => ({
          label: key,
          value: Array.isArray(value)
            ? value.join(", ")
            : String(value),
        }));
      }
    } catch {
      specs = [];
    }
  }

  /* ===== Category Slug Resolve ===== */

  const categoryId = wp.product_category?.[0]?.toString() ?? "";

  let categorySlug = "";

  if (categoryId) {
    const map = await getCategoryMap();
    categorySlug = map[Number(categoryId)] ?? "";
  }

  /* ===== Image ===== */

  const imageSrc =
    wp.featured_image_url ?? "/images/placeholder.webp";

  const imageAlt =
    locale === "th"
      ? wp.acf?.image_alt_th ?? wp.title.rendered
      : wp.acf?.image_alt_en ?? wp.title.rendered;

  return {
    id: wp.id.toString(),
    slug: wp.slug,

    name:
      locale === "th"
        ? wp.acf?.name_th ?? ""
        : wp.acf?.name_en ?? "",

    description:
      locale === "th"
        ? wp.acf?.description_th ?? ""
        : wp.acf?.description_en ?? "",

    image: {
      src: imageSrc,
      alt: imageAlt,
    },

    categoryId,
    categorySlug,

    specs,
    price: undefined,
  };
}

/* ================= All Products ================= */

export async function getProducts(
  locale: Locale
): Promise<ProductView[]> {

  const raw = await fetchJSON<WPProduct[]>(
    `${BASE}/wp-json/wp/v2/product?per_page=100`
  );

  const mapped = await Promise.all(
    raw.map((wp) => mapWPToProductView(wp, locale))
  );

  const shuffled = mapped.sort(
    () => 0.5 - Math.random()
  );

  return shuffled.slice(0, 8);
}

/* ================= Products by Category ================= */

export async function getProductsByCategory(
  slug: string,
  locale: Locale
): Promise<ProductView[]> {

  const terms = await fetchJSON<any[]>(
    `${BASE}/wp-json/wp/v2/product_category?slug=${slug}`
  );

  if (!terms.length) return [];

  const categoryId = terms[0].id;

  const raw = await fetchJSON<WPProduct[]>(
    `${BASE}/wp-json/wp/v2/product?product_category=${categoryId}`
  );

  return Promise.all(
    raw.map((wp) => mapWPToProductView(wp, locale))
  );
}

/* ================= Single Product ================= */

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<ProductView | null> {

  const raw = await fetchJSON<WPProduct[]>(
    `${BASE}/wp-json/wp/v2/product?slug=${slug}`
  );

  if (!raw.length) return null;

  return mapWPToProductView(raw[0], locale);
}

/* ================= Related ================= */

export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  locale: Locale
): Promise<ProductView[]> {

  const all = await getProductsByCategory(
    categorySlug,
    locale
  );

  const filtered = all.filter(
    (p) => p.id !== currentProductId
  );

  return filtered.slice(0, 4);
}