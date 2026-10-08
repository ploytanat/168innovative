import type { ReactNode } from "react"

import Breadcrumb, { type BreadcrumbItem } from "@/app/components/ui/Breadcrumb"
import { HOME } from "@/app/components/sections/home-theme"

type Props = {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  className?: string
}

export default function PageIntro({
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
}: Props) {
  return (
    <header className={`brand-page-intro pt-6 md:pt-8 ${className}`.trim()}>
      <Breadcrumb items={breadcrumbs} />
      <div className="mt-7 border-t pt-8 md:mt-8 md:pt-10" style={{ borderColor: HOME.line }}>
        <div className="mt-3 flex flex-col gap-5 md:mt-4 lg:flex-row lg:items-end md:justify-between md:gap-8">
          <div className="min-w-0 max-w-4xl">
            <h1
              className="font-display font-bold"
              style={{
                color: HOME.ink,
                wordBreak: "normal",
                overflowWrap: "anywhere",
                textWrap: "balance",
              }}
            >
              {title}
            </h1>
            {description ? (
              <p
                className="mt-5 max-w-3xl md:mt-6"
                style={{ color: HOME.inkMid }}
              >
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="shrink-0 pt-1 md:pt-0">{actions}</div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
