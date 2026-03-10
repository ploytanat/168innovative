import type { Locale } from "@/app/lib/types/content"

export const SITE_URL = "https://168innovative.co.th"
export const SITE_NAME = "168 Innovative"
export const COMPANY_NAME = "168 Innovative Co., Ltd."

export const localePrefix: Record<Locale, string> = {
  th: "",
  en: "/en",
}

export const defaultOgImage = "/og-image.jpg"

export function withSiteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`
}

export function withLocalePath(path: string, locale: Locale) {
  if (path.startsWith("http")) return path
  const normalized = path === "/" ? "" : path
  return `${localePrefix[locale]}${normalized || "/"}`
}
