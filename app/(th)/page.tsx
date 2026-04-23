import type { Metadata } from "next"

import HomePageView from "@/app/components/home/HomePageView"
import SiteShell from "@/app/components/layout/SiteShell"
import { buildMetadata } from "@/app/config/seo"
import { getHomeSections } from "@/app/lib/api/home"

export const metadata: Metadata = buildMetadata({
  locale: "th",
  title: "168 Innovative — บรรจุภัณฑ์เครื่องสำอาง OEM/ODM ครบวงจร",
  description:
    "ผู้ผลิตและจำหน่ายบรรจุภัณฑ์พลาสติกสำหรับงาน OEM และ ODM ครบวงจร ตั้งแต่เลือกสินค้าตัวอย่างไปจนถึงขั้นตอนการผลิต",
  path: "/",
  keywords: ["บรรจุภัณฑ์เครื่องสำอาง", "OEM", "ODM", "168 Innovative", "บรรจุภัณฑ์พลาสติก"],
})

export default async function HomePage() {
  const { heroSlides, products, categories, whys, company, articles } = await getHomeSections("th")
  return (
    <SiteShell locale="th">
      <HomePageView
        locale="th"
        heroSlides={heroSlides}
        categories={categories}
        products={products}
        whys={whys}
        company={company}
        articles={articles}
      />
    </SiteShell>
  )
}
