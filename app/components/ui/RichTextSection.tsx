import { HOME } from "@/app/components/sections/home-theme"

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
        <div
          className="rich-content mt-7 max-w-[72ch] md:mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  )
}
