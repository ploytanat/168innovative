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
    <section className=" overflow-hidden  border-y border-gray-100 shadow-md py-4 md:py-4">
       <h2 className="text-2xl font-bold text-center  ">Featured Products</h2>
      <div className="mx-auto max-w-7xl bg-[#494a4b]">
       
      </div>

      <div className="group relative flex overflow-hidden p-2 cursor-pointer">
      
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-[#ffffff5a] to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-[#ffffff5a] to-transparent md:w-40" />

        <div className="flex animate-marquee gap-6 whitespace-nowrap py-4">
          {doubleItems.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="w-50 shrink-0 rounded-md border border-gray-100 p-2 bg-[#ececec93]  text-center shadow-md transition-transform hover:scale-105"
            >
              
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#f8f8f8]">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
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