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
      <div className="mt-7 border-t pt-8 md:mt-8 md:pt-10" style={{ borderColor: HOME.line }}>
        {eyebrow ? (
          <p
            className="text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: HOME.mintInk }}
          >
            {eyebrow}
          </p>
        ) : null}
        <div className="mt-3 flex flex-col gap-5 md:mt-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="max-w-4xl">
            <h1
              className="font-display text-[clamp(1.9rem,1.2rem+2vw,3rem)] font-bold"
              style={{
                color: HOME.ink,
                letterSpacing: "-0.005em",
                lineHeight: 1.15,
                wordBreak: "keep-all",
                textWrap: "balance",
              }}
            >
              {title}
            </h1>
            {description ? (
              <p
                className="mt-5 max-w-3xl text-[15px] leading-[1.75] md:mt-6 md:text-[16px] lg:text-[17px]"
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
