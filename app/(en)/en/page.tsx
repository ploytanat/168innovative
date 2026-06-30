import type { Metadata } from "next"

import CategorySection from "@/app/components/sections/CategorySection"
import CategoryStrip from "@/app/components/sections/CategoryStrip"
import ContactSection from "@/app/components/sections/ContactSection"
import FaqSection from "@/app/components/sections/FaqSection"
import HomeHero from "@/app/components/sections/HomeHero"
import IntroBand from "@/app/components/sections/IntroBand"
import PortfolioGrid from "@/app/components/sections/PortfolioGrid"
import PromoGrid from "@/app/components/sections/PromoGrid"
import { buildMetadata } from "@/app/config/seo"
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
      {heroSlides.length > 0 && <HomeHero hero={{ slides: heroSlides }} locale={locale} />}
      {categories.length > 0 && <CategoryStrip items={categories} locale={locale} />}
      <IntroBand locale={locale} />
      {categories.length > 0 && <CategorySection items={categories} locale={locale} />}
      {products.length > 0 && <PortfolioGrid items={products} locale={locale} />}
      {whys.length > 0 && <PromoGrid whys={whys} locale={locale} />}
      <FaqSection locale={locale} />
      {company && <ContactSection locale={locale} data={company} />}
    </>
  )
}
