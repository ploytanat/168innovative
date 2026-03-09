import type { Metadata } from "next"

import CategorySection from "./components/sections/CategorySection"
import ContactSection from "./components/sections/ContactSection"
import HeroCarousel from "./components/sections/HeroCarousel"
import ProductMarquee from "./components/sections/ProductMarquee"
import WhyChooseUs from "./components/sections/WhyChooseUs"
import { getCategories } from "./lib/api/categories"
import { getCompany } from "./lib/api/company"
import { getHeroSlides } from "./lib/api/hero"
import { getProducts } from "./lib/api/products"
import { getWhy } from "./lib/api/why"

export const metadata: Metadata = {
  title: "168 Innovative Co., Ltd.",
  description:
    "168 Innovative imports and distributes cosmetic packaging and plastic products.",
}

export default async function HomePage() {
  const locale = "th"

  const [heroSlides, products, categories, whys, company] = await Promise.all([
    getHeroSlides(locale),
    getProducts(locale),
    getCategories(locale),
    getWhy(locale),
    getCompany(locale),
  ])

  return (
    <main>
      {heroSlides.length > 0 && <HeroCarousel hero={{ slides: heroSlides }} />}
      {products.length > 0 && <ProductMarquee items={products} locale={locale} />}
      {categories.length > 0 && (
        <CategorySection items={categories} locale={locale} />
      )}
      {whys.length > 0 && <WhyChooseUs items={whys} locale={locale} />}
      {company && <ContactSection locale={locale} data={company} />}
    </main>
  )
}
