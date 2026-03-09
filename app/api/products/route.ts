import { NextResponse } from 'next/server'

import { getProducts, getProductsByCategory } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'

function parsePage(value: string | null) {
  const page = Number(value ?? 1)
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const locale = (searchParams.get('locale') || 'th') as Locale
  const category = searchParams.get('category')
  const page = parsePage(searchParams.get('page'))

  if (category) {
    const result = await getProductsByCategory(category, locale, page)
    return NextResponse.json(result)
  }

  const products = await getProducts(locale)
  return NextResponse.json(products)
}
