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

      {/* 1. Hero — ดึงดูดและแนะนำแบรนด์ */}
      {heroSlides.length > 0 && <HeroCarousel hero={{ slides: heroSlides }} locale={locale} sideBanners={getSideBanners(locale)} />}


 
      {/* 3. Category Section — แสดง editorial ของหมวดหลัก */}
      {categories.length > 0 && <CategorySection items={categories} locale={locale} />}

      {/* 4. Product Marquee — สินค้าแนะนำพร้อมปุ่ม CTA */}
      {products.length > 0 && <ProductMarquee items={products} locale={locale} />}

      {/* 5. Why Choose Us — สร้างความน่าเชื่อถือ */}
      {whys.length > 0 && <WhyChooseUs items={whys} locale={locale} />}

      {/* 6. Clients — แสดงแบรนด์ลูกค้าที่ไว้วางใจ */}
      <ClientsSection locale={locale} />

      {/* 7. Contact / CTA — ปิดการขาย */}
      {company && <ContactSection locale={locale} data={company} />}
    </>
  )
}
