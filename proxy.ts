import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/category") {
    const response = NextResponse.redirect(
      new URL("/categories", request.url),
      { status: 301 }
    )
    return response
  }

  if (pathname === "/allcategory") {
    const response = NextResponse.redirect(
      new URL("/categories", request.url),
      { status: 301 }
    )
    return response
  }

  if (pathname.startsWith("/product/")) {
    const productSlug = pathname.replace("/product/", "")

    try {
      const res = await fetch(
        `https://wb.168innovative.co.th/api/products/slug/${productSlug}`
      )

      if (res.ok) {
        const product = await res.json()
        const categorySlug = product?.categorySlug ?? product?.category?.slug

        if (categorySlug) {
          const response = NextResponse.redirect(
            new URL(`/categories/${categorySlug}/${productSlug}`, request.url),
            { status: 301 }
          )
          return response
        }
      }
    } catch {
      // Fall through to the categories page when the legacy lookup fails.
    }

    const response = NextResponse.redirect(new URL("/categories", request.url), {
      status: 301,
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
}
