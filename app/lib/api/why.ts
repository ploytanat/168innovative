import type { Locale } from "../types/content"
import type { WhyItemView } from "../types/view"
import { getMockWhy } from "../mock/runtime"

export async function getWhy(locale: Locale): Promise<WhyItemView[]> {
  return getMockWhy(locale)
}
