import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

const COPY = {
  th: {
    eyebrow: "สินค้าตามหมวดหมู่",
    title: "เลือกหมวดที่ต้องการ",
    viewAll: "ดูทั้งหมด",
  },
  en: {
    eyebrow: "Browse by category",
    title: "Find what you need",
    viewAll: "View all",
  },
} as const

export default function CategoryStories({
  items,
  locale,
}: {
  items: CategoryView[]
  locale: Locale
}) {
  if (!items.length) return null
  const copy = COPY[locale]
  const shown = items.slice(0, 10)

  return (
    <section className="border-b border-[#e3e1da] bg-[#fdfcf9] py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#4c6b35]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-1 font-heading text-[1.1rem] font-extrabold text-[#141412] sm:text-[1.2rem]">
              {copy.title}
            </h2>
          </div>
          <Link
            href={withLocalePath("/categories", locale)}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#4c6b35] transition-colors hover:text-[#374f26]"
          >
            {copy.viewAll}
            <ArrowRight className="h-3 w-3" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 lg:grid lg:grid-cols-10">
          {shown.map((cat) => (
            <Link
              key={cat.id}
              href={withLocalePath(`/categories/${cat.slug}`, locale)}
              className="group flex shrink-0 flex-col items-center gap-2 text-center"
            >
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full border-2 border-[#e3e1da] bg-[#f0efeb] transition-all duration-200 group-hover:border-[#4c6b35] group-hover:shadow-[0_0_0_3px_rgba(76,107,53,0.14)] sm:h-[80px] sm:w-[80px]">
                {cat.image?.src ? (
                  <Image
                    src={cat.image.src}
                    alt={cat.image.alt ?? cat.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] font-bold text-[#b0a09a]">
                    {cat.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="w-[72px] truncate text-[11px] font-semibold leading-tight text-[#3d3d38] transition-colors group-hover:text-[#4c6b35] sm:w-[80px] sm:text-[12px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
