import type { Metadata } from "next"

import type { Locale } from "@/app/lib/types/content"
import {
  COMPANY_NAME,
  defaultOgImage,
  SITE_NAME,
  SITE_URL,
  withLocalePath,
  withSiteUrl,
} from "@/app/config/site"

type MetadataInput = {
  locale: Locale
  title: string
  description: string
  path: string
  keywords?: Array<string | undefined>
  image?: string
  type?: "website" | "article"
  canonicalUrl?: string
  alternates?: {
    th?: string
    en?: string
  }
}

function dedupeKeywords(keywords: Array<string | undefined>) {
  return [
    ...new Set(
      keywords.filter((keyword): keyword is string => Boolean(keyword))
    ),
  ]
}

export function buildMetadata(input: MetadataInput): Metadata {
  const {
    locale,
    title,
    description,
    path,
    image = defaultOgImage,
    keywords = [],
    type = "website",
    canonicalUrl,
    alternates,
  } = input

  const localizedPath = withLocalePath(path, locale)
  const canonicalPath = canonicalUrl ?? localizedPath
  const canonical = withSiteUrl(canonicalPath)
  const languageAlternates = {
    th: withLocalePath(alternates?.th ?? path, "th"),
    en: withLocalePath(alternates?.en ?? path, "en"),
  }

  return {
    title,
    description,
    keywords: dedupeKeywords([
      ...keywords,
      SITE_NAME,
      COMPANY_NAME,
      "cosmetic packaging",
    ]),
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      type,
      locale: locale === "th" ? "th_TH" : "en_US",
      url: canonical,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: withSiteUrl(image),
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [withSiteUrl(image)],
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(SITE_URL),
  }
}
