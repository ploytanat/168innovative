import { productsMock } from '../mock/products.mock'
import { Locale } from '../types/content'

export function getProducts(locale: Locale) {
  return productsMock.map(p => ({
    ...p,
    name: p.name[locale],
    description: p.description[locale],
    image: {
      ...p.image,
      alt: p.image.alt[locale]
    }
  }))
}
