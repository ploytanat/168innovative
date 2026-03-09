'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export default function Breadcrumb() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== 'en')

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#E6DED6] bg-white/80 px-4 py-2 text-[11px] font-medium text-[#8A7E74] shadow-sm backdrop-blur">
        <li>
          <Link
            href={isEn ? '/en' : '/'}
            className="transition-colors hover:text-[#1A2535]"
          >
            {isEn ? 'Home' : 'หน้าหลัก'}
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = isEn
            ? `/en/${segments.slice(0, index + 1).join('/')}`
            : `/${segments.slice(0, index + 1).join('/')}`

          const label = formatLabel(segment, isEn)

          return (
            <li key={`${segment}-${index}`} className="inline-flex items-center gap-2">
              <ChevronRightIcon />
              {isLast ? (
                <span className="font-semibold text-[#1A2535]" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="transition-colors hover:text-[#1A2535]"
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
