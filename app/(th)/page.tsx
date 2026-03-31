import type { Metadata } from "next"

import CategorySection from "@/app/components/sections/CategorySection"
import ContactSection from "@/app/components/sections/ContactSection"
import HeroCarousel from "@/app/components/sections/HeroCarousel"
import HomeProcess from "@/app/components/sections/HomeProcess"
import HomeReviews from "@/app/components/sections/HomeReviews"
import HomeTicker from "@/app/components/sections/HomeTicker"
import ProductMarquee from "@/app/components/sections/ProductMarquee"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import { buildMetadata } from "@/app/config/seo"
import { getHomeSections } from "@/app/lib/api/home"

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
      <HomeTicker locale={locale} />
      {whys.length > 0 && <WhyChooseUs items={whys} locale={locale} />}
      {categories.length > 0 && (
        <CategorySection items={categories} locale={locale} />
      )}
      {products.length > 0 && <ProductMarquee items={products} locale={locale} />}
      <HomeProcess locale={locale} />
      <HomeReviews locale={locale} />
      {company && <ContactSection locale={locale} data={company} />}
    </>
  )
}
