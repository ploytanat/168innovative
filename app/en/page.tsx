// app/page.tsx

import type { Metadata } from "next";

import { getCategories } from "../lib/api/categories";
import { getHeroSlides } from "../lib/api/hero";
import { getProducts } from "../lib/api/products";
import { getWhy } from "../lib/api/why";
import { getCompany } from "../lib/api/company";

import HeroCarousel from "../components/sections/HeroCarousel";
import CategorySection from "../components/sections/CategorySection";
import ProductMarquee from "../components/sections/ProductMarquee";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import ContactSection from "../components/sections/ContactSection";

/* ================= Metadata ================= */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "168 Innovative | Premium Cosmetic Packaging & OEM Solutions",
    description:
      "Expert cosmetic packaging manufacturer. Import and distribute directly from factory with premium quality OEM solutions.",
  };
}

/* ================= Page ================= */
export default async function HomePage() {
  const locale = "en";

  const [
    heroSlides,
    products,
    categories,
    whys,
    company
  ] = await Promise.all([
    getHeroSlides(locale),
    getProducts(locale),
    getCategories(locale),
    getWhy(locale),
    getCompany(locale)
  ]);
console.log("Company result:", company)
  return (
    <main>

      {heroSlides?.length > 0 && (
        <HeroCarousel hero={{ slides: heroSlides }} />
      )}

      {products?.length > 0 && (
        <ProductMarquee items={products} locale={locale} />
      )}

      {categories?.length > 0 && (
        <CategorySection items={categories} locale={locale} />
      )}

      {whys?.length > 0 && (
        <WhyChooseUs items={whys} locale={locale} />
      )}

      {company && (
        <ContactSection
          locale={locale}
          data={company}
        />
      )}

    </main>
  );
}
