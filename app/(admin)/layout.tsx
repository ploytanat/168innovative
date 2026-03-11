import "@/app/globals.css"

import RootDocument from "@/app/components/layout/RootDocument"
import { adminRootMetadata, rootViewport } from "@/app/config/root-metadata"

export const metadata = adminRootMetadata
export const viewport = rootViewport

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootDocument lang="en">{children}</RootDocument>
}
