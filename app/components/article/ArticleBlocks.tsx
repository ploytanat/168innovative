import Link from "next/link"

import type { ArticleBlockView } from "@/app/lib/types/view"
import { COLORS, CTA_BUTTON_STYLE, GLASS } from "@/app/components/ui/designSystem"

type Props = {
  blocks: ArticleBlockView[]
  locale: "th" | "en"
}

function blockSectionId(anchorId?: string) {
  return anchorId?.trim() || undefined
}

export default function ArticleBlocks({ blocks, locale }: Props) {
  if (!blocks.length) return null

  return (
    <div className="space-y-8 md:space-y-10">
      {blocks.map((block, index) => {
        if (block.type === "rich_text") {
          return (
            <section
              key={`${block.type}-${index}`}
              id={blockSectionId(block.anchorId)}
              className="article-block article-block--rich"
            >
              {block.eyebrow ? (
                <p className="eyebrow-label mb-3">
                  {block.eyebrow}
                </p>
              ) : null}
              {block.heading ? (
                <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-[2rem]" style={{ color: COLORS.dark }}>
                  {block.heading}
                </h2>
              ) : null}
              <div
                className={`rich-content ${block.heading ? "mt-5" : ""}`.trim()}
                dangerouslySetInnerHTML={{ __html: block.body }}
              />
            </section>
          )
        }

        if (block.type === "checklist") {
          return (
            <section
              key={`${block.type}-${index}`}
              id={blockSectionId(block.anchorId)}
              className="article-block article-block--checklist rounded-[1rem] p-6 md:p-8"
              style={GLASS.secondary}
            >
              <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-[2rem]" style={{ color: COLORS.dark }}>
                {block.heading}
              </h2>
              {block.intro ? (
                <p className="mt-4 text-sm leading-7 md:text-base" style={{ color: COLORS.mid }}>
                  {block.intro}
                </p>
              ) : null}
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-[0.9rem] px-4 py-3 text-sm font-medium leading-6"
                    style={{ ...GLASS.card, color: COLORS.mid }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )
        }

        if (block.type === "callout") {
          return (
            <section
              key={`${block.type}-${index}`}
              className="article-block article-block--callout rounded-[1rem] px-6 py-5"
              style={GLASS.stats}
            >
              {block.heading ? (
                <h2 className="font-heading text-xl font-semibold tracking-tight" style={{ color: COLORS.dark }}>
                  {block.heading}
                </h2>
              ) : null}
              <div
                className={`rich-content ${block.heading ? "mt-3" : ""}`.trim()}
                dangerouslySetInnerHTML={{ __html: block.body }}
              />
            </section>
          )
        }

        if (block.type === "comparison_table") {
          return (
            <section
              key={`${block.type}-${index}`}
              className="article-block article-block--table rounded-[1rem] p-6 md:p-8"
              style={GLASS.card}
            >
              <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-[2rem]" style={{ color: COLORS.dark }}>
                {block.heading}
              </h2>
              <div className="mt-6 overflow-x-auto">
                <table className="article-compare-table min-w-full">
                  <thead>
                      <tr>
                      <th>{locale === "th" ? "เกณฑ์" : "Criteria"}</th>
                      <th>{block.leftLabel}</th>
                      <th>{block.rightLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`${row.criterion}-${rowIndex}`}>
                        <td>{row.criterion}</td>
                        <td>{row.leftValue}</td>
                        <td>{row.rightValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        }

        return (
          <section
            key={`${block.type}-${index}`}
            className="article-block article-block--cta rounded-[1rem] px-6 py-7 text-center md:px-8"
            style={block.style === "soft" ? GLASS.card : GLASS.secondary}
          >
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-[2rem]" style={{ color: COLORS.dark }}>
              {block.heading}
            </h2>
            {block.body ? (
              <p
                className="mx-auto mt-4 max-w-2xl text-sm leading-7 md:text-base"
                style={{ color: COLORS.mid }}
              >
                {block.body}
              </p>
            ) : null}
            {block.buttonLabel && block.buttonUrl ? (
              <Link
                href={block.buttonUrl}
                className="mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white transition"
                style={CTA_BUTTON_STYLE}
              >
                {block.buttonLabel}
              </Link>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
