import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest) {
  const { id, related_products } = await req.json()

  if (!id || !Array.isArray(related_products)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const wpBase = process.env.WP_API_URL?.replace(/\/+$/, "")
  const username = process.env.WP_USERNAME
  const password = process.env.WP_APP_PASSWORD

  if (!wpBase || !username || !password) {
    return NextResponse.json({ error: "WP credentials not configured" }, { status: 500 })
  }

  const credentials = Buffer.from(`${username}:${password}`).toString("base64")

  const res = await fetch(`${wpBase}/wp-json/wp/v2/product/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      acf: { related_products: related_products.length > 0 ? related_products : null },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: text }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
