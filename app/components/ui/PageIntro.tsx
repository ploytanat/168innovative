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
      <div className="mt-7 overflow-hidden rounded-[2rem] border border-[rgba(153,184,178,0.24)] bg-[linear-gradient(140deg,rgba(255,255,255,0.96),rgba(246,239,231,0.92)_52%,rgba(224,245,240,0.84))] px-6 py-8 shadow-[0_24px_70px_rgba(26,37,53,0.07)] md:mt-8 md:px-8 md:py-10 lg:px-10">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <div className="mt-4 flex flex-col gap-5 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="max-w-4xl">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--color-ink)] md:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--color-ink-soft)] md:mt-6 md:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="shrink-0 pt-1 md:pt-0">
              <div className="rounded-full border border-white/60 bg-white/80 p-1 shadow-[0_16px_40px_rgba(26,37,53,0.08)] backdrop-blur">
                {actions}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
