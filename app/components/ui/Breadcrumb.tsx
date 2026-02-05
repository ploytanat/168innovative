'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

const TH_LABELS: Record<string, string> = {
  categories: 'หมวดหมู่สินค้า',
  products: 'สินค้า',
  about: 'เกี่ยวกับเรา',
  contact: 'ติดต่อเรา',
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')

  // แยก path และตัด en ออก
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter(seg => seg !== 'en')

  return (
    <nav className="mb-3 " aria-label="Breadcrumb ">
      <ol className="flex items-center text-sm text-gray-500">

        {/* Home */}
        <li className="flex items-center">
          <Link
            href={isEn ? '/en' : '/'}
            className="transition-colors hover:text-gray-900"
          >
            {isEn ? 'Home' : 'หน้าหลัก'}
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1

          const href = isEn
            ? `/en/${segments.slice(0, index + 1).join('/')}`
            : `/${segments.slice(0, index + 1).join('/')}`

          const label = isEn
            ? segment.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())
            : TH_LABELS[segment] ?? segment.replace(/-/g, ' ')

          return (
            <li key={segment} className="flex items-center">
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-gray-900"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="transition-colors hover:text-gray-900"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
