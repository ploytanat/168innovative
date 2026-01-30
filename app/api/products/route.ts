import { NextResponse } from 'next/server'
import { getProducts } from '@/app/lib/api/products'
import { Locale } from '@/app/lib/types/content'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const locale = (searchParams.get('locale') || 'th') as Locale

  const products = getProducts(locale)

  return NextResponse.json(products)
}
