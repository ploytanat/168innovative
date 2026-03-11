import type { Metadata } from "next"

import CategorySection from "@/app/components/sections/CategorySection"
import ContactSection from "@/app/components/sections/ContactSection"
import HeroCarousel from "@/app/components/sections/HeroCarousel"
import ProductMarquee from "@/app/components/sections/ProductMarquee"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
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
      {heroSlides.length > 0 && <HeroCarousel hero={{ slides: heroSlides }} />}
      {products.length > 0 && <ProductMarquee items={products} locale={locale} />}
      {categories.length > 0 && (
        <CategorySection items={categories} locale={locale} />
      )}
      {whys.length > 0 && <WhyChooseUs items={whys} locale={locale} />}
      {company && <ContactSection locale={locale} data={company} />}
    </>
  )
}
