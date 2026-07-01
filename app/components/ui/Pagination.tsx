import Link from "next/link"
import type { ReactNode } from "react"

import { HOME } from "@/app/components/sections/home-theme"

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

function generatePages(current: number, total: number): (number | "...")[] {
  const delta = 2
  const pages: (number | "...")[] = []

  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)

  pages.push(1)

  if (start > 2) pages.push("...")

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  if (end < total - 1) pages.push("...")

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
  const style = active
    ? { background: HOME.leaf, color: HOME.surface, borderColor: HOME.leaf }
    : { background: HOME.surface, color: HOME.ink, borderColor: HOME.line }
  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className="inline-flex min-w-9 items-center justify-center rounded border px-3 py-2 text-[13px] font-semibold transition-colors hover:border-[#4a7a1e] hover:bg-[#4a7a1e] hover:text-white"
      style={style}
    >
      {label}
    </Link>
  )
}

function DisabledBadge({ label }: { label: ReactNode }) {
  return (
    <span
      className="inline-flex min-w-9 cursor-not-allowed items-center justify-center rounded border px-3 py-2 text-[13px] font-semibold"
      style={{ background: HOME.mist, color: HOME.inkSoft, borderColor: HOME.line }}
    >
      {label}
    </span>
  )
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const pages = generatePages(currentPage, totalPages)

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {currentPage > 1 ? (
        <PageLink href={`${basePath}?page=${currentPage - 1}`} label="Previous" />
      ) : (
        <DisabledBadge label="Previous" />
      )}

      <div className="inline-flex flex-wrap items-center justify-center gap-2">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-[13px] font-semibold"
              style={{ color: HOME.inkSoft }}
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
          ),
        )}
      </div>

      {currentPage < totalPages ? (
        <PageLink href={`${basePath}?page=${currentPage + 1}`} label="Next" />
      ) : (
        <DisabledBadge label="Next" />
      )}
    </nav>
  )
}
