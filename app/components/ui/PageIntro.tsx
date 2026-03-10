import type { ReactNode } from "react"

import Breadcrumb, { type BreadcrumbItem } from "@/app/components/ui/Breadcrumb"

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
      <div className="mt-7 border-b border-[#E5E7EB] pb-12 md:mt-8 md:pb-14">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#14B8A6]">
            {eyebrow}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-5 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#1A2535] md:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5A6A7E] md:mt-6 md:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0 pt-1 md:pt-0">{actions}</div> : null}
        </div>
      </div>
    </header>
  )
}
