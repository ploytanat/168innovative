import { NextRequest, NextResponse } from "next/server"
import { parseWpBody, wpHeaders, WP_BASE } from "../../_lib"

// POST /api/admin/products/bulk
// Body: { ids: number[], action: "publish" | "draft" | "delete" }
export async function POST(req: NextRequest) {
  const { ids, action } = await req.json() as { ids: number[]; action: "publish" | "draft" | "delete" }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids required" }, { status: 400 })
  }

  const results = await Promise.all(
    ids.map((id) => {
      if (action === "delete") {
        return fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}?force=true`, {
          method: "DELETE",
          headers: wpHeaders(),
        })
      }
      return fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}`, {
        method: "POST",
        headers: wpHeaders(),
        body: JSON.stringify({ status: action }),
      })
    })
  )

  const failedResponses = await Promise.all(
    results
      .filter((res) => !res.ok)
      .map(async (res) => ({ status: res.status, body: await parseWpBody(res) }))
  )

  return NextResponse.json(
    {
      ok: failedResponses.length === 0,
      total: ids.length,
      failed: failedResponses.length,
      errors: failedResponses,
    },
    { status: failedResponses.length > 0 ? 207 : 200 }
  )
}
