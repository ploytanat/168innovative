import type { ReactNode } from "react"

import BackToTop from "@/app/components/ui/BackToTop"
import { COMPANY_NAME, SITE_URL } from "@/app/config/site"
import { getCompany } from "@/app/lib/api/company"
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
    src: "/fallback-logo.png",
    alt: "168 Innovative",
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: displayLogo.src,
    image: displayLogo.src,
    telephone: company?.phones?.[0]?.number,
    address: {
      "@type": "PostalAddress",
      streetAddress: "89/269 Soi Thian Thale 20",
      addressLocality: "Bang Khun Thian",
      addressRegion: "Bangkok",
      postalCode: "10150",
      addressCountry: "TH",
    },
    sameAs: ["https://www.facebook.com/168innovative"],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="min-h-screen">
        <Navigation locale={locale} logo={displayLogo} />
        <main className="min-h-screen">{children}</main>
        {company && <Footer company={company} />}
        <BackToTop />
      </div>
    </>
  )
}
