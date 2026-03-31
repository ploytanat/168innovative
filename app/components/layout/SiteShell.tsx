import type { ReactNode } from "react"

import ClientProviders from "@/app/components/layout/ClientProviders"
import BackToTop from "@/app/components/ui/BackToTop"
import { COMPANY_NAME, ORGANIZATION_SAME_AS_FALLBACK, SITE_NAME, SITE_URL, withSiteUrl } from "@/app/config/site"
import { getCompany } from "@/app/lib/api/company"
import { buildOrganizationJsonLd, buildPostalAddressJsonLd } from "@/app/lib/schema"
import type { Locale } from "@/app/lib/types/content"
import Footer from "./Footer"
import Navigation from "./Navigation"

interface SiteShellProps {
  locale: Locale
  children: ReactNode
}

export default async function SiteShell({
  locale,
  children,
}: SiteShellProps) {
  const company = await getCompany(locale)
  const displayLogo = company?.logo ?? {
    src: "/logo.png",
    alt: "168 Innovative",
  }
  const socialUrls = Array.from(
    new Set((company?.socials ?? []).map((social) => social.url).filter(Boolean))
  )
  const primaryPhone = company?.phones?.[0]?.number
  const contactPoint = primaryPhone
    ? [
        {
          "@type": "ContactPoint",
          telephone: primaryPhone,
          contactType: "customer service",
          areaServed: "TH",
          availableLanguage: ["th", "en"],
        },
      ]
    : undefined
  const areaServed = {
    "@type": "Country",
    name: "Thailand",
  }
  const organizationJsonLd = buildOrganizationJsonLd({ locale, company })
  const websiteJsonLd = {
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: locale,
    publisher: {
      "@id": SITE_URL,
    },
  }
  const localBusinessJsonLd = {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#localbusiness`,
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: withSiteUrl(displayLogo.src),
    image: withSiteUrl(displayLogo.src),
    areaServed,
    ...(primaryPhone ? { telephone: primaryPhone } : {}),
    ...(contactPoint ? { contactPoint } : {}),
    address: buildPostalAddressJsonLd(company?.address),
    sameAs: socialUrls.length ? socialUrls : organizationJsonLd.sameAs,
    parentOrganization: {
      "@id": SITE_URL,
    },
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd, websiteJsonLd, localBusinessJsonLd],
  }

  const lineSocial = company?.socials?.find((s) => s.type === "line")
  const lineUrl = lineSocial?.url ?? ORGANIZATION_SAME_AS_FALLBACK[1]

  return (
    <>
      <script
        id="global-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ClientProviders lineUrl={lineUrl} locale={locale}>
        <div className="site-frame min-h-screen">
          <Navigation locale={locale} logo={displayLogo} />
          <main className="min-h-screen">{children}</main>
          {company && <Footer company={company} />}
          <BackToTop />
        </div>
      </ClientProviders>
    </>
  )
}
