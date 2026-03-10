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
      <div className="overflow-hidden rounded-[1.75rem] border border-[#E3EAF1] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.04)] md:p-10">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#14B8A6]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-[#1A2535] md:text-[2rem]">
          {title}
        </h2>
        <div className="mt-7 space-y-4 md:mt-8 md:space-y-5">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-[1.25rem] border border-[#E3EAF1] bg-[#F8FAFC] p-5 md:p-6"
            >
              <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-[#1A2535] marker:hidden">
                {item.question}
              </summary>
              <div
                className="rich-content mt-4 text-sm md:mt-5"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
