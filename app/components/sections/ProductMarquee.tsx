import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

interface ProductMarqueeProps {
  items: ProductView[]
  locale: "th" | "en"
}

export default function ProductMarquee({
  items,
  locale,
}: ProductMarqueeProps) {
  if (!items.length) return null

  const marqueeItems = [...items, ...items]

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-4">
      <div className="pointer-events-none absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-rose-100/60 blur-[80px] md:h-96 md:w-96 md:blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-48 w-48 rounded-full bg-pink-100/50 blur-[80px] md:h-96 md:w-96 md:blur-[120px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #d4a0a0, #e8c4b8, #d4a0a0, transparent)",
        }}
      />

      <div className="relative mb-8 px-6 text-center md:mb-16">
        <h2
          className="font-heading mt-3 text-2xl font-bold tracking-[0.02em] text-slate-800 sm:text-3xl lg:text-4xl"
        >
          {uiText.featuredProducts[locale]}
        </h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-rose-300 md:w-12" />
          <div className="h-1 w-1 rounded-full bg-rose-300" />
          <div className="h-px w-8 bg-rose-300 md:w-12" />
        </div>
      </div>

      <div className="w-full overflow-x-auto px-4 lg:hidden scrollbar-hide touch-pan-x">
        <div className="flex flex-nowrap gap-4 pb-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={withLocalePath(
                `/categories/${item.categorySlug}/${item.slug}`,
                locale
              )}
              className="shrink-0"
            >
              <div className="w-40 rounded-2xl border border-rose-100 bg-white p-3 shadow-sm transition-transform active:scale-95 md:w-48">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-rose-50/50">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="(max-width: 768px) 10rem, 12rem"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 line-clamp-1 px-1 text-center text-xs font-medium text-slate-600">
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="group relative hidden overflow-hidden lg:block">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40"
          style={{ backgroundImage: "linear-gradient(to right, white, transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40"
          style={{ backgroundImage: "linear-gradient(to left, white, transparent)" }}
        />

        <div className="animate-marquee gap-6 px-8 py-1">
          {marqueeItems.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={withLocalePath(
                `/categories/${item.categorySlug}/${item.slug}`,
                locale
              )}
              className="group/item"
            >
              <div className="relative w-48 shrink-0 rounded-2xl border border-rose-100 bg-white p-3.5 shadow-sm transition-all duration-500 group-hover/item:-translate-y-2 group-hover/item:border-rose-200 group-hover/item:shadow-xl">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-rose-50/0 to-rose-50/60 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />

                <div className="relative aspect-square overflow-hidden rounded-xl bg-rose-50/40">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.name}
                    fill
                    sizes="12rem"
                    className="select-none object-cover transition-transform duration-700 group-hover/item:scale-110"
                  />
                </div>

                <p className="relative mt-4 line-clamp-1 text-center text-[12px] font-medium text-slate-500 transition-colors duration-300 group-hover/item:text-rose-500">
                  {item.name}
                </p>
                <div className="mx-auto mt-2.5 h-px w-0 rounded-full bg-linear-to-r from-rose-300 to-pink-300 transition-all duration-500 group-hover/item:w-12" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center md:mt-6">
        <Link
          href={withLocalePath("/categories", locale)}
          className="inline-flex items-center gap-2.5 rounded-full border border-rose-200 bg-white px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400 shadow-sm transition-all duration-300 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 hover:shadow-md active:scale-95 md:text-xs"
        >
          {locale === "th" ? "View all products" : "View All Products"}
          <span aria-hidden="true" className="text-sm">
            →
          </span>
        </Link>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #d4a0a0, #e8c4b8, #d4a0a0, transparent)",
        }}
      />
    </section>
  )
}
