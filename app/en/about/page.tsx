import type { Metadata } from "next"

import AboutHero from "@/app/components/sections/AboutHero"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import { buildMetadata } from "@/app/config/seo"
import { getAbout } from "@/app/lib/api/about"
import { getWhy } from "@/app/lib/api/why"

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout("en")
  const title = about?.seoTitle || "About 168 Innovative"
  const description =
    about?.seoDescription ||
    "Learn about 168 Innovative, a cosmetic packaging supplier focused on reliable sourcing, OEM support, and production-ready packaging."

  return buildMetadata({
    locale: "en",
    title,
    description,
    path: "/about",
    image: "/og-image.jpg",
    keywords: [
      "about 168 Innovative",
      "cosmetic packaging supplier",
      "OEM packaging company",
    ],
  })
}

export default async function AboutPage() {
  const locale = "en"
  const [about, why] = await Promise.all([getAbout(locale), getWhy(locale)])

  if (!about) return null

  return (
    <main className="bg-[#eeeeee]">
      <AboutHero hero={about.hero} whoAreWe={about.whoAreWe} />
      <WhyChooseUs items={why} locale={locale} />
    </main>
  )
}
