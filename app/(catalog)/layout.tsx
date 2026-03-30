import '@/app/globals.css'

import type { Metadata } from 'next'

import RootDocument from '@/app/components/layout/RootDocument'

export const metadata: Metadata = {
  title: 'Product Catalog',
  description: 'B2B product catalog system',
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootDocument lang="en">
      <div className="min-h-screen">{children}</div>
    </RootDocument>
  )
}
