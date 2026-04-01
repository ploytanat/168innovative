import type { Locale } from "../types/content"
import type { WhyItemView } from "../types/view"
import { getMockWhy } from "../mock/runtime"
import { getWordPressWhy } from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export async function getWhy(locale: Locale): Promise<WhyItemView[]> {
  return loadWithWordPressFallback(
    `why items (${locale})`,
    () => getWordPressWhy(locale),
    () => getMockWhy(locale)
  )
}
