import {
  COLORS,
  EYEBROW_PILL_STYLE,
  GLASS,
  SECTION_BORDER,
} from "@/app/components/ui/designSystem"

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
      <div className="border-t pt-7 md:pt-10" style={{ borderColor: SECTION_BORDER }}>
        {eyebrow ? (
          <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={EYEBROW_PILL_STYLE}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight md:text-[2rem]" style={{ color: COLORS.dark }}>
          {title}
        </h2>
        <div className="mt-7 rounded-[1rem] p-6 md:mt-8 md:p-8" style={GLASS.card}>
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </section>
  )
}
