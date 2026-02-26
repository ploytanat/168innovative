import { permanentRedirect, notFound } from 'next/navigation'
import { getProductBySlug } from '@/app/lib/api/products'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function LegacyProductRedirect({ params }: Props) {
  const { slug } = await params   // ✅ ต้อง await

  const locale = 'th'
  const product = await getProductBySlug(slug, locale)

  if (!product) notFound()

  // 🔥 redirect แบบถาวร (SEO-safe)
  permanentRedirect(
    `/categories/${product.categorySlug}/${slug}`
  )
}