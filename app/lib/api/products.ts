import { productsMock } from '../mock/products.mock'
import { Locale } from '../types/content'
import { ProductView } from '../types/view'


export function getProducts(locale: Locale): ProductView[] {
  return productsMock.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name[locale],
    description: p.description[locale],
    categoryId: p.categoryId,
    image: {
      src: p.image.src,
      alt: p.image.alt[locale],
    },
    price: p.price,
  }))
}