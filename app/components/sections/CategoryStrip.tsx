import Image from "next/image"
import Link from "next/link"

import type { CategoryView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

import { CONTAINER, HOME } from "./home-theme"

type Locale = "th" | "en"

export default function CategoryStrip({ items, locale }: { items: CategoryView[]; locale: Locale }) {
  const visible = items.slice(0, 5)
  if (visible.length === 0) return null

  return (
    <section className="relative" style={{ background: HOME.surface }}>
      <div className={`${CONTAINER} -mt-4 pb-12 sm:-mt-6 sm:pb-16`}>
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-5 sm:gap-4 sm:px-0 sm:overflow-visible">
          {visible.map(cat => (
            <li key={cat.id} className="shrink-0 snap-start" style={{ width: "min(36vw, 200px)" }}>
              <Link
                href={withLocalePath(`/categories/${cat.slug}`, locale)}
                className="group block"
              >
                <div
                  className="relative aspect-square w-full overflow-hidden rounded-lg transition-transform duration-300 group-hover:-translate-y-1.5"
                  style={{
                    background: HOME.mintSoft,
                    border: `1px solid ${HOME.line}`,
                  }}
                >
                  {cat.image?.src ? (
                    <Image
                      src={cat.image.src}
                      alt={cat.image.alt || cat.name}
                      fill
                      sizes="(max-width:640px) 36vw, 200px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-full w-full items-center justify-center text-3xl font-bold"
                      style={{ color: HOME.mintInk }}
                    >
                      {cat.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p
                  className="mt-3 text-center text-[14px] font-semibold transition-colors sm:text-[15px]"
                  style={{ color: HOME.ink }}
                >
                  {cat.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
