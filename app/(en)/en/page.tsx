import type { Metadata } from "next"

import HeroCarousel from "@/app/components/sections/HeroCarousel"
import CategorySection from "@/app/components/sections/CategorySection"
import ProductMarquee from "@/app/components/sections/ProductMarquee"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import ClientsSection from "@/app/components/sections/ClientsSection"
import ContactSection from "@/app/components/sections/ContactSection"
import { buildMetadata } from "@/app/config/seo"
import { getSideBanners } from "@/app/config/sideBanners"
import { getHomeSections } from "@/app/lib/api/home"

export const metadata: Metadata = buildMetadata({
  locale: "en",
  title: "Premium Cosmetic Packaging & OEM Solutions",
  description:
    "Cosmetic packaging supplier for bottles, jars, sprayers, and plastic components with OEM and ODM support for production-ready brands.",
  path: "/",
  keywords: [
    "cosmetic packaging supplier",
    "OEM packaging",
    "ODM packaging",
    "plastic packaging manufacturer",
  ],
})

export default async function HomePage() {
  const locale = "en"

  const { heroSlides, products, categories, whys, company } =
    await getHomeSections(locale)

  return (
    <>
      <h1 className="sr-only">
        168 Innovative cosmetic packaging and OEM packaging solutions
      </h1>

      {/* 1. Hero — brand intro & main visuals */}
      {heroSlides.length > 0 && <HeroCarousel hero={{ slides: heroSlides }} locale={locale} sideBanners={getSideBanners(locale)} />}

      {/* 3. Category Section — editorial showcase of main categories */}
      {categories.length > 0 && <CategorySection items={categories} locale={locale} />}

      {/* 4. Product Marquee — featured products with quote CTA */}
      {products.length > 0 && <ProductMarquee items={products} locale={locale} />}

      {/* 5. Why Choose Us — credibility & trust signals */}
      {whys.length > 0 && <WhyChooseUs items={whys} locale={locale} />}

      {/* 6. Clients — partner brands marquee */}
      <ClientsSection locale={locale} />

      {/* 7. Contact / CTA — final conversion */}
      {company && <ContactSection locale={locale} data={company} />}
    </>
  )
}
