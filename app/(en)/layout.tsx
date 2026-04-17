import "@/app/globals.css"

import RootDocument from "@/app/components/layout/RootDocument"
import { siteRootMetadata, rootViewport } from "@/app/config/root-metadata"

export const metadata = siteRootMetadata
export const viewport = rootViewport

export default function EnglishRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootDocument lang="en">
      {children}
    </RootDocument>
  )
}
