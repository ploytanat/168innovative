'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

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
      className={`inline-flex min-w-10 items-center justify-center rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${
        active
          ? 'border-[#1A2535] bg-[#1A2535] text-white shadow-[0_12px_28px_rgba(26,37,53,0.16)]'
          : 'border-[#E1D8CF] bg-white/82 text-[#6B625C] hover:border-[var(--color-accent)] hover:text-[#1A2535] backdrop-blur'
      }`}
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
        <span className="inline-flex min-w-10 cursor-not-allowed items-center justify-center rounded-full border border-[#EEE7E0] bg-[#F7F3EE]/90 px-3.5 py-2 text-xs font-semibold text-[#B8ADA2]">
          Previous
        </span>
      )}

      <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[rgba(221,211,201,0.85)] bg-white/82 px-2 py-2 shadow-[0_16px_36px_rgba(26,37,53,0.06)] backdrop-blur">
        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-xs font-semibold text-[#BAAEA3]"
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
        <span className="inline-flex min-w-10 cursor-not-allowed items-center justify-center rounded-full border border-[#EEE7E0] bg-[#F7F3EE]/90 px-3.5 py-2 text-xs font-semibold text-[#B8ADA2]">
          Next
        </span>
      )}
    </nav>
  )
}
