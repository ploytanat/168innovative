// components/sections/ProductMarquee.tsx
import Image from 'next/image'
import { ProductView } from '@/app/lib/types/view'

export default function ProductMarquee({
  items = [],
}: {
  items: ProductView[]
}) {
  if (!items.length) return null

  // Duplicate items เพื่อให้ Loop ไหลลื่น
  const doubleItems = [...items, ...items, ...items, ...items]

  return (
    <section className="overflow-hidden bg-white/50 py-8 md:py-8">
      <div className="mx-auto max-w-7xl px-4 mb-10">
        <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
      </div>

      <div className="group relative flex overflow-hidden p-2 cursor-pointer">
        {/* Shadow Overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent md:w-40" />

        <div className="flex animate-marquee gap-6 whitespace-nowrap py-4">
          {doubleItems.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="w-[200px] shrink-0 rounded-[2.5rem] border border-gray-100 bg-white p-3 text-center shadow-md transition-transform hover:scale-105"
            >
              {/* IMAGE DIV: ปรับให้รูปเต็มพื้นที่ */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-[#f8f8f8]">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  // เปลี่ยนเป็น object-cover เพื่อให้รูปเต็ม div
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="mt-4 p-1">
                <p className="text-[11px] font-bold text-gray-800 line-clamp-1">
                  {item.name}
                </p>
               
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}