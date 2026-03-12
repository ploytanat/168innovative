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
      <div className="liquid-glass-panel mt-7 rounded-[2rem] px-6 py-8 md:mt-8 md:px-8 md:py-10 lg:px-10">
        {eyebrow ? (
          <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-5 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="max-w-4xl">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--color-ink)] md:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-ink-soft)] md:mt-6 md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="shrink-0 pt-1 md:pt-0">
              <div className="liquid-glass-pill rounded-full p-1">
                {actions}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
