import { NextRequest, NextResponse } from "next/server"
import { wpHeaders, WP_BASE } from "../../_lib"

// POST /api/admin/products/bulk
// Body: { ids: number[], action: "publish" | "draft" | "delete" }
export async function POST(req: NextRequest) {
  const { ids, action } = await req.json() as { ids: number[]; action: "publish" | "draft" | "delete" }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids required" }, { status: 400 })
  }

  const results = await Promise.allSettled(
    ids.map((id) => {
      if (action === "delete") {
        return fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}?force=true`, {
          method: "DELETE",
          headers: wpHeaders(),
        })
      }
      return fetch(`${WP_BASE}/wp-json/wp/v2/product/${id}`, {
        method: "PATCH",
        headers: wpHeaders(),
        body: JSON.stringify({ status: action }),
      })
    })
  )

  const failed = results.filter((r) => r.status === "rejected").length
  return NextResponse.json({ ok: true, total: ids.length, failed })
}
