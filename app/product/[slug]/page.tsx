// app/product/[slug]/page.tsx

import { permanentRedirect, notFound } from 'next/navigation'
import { getProductBySlug } from '@/app/lib/api/products'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function LegacyProductRedirect({ params }: Props) {
  const { slug } = await params
  const locale = 'th'

  const product = await getProductBySlug(slug, locale)

  // 🟢 ถ้ามีสินค้า → redirect
  if (product) {
    permanentRedirect(
      `/categories/${product.categorySlug}/${slug}`
    )
  }

  // 🔴 ถ้าไม่มี → ใช้ notFound()
  notFound()
}