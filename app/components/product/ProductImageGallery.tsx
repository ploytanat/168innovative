'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { X, ZoomIn } from 'lucide-react'
import {
  COLORS,
  GLASS,
  PAGE_BG,
  SOFT_IMAGE_BG_ALT,
} from '@/app/components/ui/designSystem'

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
          className="group relative w-full aspect-square cursor-zoom-in overflow-hidden rounded-[1.1rem] transition-all hover:shadow-[0_14px_28px_rgba(32,36,43,0.06)] active:scale-[0.98]"
          style={{ ...GLASS.card, background: SOFT_IMAGE_BG_ALT, maxWidth: 'min(100%, 28rem)' }}
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
          
          <div
            className="absolute bottom-6 right-6 flex h-12 w-12 translate-y-2 items-center justify-center rounded-[0.85rem] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            style={GLASS.card}
          >
            <ZoomIn className="h-6 w-6" style={{ color: COLORS.dark }} />
          </div>
        </button>
      </div>

      {/* Modal - ใช้ Portal จะดีที่สุด แต่ในเบื้องต้นปรับปรุง Logic เดิมก่อน */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          style={{ width: '100dvw', height: '100dvh', background: PAGE_BG }}
        >
          {/* ปุ่มปิด (ปรับให้กดง่ายขึ้นและลบ text 'x' ส่วนเกินออก) */}
          <button
            className="absolute right-6 top-6 z-[110] flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[0.85rem] p-2 transition-all"
            onClick={() => setIsOpen(false)}
            aria-label="ปิดหน้าต่างขยายรูป"
            style={{ ...GLASS.card, color: COLORS.mid }}
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
