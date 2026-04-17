import Image from "next/image"

import type { ProductCardModel } from "@/types/homepage"

interface ProductGridProps {
  id: string
  title: string
  viewAllHref: string
  items: ProductCardModel[]
}

export default function ProductGrid({
  id,
  title,
  viewAllHref,
  items,
}: ProductGridProps) {
  return (
    <section id={id} className="py-[60px]">
      <div className="mx-auto max-w-[1200px] px-[20px]">
        <div className="overflow-auto">
          <h2 className="mb-[20px] text-[24px] font-bold uppercase text-[#333]">
            {title}
          </h2>
          <a href={viewAllHref} className="float-right text-[14px] font-bold uppercase text-[#777]">
            View All
          </a>
        </div>
        <div className="mt-[30px] grid grid-cols-4 gap-[20px]">
          {items.map((item) => (
            <article
              key={item.id}
              className="relative flex flex-col overflow-hidden rounded-[8px] bg-white text-center"
            >
              <a
                href={item.href}
                className="flex h-[200px] items-center justify-center bg-[#f9f9f9] p-[20px]"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1200px) 260px, 25vw"
                    className="object-contain"
                  />
                </div>
              </a>
              <div className="flex flex-grow flex-col justify-between p-[15px]">
                <div>
                  <p className="mb-[5px] text-[12px] uppercase text-[#888]">
                    {item.category || "\u00A0"}
                  </p>
                  <p className="mb-[10px] text-[15px] font-bold text-[#333]">
                    {item.name || "\u00A0"}
                  </p>
                  <p className="mb-[15px] font-bold text-[#333]">
                    {item.price || "\u00A0"}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-block w-full cursor-pointer rounded-[5px] border-none bg-[#e8f5e9] px-[20px] py-[10px] font-bold text-[#2e7d32]"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
