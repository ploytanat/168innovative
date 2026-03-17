import { NextResponse } from "next/server"

import {
  getSitemapIndexItems,
  renderSitemapIndex,
} from "@/app/lib/sitemap-utils"

export const revalidate = 300

export async function GET() {
  const items = await getSitemapIndexItems()

  return new NextResponse(renderSitemapIndex(items), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
