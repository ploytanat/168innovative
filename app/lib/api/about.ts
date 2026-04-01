import type { Locale } from "../types/content"
import type { AboutView } from "../types/view"
import { getMockAbout } from "../mock/runtime"

export async function getAbout(
  locale: Locale
): Promise<Omit<AboutView, "why"> | null> {
  return getMockAbout(locale)
}
