import type { Locale } from "../types/content"
import type { AboutView } from "../types/view"
import { getMockAbout } from "../mock/runtime"
import { getWordPressAbout } from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export async function getAbout(
  locale: Locale
): Promise<Omit<AboutView, "why"> | null> {
  return loadWithWordPressFallback(
    `about (${locale})`,
    () => getWordPressAbout(locale),
    () => getMockAbout(locale)
  )
}
