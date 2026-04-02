import { NextRequest, NextResponse } from "next/server"
import { parseWpBody, wpHeaders, WP_BASE } from "../_lib"

// PATCH /api/admin/update-family
// Updates acf.family_name_th and acf.family_name_en on a product
export async function PATCH(req: NextRequest) {
  const { id, family_name_th, family_name_en } = await req.json()

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  if (!WP_BASE || !process.env.WP_USERNAME || !process.env.WP_APP_PASSWORD) {
    return NextResponse.json({ error: "WP credentials not configured" }, { status: 500 })
  }

  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}`, {
    method: "POST",
    headers: wpHeaders(),
    body: JSON.stringify({
      acf: {
        family_name_th: family_name_th || null,
        family_name_en: family_name_en || null,
      },
    }),
  })

  const data = await parseWpBody(res)
  return NextResponse.json(res.ok ? { ok: true } : data, { status: res.status })
}
