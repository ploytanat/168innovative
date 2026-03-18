import type { Locale } from "@/app/lib/types/content"

export const SITE_URL = "https://168innovative.co.th"
export const SITE_NAME = "168 Innovative"
export const COMPANY_NAME = "168 Innovative Co., Ltd."

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
