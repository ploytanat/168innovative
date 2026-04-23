import type { Metadata } from "next"

import HomePageView from "@/app/components/home/HomePageView"
import SiteShell from "@/app/components/layout/SiteShell"
import { buildMetadata } from "@/app/config/seo"
import { getHomeSections } from "@/app/lib/api/home"

export const metadata: Metadata = buildMetadata({
  locale: "en",
  title: "168 Innovative — Cosmetic Packaging OEM/ODM",
  description:
    "Manufacturer and distributor of plastic cosmetic packaging for OEM and ODM projects. Sample selection through production-ready delivery.",
  path: "/en",
  keywords: ["cosmetic packaging", "OEM", "ODM", "168 Innovative", "plastic packaging"],
})

export default async function HomePage() {
  const { heroSlides, products, categories, whys, company, articles } = await getHomeSections("en")
  return (
    <SiteShell locale="en">
      <HomePageView
        locale="en"
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
