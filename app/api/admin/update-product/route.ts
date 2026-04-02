import { NextRequest, NextResponse } from "next/server"
import { parseWpBody, wpHeaders, WP_BASE } from "../_lib"

export async function PATCH(req: NextRequest) {
  const { id, related_products } = await req.json()

  if (!id || !Array.isArray(related_products)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (!WP_BASE || !process.env.WP_USERNAME || !process.env.WP_APP_PASSWORD) {
    return NextResponse.json({ error: "WP credentials not configured" }, { status: 500 })
  }

  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}`, {
    method: "POST",
    headers: wpHeaders(),
    body: JSON.stringify({
      acf: { related_products: related_products.length > 0 ? related_products : null },
    }),
  })

  const data = await parseWpBody(res)
  return NextResponse.json(res.ok ? { ok: true, data } : data, { status: res.status })
}
