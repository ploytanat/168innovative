import { permanentRedirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/app/lib/api/products'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function LegacyProductRedirect({ params }: Props) {
  const { slug } = await params
  const locale = 'th'

  const product = await getProductBySlug(slug, locale)

  // 🟢 ถ้ายังมีสินค้า → redirect ไปโครงสร้างใหม่
  if (product) {
    permanentRedirect(
      `/categories/${product.categorySlug}/${slug}`
    )
  }

  // 🔴 ถ้าไม่มีสินค้าแล้ว → 410 Gone
  return new NextResponse('Gone', { status: 410 })
}