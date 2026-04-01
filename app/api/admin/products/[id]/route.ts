import { NextRequest, NextResponse } from "next/server"
import { wpHeaders, WP_BASE } from "../../_lib"
import { buildWPProductPayload } from "../route"

// PATCH /api/admin/products/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${params.id}`, {
    method: "PATCH",
    headers: wpHeaders(),
    body: JSON.stringify(buildWPProductPayload(body)),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

// DELETE /api/admin/products/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/product/${params.id}?force=true`, {
    method: "DELETE",
    headers: wpHeaders(),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
