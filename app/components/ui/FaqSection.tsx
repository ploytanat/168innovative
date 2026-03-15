import type { FAQItemView } from "@/app/lib/types/view"
import {
  COLORS,
  EYEBROW_PILL_STYLE,
  GLASS,
  SECTION_BORDER,
} from "@/app/components/ui/designSystem"

type Props = {
  eyebrow?: string
  title: string
  items?: FAQItemView[] | null
  className?: string
}

export default function FaqSection({
  eyebrow,
  title,
  items,
  className = "",
}: Props) {
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <section className={className}>
      <div className="border-t pt-7 md:pt-10" style={{ borderColor: SECTION_BORDER }}>
        {eyebrow ? (
          <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={EYEBROW_PILL_STYLE}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight md:text-[2rem]" style={{ color: COLORS.dark }}>
          {title}
        </h2>
        <div className="mt-7 space-y-4 md:mt-8 md:space-y-5">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-[1rem] p-5 md:p-6"
              style={GLASS.card}
            >
              <summary className="cursor-pointer list-none pr-8 text-[1.05rem] font-semibold leading-7 marker:hidden" style={{ color: COLORS.dark }}>
                {item.question}
              </summary>
              <div
                className="rich-content mt-4 text-base md:mt-5"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
