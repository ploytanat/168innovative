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
      <div className="overflow-hidden rounded-[1.9rem] border border-[rgba(153,184,178,0.22)] bg-[linear-gradient(150deg,rgba(255,255,255,0.96),rgba(248,241,235,0.88)_58%,rgba(231,245,242,0.76))] p-7 shadow-[0_24px_70px_rgba(26,37,53,0.06)] md:p-10">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-[var(--color-ink)] md:text-[2rem]">
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
