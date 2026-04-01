import type { Locale } from "../types/content"
import type { CompanyView } from "../types/view"
import { getMockCompany } from "../mock/runtime"
import { getWordPressCompany } from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export async function getCompany(locale: Locale): Promise<CompanyView | null> {
  return loadWithWordPressFallback(
    `company (${locale})`,
    () => getWordPressCompany(locale),
    () => getMockCompany(locale)
  )
}
