import Image from "next/image"
import Link from "next/link"
import type { HeroModel, HeroPromoCard } from "@/types/homepage"

function PromoCard({ card }: { card: HeroPromoCard }) {
  return (
    <Link
      href={card.href}
      className="flex h-36 overflow-hidden rounded-lg border border-gray-300 bg-white transition-colors hover:border-gray-400"
    >
      <div className="relative aspect-square h-full shrink-0 bg-gray-50">
        <Image
          src={card.image.src}
          alt={card.image.alt}
          fill
          sizes="144px"
          className="object-contain p-3"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 leading-normal">
        <div>
          <h5 className="mb-2 text-lg font-bold tracking-tight text-heading">
            {card.label}
          </h5>
          <p className="mb-4 text-sm text-body">
            {card.exploreLabel}
          </p>
        </div>

        <div>
          <span className="inline-flex items-center rounded-base border border-gray-200 bg-neutral-secondary-medium px-4 py-2.5 text-sm font-medium leading-5 text-body shadow-xs hover:bg-neutral-tertiary-medium hover:text-heading">
            Read more
            <svg
              className="ms-1.5 h-4 w-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

interface HeroSectionProps {
  hero: HeroModel
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section style={{ backgroundColor: hero.bgColor }} className="overflow-hidden">
      <div className="mx-auto grid h-[400px] container grid-cols-[300px_1fr_210px] px-5">
        <div className="flex flex-col justify-center py-[30px] pr-[20px]">
          <h1 className="text-[72px] font-black uppercase leading-[0.92] text-[#111]">
            {hero.title}
          </h1>
          <p className="mt-[18px] max-w-[240px] text-[15px] leading-[1.5] text-[#444]">
            {hero.description}
          </p>
          <a
            href={hero.ctaHref}
            className="mt-[28px] inline-block w-fit rounded-[6px] bg-[#111] px-[24px] py-[12px] text-[13px] font-bold uppercase tracking-wide text-white hover:bg-[#333]"
          >
            {hero.ctaLabel}
          </a>
        </div>

        <div className="relative flex items-end justify-center">
          <div className="relative h-[110%] w-full">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              sizes="(min-width: 1200px) 500px, 45vw"
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {hero.promoCards.length > 0 && (
          <div className="flex flex-col justify-center gap-[12px] py-[20px] pl-[10px]">
            {hero.promoCards.map((card) => (
              <PromoCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
