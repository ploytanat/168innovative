"use client"

import type { ReactNode } from "react"

import { QuoteProvider } from "@/app/lib/quote/QuoteContext"
import FloatingActions from "@/app/components/ui/FloatingActions"

interface Props {
  children: ReactNode
  lineUrl: string
  locale: "th" | "en"
}

// Wraps all server-rendered children in client-side providers.
// Server components passed as `children` are still rendered on the server —
// this component only provides React Context and renders client-only UI (floats).
export default function ClientProviders({ children, lineUrl, locale }: Props) {
  return (
    <QuoteProvider>
      {children}
      <FloatingActions lineUrl={lineUrl} locale={locale} />
    </QuoteProvider>
  )
}
