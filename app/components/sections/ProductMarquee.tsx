// components/sections/ProductMarquee.tsx
import Image from 'next/image'
import { ProductView } from '@/app/lib/types/content'

export default function ProductMarquee({
  items = [],
}: {
  items: ProductView[]
}) {
  if (!items.length) return null

  return (
    <section className="overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-lg font-semibold">
          Featured Products
        </h2>
      </div>

      {/* marquee */}
      <div className="relative">
        <div className="marquee flex w-max gap-6">
          {[...items, ...items].map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="w-[180px] shrink-0 rounded-xl border bg-white p-4 text-center shadow-sm"
            >
              <div className="relative mx-auto h-24">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-xs">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
