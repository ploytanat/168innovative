import { NextRequest, NextResponse } from "next/server"
import { parseWpBody, wpHeaders, WP_BASE } from "../../_lib"
import { buildWPCategoryPayload } from "../route"

// PATCH /api/admin/categories/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product_category/${id}`, {
    method: "POST", // WP uses POST for term updates
    headers: wpHeaders(),
    body: JSON.stringify(buildWPCategoryPayload(body)),
  })

  const data = await parseWpBody(res)
  return NextResponse.json(data, { status: res.status })
}

// DELETE /api/admin/categories/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(
    `${WP_BASE}/wp-json/wp/v2/product_category/${id}?force=true`,
    { method: "DELETE", headers: wpHeaders() }
  )

  const data = await parseWpBody(res)
  return NextResponse.json(data, { status: res.status })
}
