import type { FAQItemView } from "@/app/lib/types/view"

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
      <div className="liquid-glass-panel rounded-[1.9rem] p-7 md:p-10">
        {eyebrow ? (
          <p className="eyebrow-label">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-[var(--color-ink)] md:text-[2rem]">
          {title}
        </h2>
        <div className="mt-7 space-y-4 md:mt-8 md:space-y-5">
          {items.map((item) => (
            <details
              key={item.question}
              className="glass-panel group rounded-[1.35rem] p-5 md:p-6"
            >
              <summary className="cursor-pointer list-none pr-8 text-[1.05rem] font-semibold leading-7 text-[var(--color-ink)] marker:hidden">
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
