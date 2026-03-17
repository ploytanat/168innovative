import { NextResponse } from "next/server"

import {
  getArticleSitemapEntries,
  renderSitemap,
} from "@/app/lib/sitemap-utils"

export const revalidate = 300

export async function GET() {
  const entries = await getArticleSitemapEntries()

  return new NextResponse(renderSitemap(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
