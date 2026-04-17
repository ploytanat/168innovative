import Image from "next/image"
import Link from "next/link"
import type { HeroModel, HeroPromoCard } from "@/types/homepage"

function ArrowIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
        d="M5 12h14m-7-7 7 7-7 7"
      />
    </svg>
  )
}

function getBadgeClasses(variant: HeroPromoCard["badgeVariant"]) {
  if (variant === "sale") {
    return "bg-[#b55b4f] text-white"
  }

  if (variant === "hot") {
    return "bg-[#8d6238] text-white"
  }

  return "bg-[#1d1f22] text-white"
}

function PromoCard({ card }: { card: HeroPromoCard }) {
  return (
    <Link
      href={card.href}
      className="group relative flex items-center gap-3 overflow-hidden rounded-[13px] border border-black/8 bg-white px-3 py-3 transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:translate-x-1 hover:border-black/15 hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.13)]"
    >
      <span className="absolute left-0 top-0 h-0 w-[3px] rounded-bl-[13px] bg-[#1d1f22] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:h-full" />

      <div
        className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
        style={{ backgroundColor: `${card.bgColor}12` }}
      >
        <Image
          src={card.image.src}
          alt={card.image.alt}
          width={46}
          height={46}
          className="h-full w-full object-contain p-2 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[11.5px] font-bold tracking-[-0.01em] text-[#111]">
          {card.label}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[9px] leading-none">
          <span className="font-semibold uppercase tracking-[0.12em] text-[#8d6238]">
            {card.exploreLabel}
          </span>
          {card.metaLabel ? <span className="text-[#9a958e]">{card.metaLabel}</span> : null}
        </div>
        {card.price ? (
          <div className="mt-1.5 text-[12px] font-bold text-[#111]">
            {card.price}
            {card.priceOld ? (
              <span className="ml-1 text-[10px] font-normal text-[#b8b1a9] line-through">
                {card.priceOld}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {card.badge ? (
        <span
          className={`absolute right-2 top-2 rounded-[4px] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.07em] ${getBadgeClasses(card.badgeVariant)}`}
        >
          {card.badge}
        </span>
      ) : null}

      <span className="absolute bottom-2.5 right-2.5 translate-x-[-5px] text-[#111] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <ArrowIcon className="h-[11px] w-[11px]" />
      </span>
    </Link>
  )
}

interface HeroSectionProps {
  hero: HeroModel
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const titleLines = hero.title
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  const hasPromoCards = hero.promoCards.length > 0
  const shellClassName = hasPromoCards
    ? "grid w-full overflow-hidden lg:h-[400px] lg:grid-cols-[260px_minmax(0,1fr)_210px] "
    : "grid w-full overflow-hidden lg:h-[400px] lg:grid-cols-[260px_minmax(0,1fr)]"

  return (
    <section className="py-4">
      <div className={shellClassName}  style={{ backgroundColor: hero.bgColor }}>
        <div className=" order-2 flex flex-col justify-center px-6 pb-8 pt-2 sm:px-8 lg:order-1 lg:px-5 lg:py-9 xl:pl-8 xl:pr-5">
          {hero.eyebrow ? (
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#807a73]">
              <span className="inline-block h-px w-[18px] bg-[#807a73]" />
              <span>{hero.eyebrow}</span>
              <span className="inline-block h-px w-[18px] bg-[#807a73]" />
            </div>
          ) : null}

          <h1 className="text-[clamp(2.8rem,8vw,3.875rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-[#111]">
            {titleLines.length > 0
              ? titleLines.map((line, index) => (
                  <span
                    key={`${line}-${index}`}
                    className={`block ${index === titleLines.length - 1 && titleLines.length > 1 ? "text-[#58524b]" : ""}`}
                  >
                    {line}
                  </span>
                ))
              : hero.title}
          </h1>

          <p className="mt-4 max-w-[26ch] text-[12.5px] leading-[1.65] text-[#666] sm:text-[13px]">
            {hero.description}
          </p>

          <Link
            href={hero.ctaHref}
            className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#111] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors duration-150 hover:bg-[#333] sm:w-fit"
          >
            <span>{hero.ctaLabel}</span>
            <ArrowIcon />
          </Link>
        </div>

        <div className="order-1 relative flex min-h-[280px] items-end justify-center overflow-hidden px-5 pt-6 sm:min-h-[340px] sm:px-8 lg:order-2 lg:min-h-0 lg:px-0 lg:pt-0">
          <div
            className="absolute bottom-[-64px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full"
            style={{ backgroundColor: `${hero.bgColor}aa` }}
          />

          {hero.centerTag ? (
            <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#111] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
              {hero.centerTag}
            </div>
          ) : null}

          <div className="relative z-[1] h-[115%] w-full">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              sizes="(min-width: 1024px) 38vw, 90vw"
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {hasPromoCards ? (
          <div className="order-3 flex flex-col justify-center px-4 pb-6 pt-1 sm:px-6 lg:px-5 lg:py-6 lg:pl-3.5 lg:pr-5">
            {hero.promoHeading ? (
              <div className="mb-2 px-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#999]">
                {hero.promoHeading}
              </div>
            ) : null}

            <div className="flex flex-col gap-2.5">
              {hero.promoCards.map((card) => (
                <PromoCard key={card.id} card={card} />
              ))}
            </div>

            {hero.promoViewAllHref ? (
              <Link
                href={hero.promoViewAllHref}
                className="mt-3 flex items-center gap-2 px-1 text-[10px] font-semibold tracking-[0.03em] text-[#888] transition-colors hover:text-[#555]"
              >
                <span>{hero.promoViewAllLabel ?? "View all"}</span>
                <span className="h-px flex-1 bg-black/8" />
                <ArrowIcon className="h-[13px] w-[13px]" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
