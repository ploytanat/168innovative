import {
  COMPANY_NAME,
  ORGANIZATION_AVAILABLE_LANGUAGES,
  ORGANIZATION_DESCRIPTION,
  ORGANIZATION_SAME_AS_FALLBACK,
  SITE_NAME,
  SITE_URL,
  withSiteUrl,
} from "@/app/config/site"
import type { Locale } from "@/app/lib/types/content"
import type { CompanyView, FAQItemView } from "@/app/lib/types/view"

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function normalizeSameAsUrls(company?: CompanyView | null) {
  const companyUrls = (company?.socials ?? [])
    .map((social) => social.url?.trim())
    .filter((url): url is string => Boolean(url))

  const urls =
    companyUrls.length > 0 ? companyUrls : ORGANIZATION_SAME_AS_FALLBACK

  return Array.from(new Set(urls))
}

export function buildPostalAddressJsonLd(address?: string | null) {
  return {
    "@type": "PostalAddress",
    ...(address ? { streetAddress: stripHtml(address) } : {}),
    addressCountry: "TH",
  }
}

export function buildOrganizationJsonLd({
  locale,
  company,
  description,
}: {
  locale: Locale
  company?: CompanyView | null
  description?: string
}) {
  const primaryPhone = company?.phones?.[0]?.number
  const primaryEmail = company?.email?.[0]

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": SITE_URL,
    name: SITE_NAME,
    legalName: company?.name || COMPANY_NAME,
    url: SITE_URL,
    logo: withSiteUrl(company?.logo?.src || "/logo.png"),
    description: description || ORGANIZATION_DESCRIPTION[locale],
    address: buildPostalAddressJsonLd(company?.address),
    areaServed: {
      "@type": "Country",
      name: "Thailand",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        areaServed: "TH",
        availableLanguage: [...ORGANIZATION_AVAILABLE_LANGUAGES],
        ...(primaryPhone ? { telephone: primaryPhone } : {}),
        ...(primaryEmail ? { email: primaryEmail } : {}),
      },
    ],
    sameAs: normalizeSameAsUrls(company),
  }
}

export function buildAboutPageJsonLd({
  locale,
  url,
  name,
  description,
}: {
  locale: Locale
  url: string
  name: string
  description: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: locale === "th" ? "th-TH" : "en-US",
    isPartOf: {
      "@id": `${SITE_URL}#website`,
    },
    about: {
      "@id": SITE_URL,
    },
    mainEntity: {
      "@id": SITE_URL,
    },
  }
}

export function buildFaqJsonLd(
  items?: FAQItemView[] | null,
  options?: { pageId?: string }
) {
  if (!Array.isArray(items) || items.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(options?.pageId ? { "@id": options.pageId } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(item.answer),
      },
    })),
  }
}

type BreadcrumbListItemInput = {
  name: string
  item: string
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbListItemInput[],
  options?: { id?: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(options?.id ? { "@id": options.id } : {}),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}
