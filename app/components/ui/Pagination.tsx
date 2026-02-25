// app/components/ui/Pagination.tsx

import Link from "next/link"

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

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (end < total - 1) pages.push("...")

  if (total > 1) pages.push(total)

  return pages
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const pages = generatePages(currentPage, totalPages)

  return (
    <nav
      className="mt-16 flex flex-wrap items-center justify-center gap-2"
      aria-label="การแบ่งหน้า"
    >
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#14B8A6] hover:text-[#14B8A6]"
        >
          ← ก่อนหน้า
        </Link>
      ) : (
        <span className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-300 cursor-not-allowed">
          ← ก่อนหน้า
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={`${basePath}?page=${p}`}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-all ${
              p === currentPage
                ? "border-[#14B8A6] bg-[#14B8A6] text-white shadow-[#14B8A6]/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#14B8A6] hover:text-[#14B8A6]"
            }`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#14B8A6] hover:text-[#14B8A6]"
        >
          ถัดไป →
        </Link>
      ) : (
        <span className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-300 cursor-not-allowed">
          ถัดไป →
        </span>
      )}
    </nav>
  )
}