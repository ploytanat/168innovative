import type { ReactNode } from "react"

import SiteShell from "@/app/components/layout/SiteShell"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="th">{children}</SiteShell>
}
