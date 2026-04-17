import Image from "next/image"
import Link from "next/link"
import { Package, ArrowRight } from "lucide-react"

import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

interface CategoryBarProps {
  items: CategoryView[]
  locale: Locale
  activeSlug?: string
}

const COPY = {
  th: { viewAll: "ดูทั้งหมด" },
  en: { viewAll: "View all" },
} as const

function Pill({
  name, slug, href, image, isActive,
}: {
  name: string; slug: string; href: string
  image?: { src: string; alt?: string } | null
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`
        group flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5
        text-[12px] font-semibold transition-all duration-200
        outline-none focus-visible:ring-2 focus-visible:ring-[#4c6b35] focus-visible:ring-offset-2
        ${isActive
          ? "bg-[#141412] text-white"
          : "border border-[#e3e1da] bg-white text-[#3d3d38] hover:border-[#b8c4b0] hover:bg-[#f4f6f1]"
        }
      `}
    >
      <span className={`relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full ${isActive ? "bg-white/15" : "bg-[#edf1e6]"}`}>
        {image?.src ? (
          <Image src={image.src} alt={image.alt ?? name} fill sizes="28px" className="object-cover" />
        ) : (
          <Package className="h-3.5 w-3.5" style={{ color: isActive ? "rgba(255,255,255,0.8)" : "#4c6b35" }} strokeWidth={1.8} />
        )}
      </span>
      <span className="whitespace-nowrap">{name}</span>
    </Link>
  )
}

export default function CategoryBar({ items, locale, activeSlug }: CategoryBarProps) {
  if (!items.length) return null
  const copy = COPY[locale]
  const capped = items.slice(0, 10)

  return (
    <div className="border-y border-[#e3e1da] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          aria-label={locale === "th" ? "หมวดหมู่สินค้า" : "Product categories"}
          className="flex items-center gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {capped.map((item) => (
            <Pill
              key={item.id}
              name={item.name}
              slug={item.slug}
              href={withLocalePath(`/categories/${item.slug}`, locale)}
              image={item.image}
              isActive={item.slug === activeSlug}
            />
          ))}

          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-[#e3e1da]" />

          <Link
            href={withLocalePath("/categories", locale)}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#b8c4b0] px-3.5 py-1.5 text-[12px] font-semibold text-[#4c6b35] transition-colors duration-200 hover:border-[#4c6b35] hover:bg-[#f4f6f1]"
          >
            {copy.viewAll}
            <ArrowRight className="h-3 w-3" strokeWidth={2.2} />
          </Link>
        </nav>
      </div>
    </div>
  )
}
