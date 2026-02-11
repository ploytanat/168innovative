// @/app/lib/api/products.ts
import { productsMock } from '../mock/products.mock'
import { categoriesMock } from '../mock/categories.mock' // เพิ่มการนำเข้า categories
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

export function getProducts(locale: Locale): ProductView[] {
  return productsMock.map(p => mapProductToView(p, locale))
}

/* ================= Products by Category ================= */
/**
 * ค้นหาสินค้าทั้งหมดในหมวดหมู่ โดยใช้ ID
 * @param categoryId ใช้ id เท่านั้น (เช่น 'cat-01')
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
 * ค้นหาสินค้าตัวเดียวโดยใช้ Slug จาก URL
 * @param categorySlug slug ของหมวดหมู่จาก URL (เช่น 'spout')
 * @param productSlug slug ของสินค้าจาก URL (เช่น 'spout-hl160d-16mm')
 */
export function getProductBySlug(
  categorySlug: string,
  productSlug: string,
  locale: Locale
): ProductView | undefined {
  // 1. หาหมวดหมู่ (Category) จาก slug ก่อนเพื่อเอา ID
  const category = categoriesMock.find(c => c.slug === categorySlug)
  
  if (!category) return undefined

  // 2. หาสินค้าที่ categoryId ตรงกับ ID ที่หาได้ และ slug สินค้าตรงกัน
  const product = productsMock.find(
    p => p.categoryId === category.id && p.slug === productSlug
  )

  if (!product) return undefined

  return mapProductToView(product, locale)
}

/* ================= Related Products ================= */
export function getRelatedProducts(
  categoryId: string,
  currentId: string,
  locale: Locale
){
  return productsMock
  .filter(p => p.categoryId === categoryId && p.id !== currentId)
  .slice(0, 4)
  .map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name[locale] ?? p.name.th,
    image: {
      src: p.image.src,
      alt: p.image.alt?.[locale] ?? p.name.th,
    },
    price: p.price,
  }))
}