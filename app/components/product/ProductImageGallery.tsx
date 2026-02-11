'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

interface Props {
  src: string
  alt: string
}

export default function ProductImageGallery({ src, alt }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 1:1 Product Image */}
      <div className="lg:col-span-6 lg:sticky lg:top-32 flex justify-center">
        <div
          onClick={() => setIsOpen(true)}
          className="group relative w-full max-w-md aspect-square overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl cursor-zoom-in"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500" />

          {/* Zoom Icon */}
          <div className="absolute bottom-6 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-white/90 shadow-md backdrop-blur-md transition duration-300 group-hover:scale-110">
            <ZoomIn className="w-6 h-6 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition z-[110]"
            onClick={() => setIsOpen(false)}
          >x
            <X size={40} />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              quality={100}
              className="object-contain cursor-zoom-out"
            />
          </div>
        </div>
      )}
    </>
  )
}
