// app/api/revalidate/route.ts
//
// WordPress webhook — call this URL on post publish/update
// to instantly clear the relevant cache tag.
//
// Setup in WordPress:
//   Plugin: WP Webhooks or custom action hook
//   POST to: https://your-domain.com/api/revalidate
//   Body: { "secret": "YOUR_SECRET", "tag": "products" }
//
// Available tags: "products" | "categories"

import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!SECRET || body.secret !== SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tag = body.tag as string
    if (!['products', 'categories'].includes(tag)) {
      return NextResponse.json({ error: 'Invalid tag' }, { status: 400 })
    }

    revalidateTag(tag,'defaul')

    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}