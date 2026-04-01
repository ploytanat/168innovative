import { NextRequest, NextResponse } from "next/server"
import { wpHeaders, WP_BASE } from "../_lib"

// POST /api/admin/upload-media
// Body: FormData with field "file"
// Returns: { id, url }
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file")

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name || "upload.jpg"
  const mimeType = file.type || "image/jpeg"

  const headers = wpHeaders()
  // WP media upload needs Content-Disposition instead of Content-Type json
  const uploadHeaders = {
    Authorization: headers.Authorization,
    "Content-Type": mimeType,
    "Content-Disposition": `attachment; filename="${filename}"`,
  }

  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: uploadHeaders,
    body: buffer,
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: text }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json({
    id: data.id,
    url: data.source_url ?? data.guid?.rendered ?? "",
  })
}
