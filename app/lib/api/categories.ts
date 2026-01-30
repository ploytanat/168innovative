import { categoriesMock } from '../mock/categories.mock'
import { Locale } from '../types/content'

export function getCategories(locale: Locale) {
  return categoriesMock.map(cat => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name[locale]
  }))
}
