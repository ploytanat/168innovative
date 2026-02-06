// app/en/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '168 Innovative | Packaging Solutions',
  description: 'Professional plastic packaging and OEM solutions',
}

// app/en/layout.tsx
export default function EnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
