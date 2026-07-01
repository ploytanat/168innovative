import { Plus } from "lucide-react"

import type { FAQItemView } from "@/app/lib/types/view"
import { HOME } from "@/app/components/sections/home-theme"

type Props = {
  eyebrow?: string
  title: string
  items?: FAQItemView[] | null
  className?: string
  sectionId?: string
}

export default function FaqSection({
  eyebrow,
  title,
  items,
  className = "",
  sectionId = "faq",
}: Props) {
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <section id={sectionId} className={className}>
      <div className="border-t pt-7 md:pt-10" style={{ borderColor: HOME.line }}>
        {eyebrow ? (
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: HOME.mintInk }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className="font-display mt-3 text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-bold leading-[1.2]"
          style={{ color: HOME.ink }}
        >
          {title}
        </h2>
        <ul
          className="mt-7 divide-y md:mt-8"
          style={{ borderTop: `1px solid ${HOME.line}`, borderColor: HOME.line }}
        >
          {items.map((item, index) => (
            <li key={`${item.question}-${index}`} style={{ borderBottomColor: HOME.line }}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span
                    className="text-[16px] font-semibold leading-normal sm:text-[17px]"
                    style={{ color: HOME.ink }}
                  >
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-open:rotate-45"
                    style={{ background: HOME.leaf, color: HOME.surface }}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                </summary>
                <div
                  className="rich-content mt-3 max-w-[70ch] text-[15px] leading-[1.75] sm:text-[16px]"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
