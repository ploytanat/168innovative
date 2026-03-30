import type { Locale } from "../types/content"
import type { CompanyView } from "../types/view"
import { getMockCompany } from "../mock/runtime"

export async function getCompany(locale: Locale): Promise<CompanyView | null> {
  return getMockCompany(locale)
}
