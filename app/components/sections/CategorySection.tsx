import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"
import {
  COLORS,
  CTA_BUTTON_STYLE,
  EYEBROW_PILL_STYLE,
  GLASS,
  SECTION_BACKGROUNDS,
  SECTION_BORDER,
  SOFT_IMAGE_BG,
  SOFT_IMAGE_BG_ALT,
} from "@/app/components/ui/designSystem"

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
    <section className="relative py-14 sm:py-16 md:py-24" style={{ background: SECTION_BACKGROUNDS.neutral }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="border-t pt-6" style={{ borderColor: SECTION_BORDER }}>
          <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={EYEBROW_PILL_STYLE}>Product Categories</p>
              <h2 className="font-heading mt-3 text-[clamp(2rem,4vw,3.8rem)] leading-[1.02]" style={{ color: COLORS.dark }}>
                {uiText.categories.title[locale]}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 sm:text-base sm:leading-8" style={{ color: COLORS.mid }}>
                {locale === "th"
                  ? "จัดหมวดสินค้าให้อ่านง่ายขึ้นแบบ deck layout เพื่อให้เลือกเส้นทางเข้าสู่คอลเลกชันที่ต้องการได้เร็ว"
                  : "A cleaner deck-style overview that makes it easier to move into the right collection quickly."}
              </p>
            </div>

            <Link
              href={withLocalePath("/categories", locale)}
              className="group inline-flex w-fit items-center gap-2 rounded-[0.95rem] px-6 py-3 font-body text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
              style={CTA_BUTTON_STYLE}
            >
              <span>{uiText.categories.viewAll[locale]}</span>
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((item, index) => {
              const imageBg = index % 2 === 0 ? SOFT_IMAGE_BG : SOFT_IMAGE_BG_ALT

              return (
                <Link
                  key={item.id}
                  href={withLocalePath(`/categories/${item.slug}`, locale)}
                  aria-label={`${uiText.categories.exploreMore[locale]} ${item.name}`}
                  className="group overflow-hidden rounded-[0.95rem] p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(32,36,43,0.08)]"
                  style={GLASS.card}
                >
                  <div className="relative aspect-[4/3.2] overflow-hidden rounded-[0.8rem]" style={{ background: imageBg }}>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(52,54,59,0.84),rgba(74,134,244,0.88),rgba(223,228,234,0.96))]" />
                  <div className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.soft }}>
                    {(index + 1).toString().padStart(2, "0")}
                  </div>

                  {item.image?.src ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs" style={{ color: COLORS.hint }}>
                      {uiText.categories.noImage[locale]}
                    </div>
                  )}
                </div>

                <div className="px-1 pb-1 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.soft }}>
                    {locale === "th" ? "คอลเลกชันสินค้า" : "Collection"}
                  </p>
                  <h3 className="font-heading mt-2 text-xl leading-tight" style={{ color: COLORS.dark }}>
                    {item.name}
                  </h3>
                  {item.description ? (
                    <p className="mt-3 line-clamp-2 text-[13px] leading-6" style={{ color: COLORS.mid }}>
                      {item.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center gap-2 border-t pt-3 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ borderColor: "rgba(30,40,60,0.10)", color: COLORS.brandMuted }}>
                    {uiText.categories.exploreMore[locale]}
                    <ArrowRightIcon />
                  </div>
                </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
