import { Suspense } from "react"
import FacebookUpdates, { FacebookUpdatesLink } from "@/app/components/sections/FacebookUpdates"
import type { Metadata } from "next"
import { homeFont } from "@/app/config/fonts"

import CategorySection from "@/app/components/sections/CategorySection"
import ContactSection from "@/app/components/sections/ContactSection"
import FaqSection from "@/app/components/sections/FaqSection"
import HomeHero from "@/app/components/sections/HomeHero"
import PackagingStudio from "@/app/components/sections/PackagingStudio"
import PortfolioGrid from "@/app/components/sections/PortfolioGrid"
import PromoGrid from "@/app/components/sections/PromoGrid"
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

  const facebookPage = company?.socials.find(social => social.type.toLowerCase() === "facebook")?.url

  return (
    <div className={`${homeFont.className} home-showroom`}>
      <h1 className="sr-only">
        168 Innovative บรรจุภัณฑ์เครื่องสำอางและพลาสติกสำหรับงาน OEM และ ODM
      </h1>
      {heroSlides.length > 0 && <HomeHero hero={{ slides: heroSlides }} locale={locale} showStudio={categories.length > 0} />}
      {categories.length > 0 && <CategorySection items={categories} locale={locale} />}
      {categories.length > 0 && <PackagingStudio categories={categories} locale={locale} email={company?.email[0]} />}
      {products.length > 0 && <PortfolioGrid items={products} locale={locale} />}
      <Suspense fallback={<FacebookUpdatesLink locale={locale} pageUrl={facebookPage} />}><FacebookUpdates locale={locale} pageUrl={facebookPage} /></Suspense>
      {whys.length > 0 && <PromoGrid whys={whys} locale={locale} />}
      <FaqSection locale={locale} />
      {company && <ContactSection locale={locale} data={company} />}
    </div>
  )
}
