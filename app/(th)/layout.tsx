import "@/app/globals.css"

import RootDocument from "@/app/components/layout/RootDocument"
import SiteShell from "@/app/components/layout/SiteShell"
import { siteRootMetadata, rootViewport } from "@/app/config/root-metadata"

export const metadata = siteRootMetadata
export const viewport = rootViewport

export default async function ThaiRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootDocument lang="th">
      <SiteShell locale="th">{children}</SiteShell>
    </RootDocument>
  )
}
