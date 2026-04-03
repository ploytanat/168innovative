import type { Metadata } from "next"

import ContactPageView, {
  parseInquiryItems,
} from "@/app/components/contact/ContactPageView"
import { buildMetadata } from "@/app/config/seo"
import { getCompany } from "@/app/lib/api/company"
import type { Locale } from "@/app/lib/types/content"

export const metadata: Metadata = buildMetadata({
  locale: "th",
  title: "ติดต่อ 168 Innovative",
  description:
    "ติดต่อ 168 Innovative เพื่อสอบถามสินค้า บรรจุภัณฑ์เครื่องสำอาง งาน OEM และขอใบเสนอราคาได้ผ่านโทร อีเมล และ LINE",
  path: "/contact",
  keywords: ["ติดต่อ 168 Innovative", "สอบถามสินค้า", "OEM packaging contact"],
})

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[]; products?: string | string[] }>
}) {
  const locale: Locale = "th"
  const company = await getCompany(locale)
  const inquiryItems = parseInquiryItems(await searchParams)

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>ไม่พบข้อมูลติดต่อ</p>
      </div>
    )
  }

  return <ContactPageView company={company} locale={locale} inquiryItems={inquiryItems} />
}
