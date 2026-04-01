import type { Locale } from "../types/content"
import { getMockHeroSlides } from "../mock/runtime"

export async function getHeroSlides(locale: Locale) {
  return getMockHeroSlides(locale)
}
