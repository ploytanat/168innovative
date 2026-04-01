"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { useQuote } from "@/app/lib/quote/QuoteContext"

// ─── Icons ────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const TrashIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)
const DocumentIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

// ─── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  th: {
    lineLabel: "ติดต่อผ่าน LINE",
    quoteLabel: "รายการขอราคา",
    drawerTitle: "รายการขอใบเสนอราคา",
    drawerEmpty: "ยังไม่มีสินค้าในรายการ",
    drawerEmptyHint: "กดปุ่ม \"เพิ่มในรายการ\" บนสินค้าที่สนใจ",
    moqLabel: "MOQ",
    clearAll: "ล้างทั้งหมด",
    submit: "ส่งใบขอราคา",
    itemCount: (n: number) => `${n} รายการ`,
  },
  en: {
    lineLabel: "Contact via LINE",
    quoteLabel: "Quote List",
    drawerTitle: "Quote Request List",
    drawerEmpty: "No products added yet",
    drawerEmptyHint: "Click \"Add to Quote\" on any product card",
    moqLabel: "MOQ",
    clearAll: "Clear All",
    submit: "Send Quote Request",
    itemCount: (n: number) => `${n} item${n !== 1 ? "s" : ""}`,
  },
} as const

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  lineUrl: string
  locale: "th" | "en"
}

function subscribeHydration() {
  return () => {}
}

export default function FloatingActions({ lineUrl, locale }: Props) {
  const t = copy[locale]
  const { items, remove, clear, count } = useQuote()
  const [open, setOpen] = useState(false)
  const mounted = useSyncExternalStore(subscribeHydration, () => true, () => false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // close on outside click
  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [open])

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  function handleSubmit() {
    if (!items.length) return
    const productList = items.map((i) => i.name).join("|")
    const contactPath = locale === "en" ? "/en/contact" : "/contact"
    router.push(`${contactPath}?products=${encodeURIComponent(productList)}`)
    setOpen(false)
  }

  return (
    <>
      {/* ── Fixed button stack (bottom-right) ─────────────────────────── */}
      <div
        className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3 sm:right-6"
        aria-label="Quick actions"
      >
        {/* LINE button */}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.lineLabel}
          title={t.lineLabel}
          className="group flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: "#06C755" }}
        >
          {/* LINE icon — inline SVG to avoid external fetch */}
          <svg viewBox="0 0 48 48" className="h-8 w-8" fill="white">
            <path d="M24 4C12.95 4 4 11.82 4 21.48c0 6.17 3.89 11.6 9.76 14.75-.39 1.44-1.41 5.22-1.62 6.03-.26 1.01.37 1-.52.54-.89-.46-7.06-4.67-9.64-6.34C1.13 34.83 0 31.23 0 27.33 0 15.4 10.75 6 24 6s24 9.4 24 21.33c0 11.93-10.75 21.34-24 21.34-2.39 0-4.7-.3-6.86-.86l-7.38 4.09c-.52.29-1.16-.12-1.12-.71l.47-5.62C5.8 42.89 2 35.6 2 27.33" />
            <path
              fill="#06C755"
              d="M24 6c13.25 0 24 9.4 24 21.33S37.25 48.67 24 48.67c-2.47 0-4.86-.34-7.1-.97l-6.27 3.47c-.53.3-1.17-.11-1.13-.71l.4-4.8C5.62 42.55 2 35.28 2 27.33 2 15.4 10.75 6 24 6z"
            />
            <path
              fill="white"
              d="M36.9 25.07H30.3a.62.62 0 01-.62-.62v-9.64c0-.34.28-.62.62-.62h6.6c.34 0 .62.28.62.62v1.62c0 .34-.28.62-.62.62h-4.36v1.54h4.36c.34 0 .62.28.62.62v1.62c0 .34-.28.62-.62.62h-4.36v1.54h4.36c.34 0 .62.28.62.62v1.62a.62.62 0 01-.62.62zm-8.9 0h-1.62a.62.62 0 01-.62-.62v-9.64c0-.34.28-.62.62-.62H28c.34 0 .62.28.62.62v9.64a.62.62 0 01-.62.62zm-3.78 0h-6.6a.62.62 0 01-.62-.62v-9.64c0-.34.28-.62.62-.62h1.62c.34 0 .62.28.62.62v7.4h4.36c.34 0 .62.28.62.62v1.62a.62.62 0 01-.62.62zm-9.2 0h-1.62a.62.62 0 01-.62-.62v-9.64c0-.34.28-.62.62-.62H15c.34 0 .62.28.62.62v9.64a.62.62 0 01-.62.62z"
            />
          </svg>
        </a>

        {/* Quote basket button */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.quoteLabel}
          title={t.quoteLabel}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 shadow-xl transition-all duration-200 hover:scale-110 hover:bg-slate-800 active:scale-95"
        >
          <DocumentIcon />
          <span className="sr-only">{t.quoteLabel}</span>
          {/* Badge count */}
          {mounted && count > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
              aria-hidden="true"
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </div>

      {/* ── Quote Drawer ──────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.drawerTitle}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.drawerTitle}</h2>
            {mounted && count > 0 && (
              <p className="mt-0.5 text-xs text-slate-500">{t.itemCount(count)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="ปิด"
            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <DocumentIcon />
              </div>
              <p className="mt-4 font-semibold text-slate-700">{t.drawerEmpty}</p>
              <p className="mt-1.5 text-sm text-slate-400">{t.drawerEmptyHint}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  {/* Product image */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={item.imageSrc || "/placeholder.jpg"}
                      alt={item.imageAlt}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-slate-800 line-clamp-2">
                      {item.name}
                    </p>
                    {item.moq && (
                      <p className="mt-1 text-xs text-slate-500">
                        {t.moqLabel}: <span className="font-semibold text-slate-700">{item.moq}</span>
                      </p>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    aria-label="ลบออกจากรายการ"
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="space-y-2.5 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              {t.submit}
            </button>
            <button
              type="button"
              onClick={clear}
              className="w-full rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {t.clearAll}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
