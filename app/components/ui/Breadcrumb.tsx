'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

import {
  COLORS,
  NAV_ACTIVE_PILL_STYLE,
  NAV_SHELL_STYLE,
} from './designSystem'

export type BreadcrumbItem = {
  label: string
  href?: string
}

const TH_LABELS: Record<string, string> = {
  categories: 'หมวดสินค้า',
  products: 'สินค้า',
  about: 'เกี่ยวกับเรา',
  contact: 'ติดต่อเรา',
  articles: 'บทความ',
}

function formatLabel(segment: string, isEn: boolean) {
  if (!isEn) {
    return TH_LABELS[segment] ?? segment.replace(/-/g, ' ')
  }

  return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function Breadcrumb({ items }: { items?: BreadcrumbItem[] }) {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')

  const derivedItems =
    items ??
    pathname
      .split('/')
      .filter(Boolean)
      .filter((segment) => segment !== 'en')
      .map((segment, index, segments) => {
        const href = isEn
          ? `/en/${segments.slice(0, index + 1).join('/')}`
          : `/${segments.slice(0, index + 1).join('/')}`

        return {
          label: formatLabel(segment, isEn),
          href,
        }
      })

  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="inline-flex flex-wrap items-center gap-1.5 rounded-full px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={NAV_SHELL_STYLE}
      >
        <li>
          <Link
            href={isEn ? '/en' : '/'}
            className="rounded-full px-3 py-1.5 transition-colors"
            style={{ color: COLORS.brandMuted }}
          >
            {isEn ? 'Home' : 'หน้าหลัก'}
          </Link>
        </li>

        {derivedItems.map((item, index) => {
          const isLast = index === derivedItems.length - 1

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5" style={{ color: COLORS.hint }} strokeWidth={1.8} />
              {isLast ? (
                <span
                  className="rounded-full px-3 py-1.5"
                  style={NAV_ACTIVE_PILL_STYLE}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="rounded-full px-3 py-1.5 transition-colors"
                  style={{ color: COLORS.brandMuted }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
