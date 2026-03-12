'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type BreadcrumbItem = {
  label: string
  href?: string
}

const ChevronRightIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-3.5 w-3.5 text-[#B7ABA0]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 5l7 7-7 7"
    />
  </svg>
)

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
      <ol className="liquid-glass-pill inline-flex flex-wrap items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-medium text-[#66748a]">
        <li>
          <Link
            href={isEn ? '/en' : '/'}
            className="transition-colors hover:text-[#1A2535]"
          >
            {isEn ? 'Home' : 'หน้าหลัก'}
          </Link>
        </li>

        {derivedItems.map((item, index) => {
          const isLast = index === derivedItems.length - 1

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              <ChevronRightIcon />
              {isLast ? (
                <span className="font-semibold text-[#1A2535]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="transition-colors hover:text-[#1A2535]"
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
