// lib/routes.ts
export function productUrl(
  categorySlug: string,
  productSlug: string
) {
  return `/categories/${categorySlug}/${productSlug}`
}
