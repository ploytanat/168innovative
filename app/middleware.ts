import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /category?category=xxx → /categories
  if (pathname === "/category") {
    return NextResponse.redirect(new URL("/categories", request.url), { status: 301 })
  }

  // /allcategory → /categories
  if (pathname === "/allcategory") {
    return NextResponse.redirect(new URL("/categories", request.url), { status: 301 })
  }

  // /product/:productSlug → /categories/:categorySlug/:productSlug
  if (pathname.startsWith("/product/")) {
    const productSlug = pathname.replace("/product/", "")

    try {
      // ปรับ endpoint ให้ตรงกับ API จริงของคุณ
      const res = await fetch(
        `https://wb.168innovative.co.th/api/products/slug/${productSlug}`,
        { next: { revalidate: 3600 } } // cache 1 ชั่วโมง ไม่ช้า
      )

      if (res.ok) {
        const product = await res.json()
        // ปรับ field name ให้ตรงกับ response จริง
        const categorySlug = product?.categorySlug ?? product?.category?.slug

        if (categorySlug) {
          return NextResponse.redirect(
            new URL(`/categories/${categorySlug}/${productSlug}`, request.url),
            { status: 301 }
          )
        }
      }
    } catch {
      // API ล้มเหลว → fallback
    }

    // fallback ถ้าหา category ไม่เจอ
    return NextResponse.redirect(new URL("/categories", request.url), { status: 301 })
  }
}

export const config = {
  matcher: ["/product/:path*", "/category", "/allcategory"],
}