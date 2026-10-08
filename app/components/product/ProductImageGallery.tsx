'use client'

import Image from 'next/image'
import type { ProductColorView } from '@/app/lib/product-colors'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X, ZoomIn } from 'lucide-react'
import { COLORS, GLASS, SOFT_IMAGE_BG_ALT } from '@/app/components/ui/designSystem'

interface Props { src: string; alt: string; colors?: ProductColorView[] }

export default function ProductImageGallery({ src, alt, colors = [] }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const selected = colors.find(color => color.id === selectedId)
  const requestedSrc = selected?.image || src
  const activeSrc = failedImage === requestedSrc ? src : requestedSrc
  const activeAlt = selected ? `${alt} — ${selected.name}` : alt
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isEn = usePathname().startsWith('/en')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      trigger?.focus()
    }
  }, [isOpen])

  return (
    <>
      <div className="product-gallery mx-auto flex h-fit w-full min-w-0 justify-center lg:sticky lg:top-28">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={isEn ? 'Enlarge product image' : 'ขยายรูปภาพสินค้า'}
          className="group relative aspect-square w-full max-w-md cursor-zoom-in overflow-hidden rounded-xl"
          style={{ ...GLASS.card, background: SOFT_IMAGE_BG_ALT }}
        >
          <Image key={activeSrc} src={activeSrc} alt={activeAlt} unoptimized={!!selected} onError={() => setFailedImage(requestedSrc)} fill priority sizes="(max-width: 639px) calc(100vw - 40px), 448px" className="object-contain" />
          <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-lg" style={GLASS.card} aria-hidden="true">
            <ZoomIn className="h-5 w-5" style={{ color: COLORS.dark }} />
          </span>
        </button>
      </div>
      {colors.length > 0 && <fieldset className="product-color-picker">
        <legend>{isEn ? 'Colour' : 'สีสินค้า'}</legend>
        <div className="product-color-options">
          <label data-selected={!selected}><input type="radio" name="product-colour" checked={!selected} onChange={() => { setSelectedId(null); setFailedImage(null) }} /><span>{isEn ? 'Main image' : 'รูปหลัก'}</span></label>
          {colors.map(color => <label key={color.id} data-selected={selected?.id === color.id}><input type="radio" name="product-colour" checked={selected?.id === color.id} onChange={() => { setSelectedId(color.id); setFailedImage(null) }} />{color.hex && <span className="product-color-dot" style={{ backgroundColor: color.hex }} aria-hidden="true" />}<span>{color.name}</span></label>)}
        </div>
        <p className="sr-only" role="status">{selected ? `${isEn ? 'Selected colour' : 'สีที่เลือก'}: ${selected.name}` : ''}</p>
        {failedImage === requestedSrc && <p className="product-color-error" role="status">{isEn ? 'This colour image is unavailable. Showing the main image.' : 'ยังแสดงรูปสีนี้ไม่ได้ ขณะนี้แสดงรูปหลัก'}</p>}
      </fieldset>}
      <dialog ref={dialogRef} className="product-image-dialog" aria-label={alt || (isEn ? 'Product image' : 'รูปภาพสินค้า')} onCancel={() => setIsOpen(false)} onClose={() => setIsOpen(false)} onClick={event => { if (event.target === event.currentTarget) setIsOpen(false) }}>
        <button type="button" autoFocus className="product-image-close" onClick={() => setIsOpen(false)} aria-label={isEn ? 'Close image' : 'ปิดรูปภาพ'}><X size={26} /></button>
        <div className="product-image-stage">
          {isOpen && <Image key={activeSrc} src={activeSrc} alt={activeAlt} unoptimized={!!selected} onError={() => setFailedImage(requestedSrc)} fill sizes="(max-width: 1200px) 100vw, 1152px" className="object-contain" />}
        </div>
      </dialog>
    </>
  )
}
