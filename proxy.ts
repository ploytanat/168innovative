import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { resolveLegacyProductRedirect } from "@/app/lib/seo/legacy-redirects"

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname === "/index" || pathname === "/index.html") {
    return NextResponse.redirect(new URL("/", request.url), { status: 301 })
  }

  if (pathname === "/category") {
    const legacyCategoryId = searchParams.get("category")

    if (legacyCategoryId) {
      try {
        const res = await fetch(
          `https://wb.168innovative.co.th/wp-json/wp/v2/product_category/${legacyCategoryId}?_fields=slug`
        )

        if (res.ok) {
          const category = (await res.json()) as { slug?: string }

          if (category.slug) {
            return NextResponse.redirect(
              new URL(`/categories/${category.slug}`, request.url),
              { status: 301 }
            )
          }
        }
      } catch {
        // Fall through to the categories page when the legacy category lookup fails.
      }
    }

    const response = NextResponse.redirect(new URL("/categories", request.url), {
      status: 301,
    })
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
    const mappedPath = resolveLegacyProductRedirect(productSlug)

    if (mappedPath) {
      return NextResponse.redirect(new URL(mappedPath, request.url), {
        status: 301,
      })
    }

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
