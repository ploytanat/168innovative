import type { Metadata } from "next"
import Script from "next/script"

import AboutHero from "@/app/components/sections/AboutHero"
import WhyChooseUs from "@/app/components/sections/WhyChooseUs"
import { buildMetadata } from "@/app/config/seo"
import { withCanonicalSiteUrl, withLocalePath } from "@/app/config/site"
import { getAbout } from "@/app/lib/api/about"
import { getCompany } from "@/app/lib/api/company"
import { getWhy } from "@/app/lib/api/why"
import { buildAboutPageJsonLd, buildOrganizationJsonLd } from "@/app/lib/schema"

function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

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
  const [about, why, company] = await Promise.all([
    getAbout(locale),
    getWhy(locale),
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
        id="about-jsonld-en"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutSchema) }}
      />
      <main className="bg-transparent">
        <AboutHero hero={about.hero} />
        <WhyChooseUs items={why} locale={locale} />
      </main>
    </>
  )
}
