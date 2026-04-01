import { NextRequest, NextResponse } from "next/server"
import { wpAdminFetch, wpHeaders, WP_BASE } from "../_lib"

export function buildWPCategoryPayload(body: Record<string, unknown>) {
  return {
    name: body.name_th ?? body.name_en ?? "Untitled",
    description: body.description_th ?? "",
    acf: {
      name_th: body.name_th ?? "",
      name_en: body.name_en ?? "",
      description_th: body.description_th ?? "",
      description_en: body.description_en ?? "",
      image: body.image_media_id ?? null,
      image_alt_th: body.image_alt_th ?? "",
      image_alt_en: body.image_alt_en ?? "",
      seo_title_th: body.seo_title_th ?? "",
      seo_title_en: body.seo_title_en ?? "",
      seo_description_th: body.seo_description_th ?? "",
      seo_description_en: body.seo_description_en ?? "",
    },
  }
}

// GET /api/admin/categories
export async function GET() {
  const res = await wpAdminFetch(
    `${WP_BASE}/wp-json/wp/v2/product_category?per_page=100`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) return NextResponse.json({ error: "WP fetch failed" }, { status: res.status })
  return NextResponse.json(await res.json())
}

// POST /api/admin/categories
export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product_category`, {
    method: "POST",
    headers: wpHeaders(),
    body: JSON.stringify(buildWPCategoryPayload(body)),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
