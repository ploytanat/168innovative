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
      <div className="overflow-hidden rounded-[1.9rem] border border-[rgba(153,184,178,0.22)] bg-[linear-gradient(150deg,rgba(255,255,255,0.96),rgba(247,240,233,0.88)_58%,rgba(233,246,242,0.76))] p-7 shadow-[0_24px_70px_rgba(26,37,53,0.06)] md:p-10">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
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
              className="group rounded-[1.35rem] border border-[rgba(221,211,201,0.8)] bg-white/80 p-5 shadow-[0_12px_32px_rgba(26,37,53,0.04)] backdrop-blur md:p-6"
            >
              <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-[var(--color-ink)] marker:hidden">
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
