import type { Metadata } from "next"
import Script from "next/script"

import AboutOverview from "@/app/components/sections/AboutOverview"
import { buildMetadata } from "@/app/config/seo"
import { withCanonicalSiteUrl, withLocalePath } from "@/app/config/site"
import { getAbout } from "@/app/lib/api/about"
import { getCompany } from "@/app/lib/api/company"
import { buildAboutPageJsonLd, buildOrganizationJsonLd } from "@/app/lib/schema"

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

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
  const [about, company] = await Promise.all([
    getAbout(locale),
    getCompany(locale),
  ])

  if (!about) return null

  const aboutUrl = withCanonicalSiteUrl(withLocalePath("/about", locale))
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd({ locale, company }),
      buildAboutPageJsonLd({
        locale,
        url: aboutUrl,
        name: about.seoTitle || about.hero.title,
        description: about.seoDescription || about.hero.description,
      }),
    ],
  }

  return (
    <>
      <Script
        id="about-jsonld-th"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutSchema) }}
      />
      <AboutOverview hero={about.hero} company={company} locale={locale} />
    </>
  )
}
