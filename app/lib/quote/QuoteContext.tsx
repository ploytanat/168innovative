"use client"

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
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
const EMPTY_ITEMS: QuoteItem[] = []

let cachedRawQuoteItems: string | null | undefined
let cachedQuoteItems: QuoteItem[] = EMPTY_ITEMS

function readStorage(): QuoteItem[] {
  if (typeof window === "undefined") {
    return EMPTY_ITEMS
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (raw === cachedRawQuoteItems) {
      return cachedQuoteItems
    }

    cachedRawQuoteItems = raw
    cachedQuoteItems = raw ? (JSON.parse(raw) as QuoteItem[]) : EMPTY_ITEMS
    return cachedQuoteItems
  } catch {}
  cachedRawQuoteItems = null
  cachedQuoteItems = EMPTY_ITEMS
  return EMPTY_ITEMS
}

function notifyQuoteChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event("quote:changed"))
}

function writeStorage(items: QuoteItem[]) {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleChange = () => onStoreChange()
  window.addEventListener("storage", handleChange)
  window.addEventListener("quote:changed", handleChange)

  return () => {
    window.removeEventListener("storage", handleChange)
    window.removeEventListener("quote:changed", handleChange)
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function QuoteProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readStorage, readStorage)

  const add = useCallback((item: QuoteItem) => {
    const current = readStorage()
    if (current.some((entry) => entry.slug === item.slug)) {
      return
    }

    writeStorage([...current, item])
    notifyQuoteChanged()
  }, [])

  const remove = useCallback((slug: string) => {
    const next = readStorage().filter((item) => item.slug !== slug)
    writeStorage(next)
    notifyQuoteChanged()
  }, [])

  const clear = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    notifyQuoteChanged()
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
