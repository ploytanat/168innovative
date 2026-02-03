// lib/api/categories.ts
import { categoriesMock } from '../mock/categories.mock'
import { Locale } from '../types/content'
import { CategoryView } from '../types/view'

export function getCategories(locale: Locale): CategoryView[] {
  return categoriesMock.map(cat => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name[locale],
    description: cat.description[locale],
    image: cat.image
      ? {
          src: cat.image.src,
          alt: cat.image.alt[locale],
        }
      : undefined,
  }))
}
