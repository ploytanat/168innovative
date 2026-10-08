import { HOME } from "@/app/components/sections/home-theme"

type Props = {
  eyebrow?: string
  title: string
  html: string
  className?: string
}

export default function RichTextSection({
  title,
  html,
  className = "",
}: Props) {
  return (
    <section className={className}>
      <div className="border-t pt-7 md:pt-10" style={{ borderColor: HOME.line }}>
        <h2
          className="font-display mt-3 font-bold"
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
