import type { ReactNode } from "react"

import Breadcrumb, { type BreadcrumbItem } from "@/app/components/ui/Breadcrumb"
import { COLORS, EYEBROW_PILL_STYLE, SECTION_BORDER } from "@/app/components/ui/designSystem"

type Props = {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  className?: string
}

export default function PageIntro({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
}: Props) {
  return (
    <header className={`pt-6 md:pt-8 ${className}`.trim()}>
      <Breadcrumb items={breadcrumbs} />
      <div className="mt-7 border-t pt-8 md:mt-8 md:pt-10" style={{ borderColor: SECTION_BORDER }}>
        {eyebrow ? (
          <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={EYEBROW_PILL_STYLE}>
            {eyebrow}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-5 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="max-w-4xl">
            <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-6xl" style={{ color: COLORS.dark }}>
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-3xl text-[1rem] leading-8 md:mt-6 md:text-[1.05rem]" style={{ color: COLORS.mid }}>
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="shrink-0 pt-1 md:pt-0">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
