'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { X, ZoomIn } from 'lucide-react'

interface Props {
  src: string
  alt: string
}

export default function ProductImageGallery({ src, alt }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  // ปิด Modal เมื่อกดปุ่ม Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden' // ป้องกันการ scroll พื้นหลัง
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  return (
    <>
      {/* Container หลัก */}
      <div className="lg:col-span-6 lg:sticky lg:top-32 flex justify-center h-fit mx-auto w-full px-2 sm:px-4">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="ขยายรูปภาพสินค้า"
          className="group relative w-full aspect-square cursor-zoom-in overflow-hidden rounded-[2.5rem] border border-[rgba(205,222,241,0.82)] bg-[linear-gradient(145deg,#eefbff,#fff0f5)] shadow-[0_18px_40px_rgba(28,40,66,0.08)] transition-all hover:shadow-[0_26px_55px_rgba(28,40,66,0.12)] active:scale-[0.98]"
          style={{ maxWidth: 'min(100%, 28rem)' }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 28rem"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay & Icon */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_40%,rgba(28,40,66,0.08)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="absolute bottom-6 right-6 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full border border-[rgba(205,222,241,0.92)] bg-white/90 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ZoomIn className="h-6 w-6 text-[var(--color-ink)]" />
          </div>
        </button>
      </div>

      {/* Modal - ใช้ Portal จะดีที่สุด แต่ในเบื้องต้นปรับปรุง Logic เดิมก่อน */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(157,220,246,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(248,167,184,0.18),transparent_28%),rgba(20,26,42,0.94)] p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          style={{ width: '100dvw', height: '100dvh' }}
        >
          {/* ปุ่มปิด (ปรับให้กดง่ายขึ้นและลบ text 'x' ส่วนเกินออก) */}
          <button
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110] min-w-[48px] min-h-[48px] flex items-center justify-center"
            onClick={() => setIsOpen(false)}
            aria-label="ปิดหน้าต่างขยายรูป"
          >
            <X size={32} />
          </button>

          <div
            className="relative w-[calc(100dvw-2rem)] h-[calc(100dvh-2rem)] max-w-6xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="cursor-zoom-out object-contain selection:bg-none"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
