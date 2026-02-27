'use client'

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
          className="group relative w-full aspect-square overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-xl cursor-zoom-in active:scale-[0.98]"
          style={{ maxWidth: 'min(100%, 28rem)' }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay & Icon */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          
          <div className="absolute bottom-6 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-white/90 shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ZoomIn className="w-6 h-6 text-gray-800" />
          </div>
        </button>
      </div>

      {/* Modal - ใช้ Portal จะดีที่สุด แต่ในเบื้องต้นปรับปรุง Logic เดิมก่อน */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
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
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain cursor-zoom-out selection:bg-none"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}