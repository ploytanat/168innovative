import type { Metadata } from "next"

import CategorySection from "./components/sections/CategorySection"
import ContactSection from "./components/sections/ContactSection"
import HeroCarousel from "./components/sections/HeroCarousel"
import ProductMarquee from "./components/sections/ProductMarquee"
import WhyChooseUs from "./components/sections/WhyChooseUs"
import { buildMetadata } from "./config/seo"
import { getHomeSections } from "./lib/api/home"

export const metadata: Metadata = buildMetadata({
  locale: "th",
  title: "168 Innovative Co., Ltd.",
  description:
    "ผู้นำเข้าและจัดจำหน่ายบรรจุภัณฑ์เครื่องสำอาง ขวดปั๊ม กระปุกครีม ขวดสเปรย์ และผลิตภัณฑ์พลาสติกสำหรับแบรนด์ที่ต้องการงานคุณภาพ",
  path: "/",
  keywords: [
    "บรรจุภัณฑ์เครื่องสำอาง",
    "ขวดปั๊ม",
    "กระปุกครีม",
    "ขวดสเปรย์",
  ],
})

export default async function HomePage() {
  const locale = "th"

  const { heroSlides, products, categories, whys, company } =
    await getHomeSections(locale)

  return (
    <>
      <h1 className="sr-only">
        168 Innovative บรรจุภัณฑ์เครื่องสำอางและพลาสติกสำหรับงาน OEM และ ODM
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
