import type { Metadata } from "next"

import AboutHero from "@/app/components/sections/AboutHero"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import { buildMetadata } from "@/app/config/seo"
import { getAbout } from "@/app/lib/api/about"
import { getWhy } from "@/app/lib/api/why"

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout("th")
  const title = about?.seoTitle || "เกี่ยวกับเรา"
  const description =
    about?.seoDescription ||
    "รู้จัก 168 Innovative ผู้นำเข้าและจัดจำหน่ายบรรจุภัณฑ์เครื่องสำอางและผลิตภัณฑ์พลาสติกสำหรับงาน OEM และ ODM"

  return buildMetadata({
    locale: "th",
    title,
    description,
    path: "/about",
    image: "/og-image.jpg",
    keywords: [
      "เกี่ยวกับ 168 Innovative",
      "บรรจุภัณฑ์เครื่องสำอาง",
      "OEM packaging",
      "ODM packaging",
    ],
  })
}

export default async function AboutPage() {
  const locale = "th"
  const [about, why] = await Promise.all([getAbout(locale), getWhy(locale)])

  if (!about) return null

  return (
    <main className="bg-[#eeeeee]">
      <AboutHero hero={about.hero} whoAreWe={about.whoAreWe} />
      <WhyChooseUs items={why} locale={locale} />
    </main>
  )
}
