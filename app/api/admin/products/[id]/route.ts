import { NextRequest, NextResponse } from "next/server"
import { parseWpBody, wpHeaders, WP_BASE } from "../../_lib"
import { buildWPProductPayload } from "../route"

// PATCH /api/admin/products/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const payload = buildWPProductPayload(body)
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}`, {
    method: "POST",
    headers: wpHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await parseWpBody(res)
  if (!res.ok) {
    console.error(`[PATCH products/${id}] WP ${res.status}:`, JSON.stringify(data).slice(0, 600))
    console.error(`[PATCH products/${id}] payload:`, JSON.stringify(payload).slice(0, 600))
  }
  return NextResponse.json(data, { status: res.status })
}

// DELETE /api/admin/products/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}?force=true`, {
    method: "DELETE",
    headers: wpHeaders(),
  })
  const data = await parseWpBody(res)
  return NextResponse.json(data, { status: res.status })
}
