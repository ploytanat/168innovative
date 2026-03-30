"use client"

import Image from "next/image"
import { useState } from "react"

import type { ImageView } from "@/app/lib/types/view"

interface Props {
  images: ImageView[]
  name: string
}

export default function CatalogDetailGallery({ images, name }: Props) {
  const gallery = images.length > 0 ? images : [{ src: "/placeholder.jpg", alt: name }]
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const activeImage =
    selectedImage && gallery.some((image) => image.src === selectedImage)
      ? gallery.find((image) => image.src === selectedImage) ?? gallery[0]
      : gallery[0]

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {gallery.map((image, index) => {
          const isActive = image.src === activeImage.src

          return (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image.src)}
              className="relative aspect-square overflow-hidden rounded-2xl border bg-white transition"
              style={{
                borderColor: isActive ? "#0f172a" : "#cbd5e1",
              }}
            >
              <Image
                src={image.src}
                alt={`${image.alt || name} thumbnail`}
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
