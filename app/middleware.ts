// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'th']
const defaultLocale = 'th' // ตั้งไทยเป็นหลัก

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // เช็คว่า pathname มี locale นำหน้าหรือยัง
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // ถ้าไม่มี locale และไม่ใช่ภาษาอังกฤษ ให้รันแบบภาษาไทย (Default)
  // แต่ถ้าคุณต้องการให้ URL ภาษาอังกฤษต้องมี /en เสมอ:
  if (defaultLocale === 'th' && !pathnameHasLocale) {
    // เราจะไม่ redirect ไปที่ /th แต่จะให้มัน render ภาษาไทยที่ path ปกติเลย
    const url = request.nextUrl.clone()
    url.pathname = `/th${pathname}`
    return NextResponse.rewrite(url)
  }
}

export const config = {
  matcher: [
    // ข้ามไฟล์ที่ไม่เกี่ยวข้อง เช่น api, _next, static
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
}