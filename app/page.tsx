// app/page.tsx

import type { Metadata } from "next";

import { getCategories } from "./lib/api/categories";
import { getHeroSlides } from "./lib/api/hero";
import { getProducts } from "./lib/api/products";

import HeroCarousel from "./components/sections/HeroCarousel";
import CategorySection from "./components/sections/CategorySection";
import ProductMarquee from "./components/sections/ProductMarquee";

/* ================= Metadata ================= */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "168 Innovative | บรรจุภัณฑ์เครื่องสำอาง OEM",
    description:
      "ผู้เชี่ยวชาญด้านบรรจุภัณฑ์เครื่องสำอาง นำเข้าและจัดจำหน่ายโดยตรงจากโรงงาน",
  };
}

/* ================= Page ================= */

export default async function HomePage() {
  const locale = "th";

  const [heroSlides, products, categories] =
    await Promise.all([
      getHeroSlides(locale),
      getProducts(locale),
      getCategories(locale),
    ]);

  return (
    <main>

      {/* HERO */}
      {heroSlides.length > 0 && (
        <HeroCarousel hero={{ slides: heroSlides }} />
      )}

      {/* FEATURED PRODUCTS */}
      {products.length > 0 && (
        <ProductMarquee
          items={products}
          locale={locale}
        />
      )}

      {/* CATEGORY GRID */}
      {categories.length > 0 && (
        <CategorySection
          items={categories}
          locale={locale}
        />
      )}

    </main>
  );
}
