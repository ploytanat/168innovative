'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const gallery = images.length > 0 ? images : ['/placeholder.jpg']
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const activeImage =
    selectedImage && gallery.includes(selectedImage) ? selectedImage : gallery[0]

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <Image
          src={activeImage}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {gallery.map((image) => {
          const isActive = image === activeImage

          return (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(image)}
              className="relative aspect-square overflow-hidden rounded-2xl border bg-white transition"
              style={{
                borderColor: isActive ? '#0f172a' : '#cbd5e1',
              }}
            >
              <Image
                src={image}
                alt={`${name} thumbnail`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
