import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME, SECTION_HEADING, SECTION_PAD } from "./home-theme"

const ArrowRightIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

interface CategorySectionProps {
  items: CategoryView[]
  locale: "th" | "en"
}

export default function CategorySection({ items = [], locale }: CategorySectionProps) {
  if (items.length === 0) return null

  const displayItems = items.slice(0, 6)

  return (
    <section className={`relative ${SECTION_PAD}`} style={{ background: HOME.paper }}>
      <div className={CONTAINER}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-9" style={{ background: HOME.accent }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: HOME.accent }}>
                {locale === "th" ? "หมวดหมู่" : "Categories"}
              </span>
            </div>
            <h2
              className={`mt-4 ${SECTION_HEADING} font-bold text-[clamp(1.9rem,1.3rem+1.9vw,2.9rem)]`}
              style={{ color: HOME.ink }}
            >
              {uiText.categories.title[locale]}
            </h2>
            <p className="mt-4 text-[0.97rem] leading-[1.8]" style={{ color: HOME.inkMid }}>
              {locale === "th"
                ? "เลือกกลุ่มบรรจุภัณฑ์ที่ต้องการ แล้วเข้าสู่คอลเลกชันเต็มได้ในคลิกเดียว"
                : "Pick a packaging group and step straight into the full collection."}
            </p>
          </div>

          <Link
            href={withLocalePath("/categories", locale)}
            className="home-btn home-btn-outline group inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-5 py-3 text-[12.5px] font-semibold"
          >
            <span>{uiText.categories.viewAll[locale]}</span>
            <ArrowRightIcon />
          </Link>
        </div>

        {/* ── Grid ───────────────────────────────────────────────── */}
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {displayItems.map((item, index) => (
            <Link
              key={item.id}
              href={withLocalePath(`/categories/${item.slug}`, locale)}
              aria-label={`${uiText.categories.exploreMore[locale]} ${item.name}`}
              className="home-card group flex flex-col overflow-hidden rounded-2xl"
              style={{ border: `1px solid ${HOME.line}`, background: HOME.surface }}
            >
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{ background: `radial-gradient(circle at 74% 20%, ${HOME.accentTint} 0%, transparent 60%), ${HOME.paper}` }}
              >
                <span
                  className="absolute left-4 top-4 z-10 text-[11px] font-semibold tabular-nums"
                  style={{ color: HOME.inkSoft }}
                >
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                {item.image?.src ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs" style={{ color: HOME.inkSoft }}>
                    {uiText.categories.noImage[locale]}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: HOME.inkSoft }}>
                  {locale === "th" ? "คอลเลกชัน" : "Collection"}
                </p>
                <h3
                  className={`mt-2 ${SECTION_HEADING} font-semibold text-xl`}
                  style={{ color: HOME.ink }}
                >
                  {item.name}
                </h3>
                {item.description ? (
                  <p className="mt-2.5 line-clamp-2 text-[0.86rem] leading-[1.65]" style={{ color: HOME.inkMid }}>
                    {item.description}
                  </p>
                ) : null}

                <div
                  className="mt-4 flex items-center gap-2 border-t pt-3.5 text-[11.5px] font-semibold uppercase tracking-[0.1em]"
                  style={{ borderColor: HOME.line, color: HOME.accent }}
                >
                  {uiText.categories.exploreMore[locale]}
                  <ArrowRightIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
