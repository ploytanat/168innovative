// app/product/[slug]/page.tsx

import { redirect, notFound } from 'next/navigation'
import { getProductBySlug } from '@/app/lib/api/products'
import { getCategoryBySlug } from '@/app/lib/api/categories'

interface Props {
  params: {
    slug: string
  }
}

export default async function LegacyProductRedirect({ params }: Props) {
  const slug = params.slug
  const locale = 'th'

  // ดึงข้อมูล product
  const product = await getProductBySlug(slug, locale)

  if (!product) notFound()

  // ดึง category จาก product
  const category = await getCategoryBySlug(product.categorySlug, locale)

  if (!category) notFound()

  // 🔥 ทำ 301 redirect
  redirect(`/categories/${category.slug}/${slug}`)
}