type Props = {
  eyebrow?: string
  title: string
  html: string
  className?: string
}

export default function RichTextSection({
  eyebrow,
  title,
  html,
  className = "",
}: Props) {
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
        <div
          className="rich-content mt-7 md:mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  )
}
