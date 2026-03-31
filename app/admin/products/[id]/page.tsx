import pool from '@/app/lib/db/connection'
import { notFound } from 'next/navigation'
import ProductForm from '../_form'

async function getCategories() {
  try {
    const [rows] = await pool.execute('SELECT id, name_th FROM categories ORDER BY sort_order ASC') as [Record<string, unknown>[], unknown]
    return rows
  } catch { return [] }
}

async function getProduct(id: number) {
  try {
    const [[product]] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]) as [Record<string, unknown>[], unknown]
    if (!product) return null
    const [variants] = await pool.execute('SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [specs] = await pool.execute('SELECT * FROM product_specs WHERE product_id = ? AND variant_id IS NULL ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [media] = await pool.execute('SELECT * FROM product_media WHERE product_id = ? AND variant_id IS NULL ORDER BY sort_order ASC', [id]) as [Record<string, unknown>[], unknown]
    const [faqs] = await pool.execute("SELECT * FROM faq_items WHERE owner_type = 'product' AND owner_id = ? ORDER BY sort_order ASC", [id]) as [Record<string, unknown>[], unknown]
    const enrichedVariants = await Promise.all(
      variants.map(async (v) => {
        const [options] = await pool.execute('SELECT * FROM product_variant_options WHERE variant_id = ? ORDER BY sort_order ASC', [Number(v.id)]) as [Record<string, unknown>[], unknown]
        const [vspecs] = await pool.execute('SELECT * FROM product_specs WHERE variant_id = ? ORDER BY sort_order ASC', [Number(v.id)]) as [Record<string, unknown>[], unknown]
        return { ...v, options, specs: vspecs }
      })
    )
    return { ...product, variants: enrichedVariants, specs, media, faqs }
  } catch { return null }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProduct(Number(id)), getCategories()])
  if (!product) notFound()
  return <ProductForm product={product} categories={categories} />
}
