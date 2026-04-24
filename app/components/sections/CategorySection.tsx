import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

type Locale = "th" | "en"

interface CategorySectionProps {
  items: CategoryView[]
  locale: Locale
}

const COPY = {
  th: { headline: "IT'S YOUR\nFIRST TIME?", sub: "Explore categories!", all: "ALL CATEGORIES" },
  en: { headline: "IT'S YOUR\nFIRST TIME?", sub: "Explore categories!", all: "ALL CATEGORIES" },
} as const

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-[9px] font-bold uppercase tracking-[0.06em] text-white max-w-30 truncate">
      {label}
    </span>
  )
}

function CategoryCard({
  item,
  locale,
  className,
}: {
  item: CategoryView
  locale: Locale
  className?: string
}) {
  return (
    <Link
      href={withLocalePath(`/categories/${item.slug}`, locale)}
      className={`group relative min-h-[9.5rem] overflow-hidden rounded-[1rem] bg-[#eef6ff] ${className ?? ''}`}
    >
      {item.image?.src && (
        <Image
          src={item.image.src}
          alt={item.image.alt || item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <Badge label={item.name} />
      </div>
    </Link>
  )
}

export default function CategorySection({ items = [], locale }: CategorySectionProps) {
  if (items.length < 5) return null

  const copy = COPY[locale]
  const [hero, ...rest] = items
  const topRow = rest.slice(0, 3)   // dried fruits, supplements, drinks
  const bottomRow = rest.slice(3)   // bars, extra...

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5" aria-labelledby="cat-heading">
      <h2 id="cat-heading" className="sr-only">{copy.all}</h2>

      {/* Top grid: hero | 2 stacked | tall */}
      <div
        className="grid gap-2.5 lg:grid-cols-[2fr_1.35fr_1fr] lg:grid-rows-[210px_210px]"
      >
        {/* Hero card */}
        <Link
          href={withLocalePath(`/categories/${hero.slug}`, locale)}
          className="group relative min-h-[20.5rem] overflow-hidden rounded-[1rem] bg-[#f7e5ed] lg:col-start-1 lg:row-span-2 lg:min-h-0"
        >
          {hero.image?.src && (
            <Image
              src={hero.image.src}
              alt={hero.image.alt || hero.name}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2232]/55 via-[#1a2232]/8 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
            <div>
              <h3 className="whitespace-pre-line text-[clamp(2.1rem,5vw,3.4rem)] font-black uppercase leading-[0.92] text-white drop-shadow">
                {copy.headline}
              </h3>
              <p className="mt-2 text-md font-medium text-white/80">{copy.sub}</p>
            </div>
            <Badge label={hero.name}   />
          </div>
        </Link>

        {/* Top-middle: dried fruits */}
        {topRow[0] && (
          <CategoryCard item={topRow[0]} locale={locale} className="lg:col-start-2 lg:row-start-1 lg:min-h-0" />
        )}

        {/* Bottom-middle: supplements */}
        {topRow[1] && (
          <CategoryCard item={topRow[1]} locale={locale} className="lg:col-start-2 lg:row-start-2 lg:min-h-0" />
        )}

        {/* Right tall: drinks */}
        {topRow[2] && (
          <CategoryCard item={topRow[2]} locale={locale} className="lg:col-start-3 lg:row-span-2 lg:min-h-0" />
        )}
      </div>

      {/* Bottom row */}
      {bottomRow.length > 0 && (
        <div
          className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {bottomRow.slice(0, 3).map((item) => (
            <CategoryCard key={item.slug} item={item} locale={locale} className="min-h-44" />
          ))}
        </div>
      )}

      {/* All categories link */}
      <div className="mt-5 flex items-center gap-3">
        <Link
          href={withLocalePath("/categories", locale)}
          className="text-[11px] font-bold uppercase tracking-[0.1em] text-black"
        >
          {copy.all}
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24457c] text-[#24457c] transition-colors hover:bg-[#24457c] hover:text-white">
          <ArrowRight size={14} strokeWidth={2} />
        </div>
      </div>
    </section>
  )
}
