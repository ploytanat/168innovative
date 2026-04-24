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
  style,
}: {
  item: CategoryView
  locale: Locale
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Link
      href={withLocalePath(`/categories/${item.slug}`, locale)}
      className={`group relative overflow-hidden rounded-2xl ${className}`}
      style={style}
    >
      {item.image?.src && (
        <Image
          src={item.image.src}
          alt={item.image.alt || item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute bottom-3 left-3">
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
    <section className="mx-auto container px-6 py-12" aria-labelledby="cat-heading">
      <h2 id="cat-heading" className="sr-only">{copy.all}</h2>

      {/* Top grid: hero | 2 stacked | tall */}
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: "2fr 1.35fr 1fr", gridTemplateRows: "210px 210px" }}
      >
        {/* Hero card */}
        <Link
          href={withLocalePath(`/categories/${hero.slug}`, locale)}
          className="group relative overflow-hidden rounded-2xl bg-neutral-200"
          style={{ gridColumn: "1", gridRow: "1 / 3" }}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div>
              <h3 className="whitespace-pre-line text-5xl font-black leading-none tracking-tight text-white drop-shadow">
                {copy.headline}
              </h3>
              <p className="mt-2 text-md font-medium text-white/80">{copy.sub}</p>
            </div>
            <Badge label={hero.name}   />
          </div>
        </Link>

        {/* Top-middle: dried fruits */}
        {topRow[0] && (
          <CategoryCard item={topRow[0]} locale={locale} style={{ gridColumn: "2", gridRow: "1" }} />
        )}

        {/* Bottom-middle: supplements */}
        {topRow[1] && (
          <CategoryCard item={topRow[1]} locale={locale} style={{ gridColumn: "2", gridRow: "2" }} />
        )}

        {/* Right tall: drinks */}
        {topRow[2] && (
          <CategoryCard item={topRow[2]} locale={locale} style={{ gridColumn: "3", gridRow: "1 / 3" }} />
        )}
      </div>

      {/* Bottom row */}
      {bottomRow.length > 0 && (
        <div
          className="mt-2.5 grid gap-2.5"
          style={{ gridTemplateColumns: `repeat(${Math.min(bottomRow.length, 3)}, 1fr)` }}
        >
          {bottomRow.slice(0, 3).map((item) => (
            <CategoryCard key={item.slug} item={item} locale={locale} className="h-44" />
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
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black transition-colors hover:bg-black hover:text-white">
          <ArrowRight size={14} strokeWidth={2} />
        </div>
      </div>
    </section>
  )
}