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

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: Props) {
  if (totalPages <= 1) return null

  const pages = generatePages(currentPage, totalPages)

  return (
    <nav className="mt-16 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Prev
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-sm text-slate-400">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={`${basePath}?page=${p}`}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              p === currentPage
                ? "border-[#14B8A6] bg-[#14B8A6] text-white"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Next
        </Link>
      )}
    </nav>
  )
}