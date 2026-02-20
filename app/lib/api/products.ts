// app/lib/api/products.ts

import { Locale, WPProduct } from "../types/content";
import { ProductView } from "../types/view";
import { ProductSpecView } from "../types/view";
const BASE = process.env.WP_API_URL;

/* ================= Helper ================= */


async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) throw new Error("Fetch failed");

  return res.json() as Promise<T>;
}

/* ================= All Products (Home) ================= */

export async function getProducts(
  locale: Locale
): Promise<ProductView[]> {

  const raw = await fetchJSON<WPProduct[]>(
    `${BASE}/wp-json/wp/v2/products?_embed=wp:featuredmedia,wp:term&per_page=100`
  );

  const mapped = raw.map((wp) =>
    mapWPToProductView(wp, locale)
  );

  // 🔥 สุ่ม
  const shuffled = mapped.sort(
    () => 0.5 - Math.random()
  );

  return shuffled.slice(0, 8);
}


function mapWPToProductView(
  wp: WPProduct,
  locale: Locale
): ProductView {

  const featured =
    wp._embedded?.["wp:featuredmedia"]?.[0];

  const term =
    wp._embedded?.["wp:term"]?.[0]?.[0];

  /* ================= Parse specs_json ================= */

  let specs: ProductSpecView[] = [];

  const rawSpecs = wp.acf?.specs_json;

  if (rawSpecs && rawSpecs.trim() !== "") {
    try {
      const parsed = JSON.parse(rawSpecs);

      if (Array.isArray(parsed)) {
        specs = parsed.map((s) => ({
          label: s.label ?? "",
          value: s.value ?? "",
        }));
      }
    } catch {
      specs = [];
    }
  }

  /* ================= Return ================= */

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
      src: featured?.source_url ?? "",
      alt:
        locale === "th"
          ? wp.acf?.image_alt_th ?? ""
          : wp.acf?.image_alt_en ?? "",
    },

    categoryId:
      term?.id?.toString() ??
      wp.product_category?.[0]?.toString() ??
      "",

    categorySlug:
      term?.slug ?? "",

    specs,

    price: undefined,
  };
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
    `${BASE}/wp-json/wp/v2/products?product_category=${categoryId}&_embed=wp:featuredmedia,wp:term`
  );

  return raw.map((wp) =>
    mapWPToProductView(wp, locale)
  );
}

/* ================= Single Product ================= */

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<ProductView | null> {

  const raw = await fetchJSON<WPProduct[]>(
    `${BASE}/wp-json/wp/v2/products?slug=${slug}&_embed=wp:featuredmedia,wp:term`
  );

  if (!raw.length) return null;

  return mapWPToProductView(raw[0], locale);
}

/* ================= Related Products ================= */

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

  const shuffled = filtered.sort(
    () => 0.5 - Math.random()
  );

  return shuffled.slice(0, 4);
}
