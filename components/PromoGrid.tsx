import type { PromoModel } from "@/types/homepage"

interface PromoGridProps {
  promo: PromoModel
}

export default function PromoGrid({ promo }: PromoGridProps) {
  return (
    <section id="promo-grid" className="mx-auto max-w-[1200px] px-[20px]">
      <div className="grid grid-cols-[1.5fr_repeat(4,_1fr)_1.5fr] grid-rows-2 gap-[15px] py-[60px]">
        <div className="col-[1/2] row-[1/3] flex flex-col justify-between rounded-[8px] bg-[#fce4ec] p-[40px]">
          <div>
            <h2 className="mb-[15px] text-[28px] leading-[1.1] font-bold uppercase text-[#333]">
              {promo.leftTitle}
            </h2>
            <p className="mb-[20px] text-[14px] text-[#333]">
              {promo.leftDescription}
            </p>
          </div>
          <a
            href={promo.leftCtaHref}
            className="inline-block w-fit cursor-pointer rounded-[5px] border-none bg-[#333] px-[20px] py-[10px] font-bold text-white"
          >
            {promo.leftCtaLabel}
          </a>
        </div>
        {promo.squareItems.map((item, index) => (
          <a
            key={`${item.href}-${item.label}-${index}`}
            href={item.href}
            className="rounded-[8px] bg-[#f9f9f9]"
          >
            <div className="flex h-full w-full items-center justify-center rounded-[8px] bg-[#eee] px-[10px] text-center text-[12px] font-bold uppercase text-[#aaa]">
              {item.label}
            </div>
          </a>
        ))}
        <div className="col-[6/7] row-[1/3] flex items-end justify-center rounded-[8px] bg-[#fffde7] p-[20px] text-center">
          <a
            href={promo.rightCtaHref}
            className="inline-block cursor-pointer rounded-[5px] border-none bg-[#333] px-[20px] py-[10px] font-bold text-white"
          >
            {promo.rightCtaLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
