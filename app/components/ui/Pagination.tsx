'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  COLORS,
  GLASS,
  NAV_ACTIVE_PILL_STYLE,
  NAV_SHELL_STYLE,
} from '@/app/components/ui/designSystem'

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

function generatePages(current: number, total: number): (number | '...')[] {
  const delta = 2
  const pages: (number | '...')[] = []

  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)

  pages.push(1)

  if (start > 2) pages.push('...')

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  if (end < total - 1) pages.push('...')

  if (total > 1) pages.push(total)

  return pages
}

function PageLink({
  href,
  label,
  active = false,
}: {
  href: string
  label: ReactNode
  active?: boolean
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={active ? 'page' : undefined}
      className="inline-flex min-w-10 items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold transition-all"
      style={
        active
          ? NAV_ACTIVE_PILL_STYLE
          : {
              ...GLASS.card,
              color: COLORS.brandMuted,
            }
      }
    >
      {label}
    </Link>
  )
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const pages = generatePages(currentPage, totalPages)

  return (
    <nav
      className="mt-14 flex flex-wrap items-center justify-center gap-2.5"
      aria-label="Pagination"
    >
      {currentPage > 1 ? (
        <PageLink href={`${basePath}?page=${currentPage - 1}`} label="Previous" />
      ) : (
        <span
          className="inline-flex min-w-10 cursor-not-allowed items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold"
          style={{ ...GLASS.stats, color: COLORS.hint }}
        >
          Previous
        </span>
      )}

      <div
        className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full px-2 py-2"
        style={NAV_SHELL_STYLE}
      >
        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-xs font-semibold"
              style={{ color: COLORS.hint }}
            >
              ...
            </span>
          ) : (
            <PageLink
              key={page}
              href={`${basePath}?page=${page}`}
              label={page}
              active={page === currentPage}
            />
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <PageLink href={`${basePath}?page=${currentPage + 1}`} label="Next" />
      ) : (
        <span
          className="inline-flex min-w-10 cursor-not-allowed items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold"
          style={{ ...GLASS.stats, color: COLORS.hint }}
        >
          Next
        </span>
      )}
    </nav>
  )
}
