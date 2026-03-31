"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuoteItem {
  slug: string
  categorySlug: string
  name: string
  imageSrc: string
  imageAlt: string
  moq?: string
  variantSlug?: string
}

interface QuoteContextValue {
  items: QuoteItem[]
  add: (item: QuoteItem) => void
  remove: (slug: string) => void
  clear: () => void
  has: (slug: string) => boolean
  count: number
}

// ─── Context ──────────────────────────────────────────────────────────────────

const QuoteContext = createContext<QuoteContextValue | null>(null)

const STORAGE_KEY = "quote-items"

function readStorage(): QuoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as QuoteItem[]
  } catch {}
  return []
}

function writeStorage(items: QuoteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])

  // hydrate from localStorage (client-only)
  useEffect(() => {
    setItems(readStorage())
  }, [])

  const add = useCallback((item: QuoteItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === item.slug)) return prev
      const next = [...prev, item]
      writeStorage(next)
      return next
    })
  }, [])

  const remove = useCallback((slug: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.slug !== slug)
      writeStorage(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const has = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  )

  return (
    <QuoteContext.Provider
      value={{ items, add, remove, clear, has, count: items.length }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider")
  return ctx
}
