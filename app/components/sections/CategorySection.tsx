import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

const ArrowRightIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-5 w-5 transition-transform group-hover:translate-x-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
)

interface CategorySectionProps {
  items: CategoryView[]
  locale: "th" | "en"
}

export default function CategorySection({
  items = [],
  locale,
}: CategorySectionProps) {
  if (items.length === 0) return null

  const displayItems = items.slice(0, 6)

  return (
    <section className="relative py-14 sm:py-16 md:py-24">
      <div className="pointer-events-none absolute left-0 top-10 h-44 w-44 rounded-full bg-[rgba(46,207,196,0.1)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[rgba(248,167,184,0.12)] blur-3xl" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col items-center text-center md:mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Product Categories
          </p>
          <h2 className="font-heading mt-3 text-2xl tracking-tight text-[var(--color-ink)] sm:text-3xl md:text-5xl">
            {uiText.categories.title[locale]}
          </h2>
          <div className="mt-4 h-1.5 w-16 rounded-full bg-[var(--color-ink)]/85 sm:w-20 md:w-24" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:gap-8">
          {displayItems.map((item) => (
            <Link
              key={item.id}
              href={withLocalePath(`/categories/${item.slug}`, locale)}
              aria-label={`${uiText.categories.exploreMore[locale]} ${item.name}`}
            className="group relative overflow-hidden rounded-[2rem] border border-[rgba(205,222,241,0.78)] bg-white/86 shadow-[0_18px_44px_rgba(28,40,66,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_64px_rgba(28,40,66,0.14)]"
            >
              <div className="relative aspect-square w-full">
                {item.image?.src ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#eefbff,#fff0f5)] font-body text-sm text-[#9aa9c3]">
                    {uiText.categories.noImage[locale]}
                  </div>
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,40,66,0.04)_8%,rgba(28,40,66,0.14)_42%,rgba(28,40,66,0.82)_100%)]" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                  <h3 className="font-heading text-base text-white transition-transform duration-500 group-hover:-translate-y-1 sm:text-lg md:text-xl">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="mt-2 line-clamp-2 font-body text-[13px] leading-6 text-white/88 opacity-100 transition-all duration-500 sm:translate-y-3 sm:text-sm sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-[#d9fffa] opacity-100 transition-all duration-500 sm:text-xs sm:opacity-0 sm:group-hover:opacity-100">
                    {uiText.categories.exploreMore[locale]}
                    <ArrowRightIcon />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-16">
          <Link
            href={withLocalePath("/categories", locale)}
            className="group relative inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#2ecfc4,#8ebcf5)] px-8 py-3.5 font-body text-sm font-semibold text-white transition-all hover:brightness-105 hover:shadow-xl active:scale-95 sm:px-10 sm:py-4"
          >
            <span>{uiText.categories.viewAll[locale]}</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
