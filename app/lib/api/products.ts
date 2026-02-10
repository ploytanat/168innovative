import { productsMock } from '../mock/products.mock'
import { Locale } from '../types/content'
import { ProductView } from '../types/view'

/* ================= Utils ================= */
function mapProductToView(
  product: typeof productsMock[number],
  locale: Locale
): ProductView {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name[locale] ?? product.name.th,
    description: product.description?.[locale] ?? '',
    categoryId: product.categoryId,
    image: {
      src: product.image.src,
      alt: product.image.alt?.[locale] ?? product.name.th,
    },
    price: product.price,
  }
}

/* ================= All Products ================= */
export function getProducts(locale: Locale): ProductView[] {
  return productsMock.map(p => mapProductToView(p, locale))
}

/* ================= Products by Category ================= */
/**
 * @param categoryId ใช้ id เท่านั้น (ไม่ใช่ slug)
 */
export function getProductsByCategory(
  categoryId: string,
  locale: Locale
): ProductView[] {
  return productsMock
    .filter(p => p.categoryId === categoryId)
    .map(p => mapProductToView(p, locale))
}

/* ================= Single Product ================= */
/**
 * @param categoryId category.id
 * @param productSlug product.slug
 */
export function getProductBySlug(
  categoryId: string,
  productSlug: string,
  locale: Locale
): ProductView | undefined {
  const product = productsMock.find(
    p => p.categoryId === categoryId && p.slug === productSlug
  )

  if (!product) return undefined

  return mapProductToView(product, locale)
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