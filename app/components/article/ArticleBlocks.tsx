import Link from "next/link"

import type { ArticleBlockView } from "@/app/lib/types/view"

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
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#14B8A6]">
                  {block.eyebrow}
                </p>
              ) : null}
              {block.heading ? (
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#122033] md:text-[2rem]">
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
              className="article-block article-block--checklist rounded-[1.75rem] border border-[#DDE7EE] bg-[#F9FBFC] p-6 md:p-8"
            >
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#122033] md:text-[2rem]">
                {block.heading}
              </h2>
              {block.intro ? (
                <p className="mt-4 text-sm leading-7 text-[#5A6A7E] md:text-base">
                  {block.intro}
                </p>
              ) : null}
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-[1.15rem] border border-[#D8E8E5] bg-white px-4 py-3 text-sm font-medium leading-6 text-[#23414D]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )
        }

        if (block.type === "callout") {
          const styleClass =
            block.style === "warning"
              ? "border-[#F6D9AF] bg-[#FFF8ED] text-[#6F4A11]"
              : block.style === "success"
                ? "border-[#CDE9DB] bg-[#F3FBF6] text-[#1F5B3E]"
                : block.style === "note"
                  ? "border-[#E4E7F5] bg-[#F7F8FD] text-[#39467A]"
                  : "border-[#CDE7F1] bg-[#F4FAFD] text-[#204C61]"

          return (
            <section
              key={`${block.type}-${index}`}
              className={`article-block article-block--callout rounded-[1.5rem] border px-6 py-5 ${styleClass}`.trim()}
            >
              {block.heading ? (
                <h2 className="font-heading text-xl font-semibold tracking-tight">
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
              className="article-block article-block--table rounded-[1.75rem] border border-[#DDE7EE] bg-white p-6 md:p-8"
            >
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#122033] md:text-[2rem]">
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
            className={`article-block article-block--cta rounded-[1.75rem] px-6 py-7 text-center md:px-8 ${
              block.style === "soft"
                ? "border border-[#DDE7EE] bg-[#F8FBFC]"
                : block.style === "accent"
                  ? "bg-[linear-gradient(135deg,#FFF7ED_0%,#FFF1D6_100%)] text-[#6F4512]"
                  : "bg-[linear-gradient(135deg,#122033_0%,#1C314A_100%)] text-white"
            }`.trim()}
          >
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-[2rem]">
              {block.heading}
            </h2>
            {block.body ? (
              <p
                className={`mx-auto mt-4 max-w-2xl text-sm leading-7 md:text-base ${
                  block.style === "dark" ? "text-white/80" : ""
                }`.trim()}
              >
                {block.body}
              </p>
            ) : null}
            {block.buttonLabel && block.buttonUrl ? (
              <Link
                href={block.buttonUrl}
                className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold transition ${
                  block.style === "dark"
                    ? "bg-white text-[#122033] hover:bg-[#14B8A6] hover:text-white"
                    : "bg-[#122033] text-white hover:bg-[#14B8A6]"
                }`.trim()}
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
