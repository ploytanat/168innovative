import type { Metadata } from "next"

import ContactPageView, {
  parseInquiryItems,
} from "@/app/components/contact/ContactPageView"
import { buildMetadata } from "@/app/config/seo"
import { getCompany } from "@/app/lib/api/company"
import type { Locale } from "@/app/lib/types/content"

export const metadata: Metadata = buildMetadata({
  locale: "en",
  title: "Contact 168 Innovative",
  description:
    "Contact 168 Innovative for product inquiries, cosmetic packaging sourcing, OEM support, and company contact details.",
  path: "/contact",
  keywords: ["contact 168 Innovative", "cosmetic packaging contact", "OEM packaging inquiry"],
})

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[]; products?: string | string[] }>
}) {
  const locale: Locale = "en"
  const company = await getCompany(locale)
  const inquiryItems = parseInquiryItems(await searchParams)

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Contact information not found</p>
      </div>
    )
  }

  return <ContactPageView company={company} locale={locale} inquiryItems={inquiryItems} />
}
