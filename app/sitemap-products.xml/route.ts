import { NextResponse } from "next/server"

import {
  getProductSitemapEntries,
  renderSitemap,
} from "@/app/lib/sitemap-utils"

export const revalidate = 300

export async function GET() {
  const entries = await getProductSitemapEntries()

  return new NextResponse(renderSitemap(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
