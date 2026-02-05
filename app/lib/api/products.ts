import { productsMock } from '../mock/products.mock'
import { Locale } from '../types/content';
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


export function getProductsByCategory(
  categoryId: string,
  locale: Locale
): ProductView[] {
  return productsMock
    .filter(p => p.categoryId === categoryId)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name[locale],              // ✅ ตรงนี้สำคัญ
      description: p.description[locale],
      categoryId: p.categoryId,
      image: {
        src: p.image.src,
        alt: p.image.alt[locale],        // ✅ ตรงนี้ด้วย
      },
      price: p.price,
    }))
}


export function getProductBySlug(
  categoryId: string,
  productSlug: string,
  locale: Locale
): ProductView | undefined {
  const product = productsMock.find(
    p => p.categoryId === categoryId && p.slug === productSlug
  )

  if (!product) return undefined

  return {
    id: product.id,
    slug: product.slug,
    name: product.name[locale],
    description: product.description[locale],
    categoryId: product.categoryId,
    image: {
      src: product.image.src,
      alt: product.image.alt[locale],
    },
    price: product.price,
  }
}

export function getRelatedProducts(
  categoryId: string,
  currentId: string,
  locale: Locale
){
  return productsMock
  .filter(p => p.categoryId === categoryId && p.id !== currentId)
  .slice(0, 4)
  .map(p => ({
    id:p.id,
    slug:p.slug,
    name: p.name[locale],
    image:{
      src:p.image.src,
      alt:p.image.alt[locale],
    },
    price:p.price,
  }))
}