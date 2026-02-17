import { Product, WPProduct } from "../types/content";

export function mapWPProductToProduct(wp: WPProduct): Product {
  const category =
    wp._embedded?.["wp:term"]?.[0]?.find(
      (t: any) => t.taxonomy === "product_category"
    );

  return {
    id: wp.id.toString(),
    slug: wp.slug,
    categoryId: category?.slug ?? "",
    name: {
      th: wp.acf?.name_th ?? "",
      en: wp.acf?.name_en ?? "",
    },
    description: {
      th: wp.acf?.description_th ?? "",
      en: wp.acf?.description_en ?? "",
    },
    image: {
      src:
        wp._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
      alt: {
        th: wp.acf?.image_alt_th ?? "",
        en: wp.acf?.image_alt_en ?? "",
      },
    },
  };
}
