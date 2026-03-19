import type { Locale } from "@/app/lib/types/content"

export const SITE_URL = "https://168innovative.co.th"
export const SITE_NAME = "168 Innovative"
export const COMPANY_NAME = "168 Innovative Co., Ltd."
export const ORGANIZATION_DESCRIPTION: Record<Locale, string> = {
  th: "ผู้ผลิตและจำหน่ายบรรจุภัณฑ์พลาสติก จุกซอง ฝาพลาสติก OEM/ODM",
  en: "Manufacturer and supplier of plastic packaging, spouts, plastic caps, and OEM/ODM packaging solutions.",
}
export const ORGANIZATION_AVAILABLE_LANGUAGES = ["Thai", "English"] as const
export const ORGANIZATION_SAME_AS_FALLBACK = [
  "https://www.facebook.com/168innovative",
  "https://line.me/ti/p/~168innovative",
]

const SITE_HOSTNAMES = new Set([
  "168innovative.co.th",
  "www.168innovative.co.th",
  "168innovative.com",
  "www.168innovative.com",
])

export const localePrefix: Record<Locale, string> = {
  th: "",
  en: "/en",
}

export const defaultOgImage = "/og-image.jpg"

export function withSiteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`
}

export function withCanonicalSiteUrl(pathOrUrl: string) {
  if (!pathOrUrl.startsWith("http")) {
    return `${SITE_URL}${pathOrUrl}`
  }

  try {
    const url = new URL(pathOrUrl)

    if (!SITE_HOSTNAMES.has(url.hostname)) {
      return pathOrUrl
    }

    return `${SITE_URL}${url.pathname}${url.search}${url.hash}`
  } catch {
    return pathOrUrl
  }
}

export function withLocalePath(path: string, locale: Locale) {
  if (path.startsWith("http")) return path
  const normalized = path === "/" ? "" : path
  return `${localePrefix[locale]}${normalized || "/"}`
}
