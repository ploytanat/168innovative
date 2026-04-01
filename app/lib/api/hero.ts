import type { Locale } from "../types/content"
import { getMockHeroSlides } from "../mock/runtime"
import { getWordPressHeroSlides } from "./wordpress-source"
import { loadWithWordPressFallback } from "./wp"

export async function getHeroSlides(locale: Locale) {
  return loadWithWordPressFallback(
    `hero slides (${locale})`,
    () => getWordPressHeroSlides(locale),
    () => getMockHeroSlides(locale)
  )
}
