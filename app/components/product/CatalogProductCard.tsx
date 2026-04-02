"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { saveRecentlyViewed } from "@/app/components/product/RecentlyViewed";
import {
  buildCategoryProductHref,
  resolveCatalogVariantForValue,
  resolveSelectedVariant,
} from "@/app/lib/catalog/view-model";
import { useQuote } from "@/app/lib/quote/QuoteContext";
import type { ProductView } from "@/app/lib/types/view";

const ChevronRight = () => (
  <svg
    className="h-3.5 w-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const PlusIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const copy = {
  th: {
    viewDetails: "ดูรายละเอียด",
    addQuote: "เพิ่มในรายการขอราคา",
    inQuote: "อยู่ในรายการแล้ว",
    moq: "MOQ",
    leadTime: "ส่งใน",
    leadTimeSuffix: "วัน",
    variants: "variants",
  },
  en: {
    viewDetails: "View Details",
    addQuote: "Add to Quote",
    inQuote: "In Quote List",
    moq: "MOQ",
    leadTime: "Lead",
    leadTimeSuffix: "d",
    variants: "variants",
  },
} as const;

function formatBadge(sku?: string, slug?: string) {
  return sku ?? slug ?? "";
}

interface Props {
  categorySlug: string;
  locale: "th" | "en";
  product: ProductView;
  view?: "grid" | "list";
}

export default function CatalogProductCard({
  categorySlug,
  locale,
  product,
  view = "grid",
}: Props) {
  const t = copy[locale];
  const { add, remove, has } = useQuote();
  const inQuote = has(product.slug);

  const [selectedVariantSlug, setSelectedVariantSlug] = useState(
    product.defaultVariantSlug ?? product.variants[0]?.slug,
  );
  const selectedVariant = useMemo(
    () => resolveSelectedVariant(product, selectedVariantSlug),
    [product, selectedVariantSlug],
  );
  const selectedImage = selectedVariant?.image ?? product.image;
  const selectedName = selectedVariant?.name || product.name;
  const selectedDescription =
    selectedVariant?.description || product.description;
  const selectedMoq = selectedVariant?.moq ?? product.moq;
  const selectedLeadTime = selectedVariant?.leadTime ?? product.leadTime;
  const href = buildCategoryProductHref(
    locale,
    categorySlug,
    product.slug,
    selectedVariant?.slug,
  );

  function handleLinkClick() {
    saveRecentlyViewed({
      slug: product.slug,
      categorySlug,
      name: selectedName,
      imageSrc: selectedImage?.src ?? "",
      imageAlt: selectedImage?.alt ?? selectedName,
      href,
    });
  }

  function toggleQuote(e: React.MouseEvent) {
    e.preventDefault();
    if (inQuote) {
      remove(product.slug);
      return;
    }

    add({
      slug: product.slug,
      categorySlug,
      name: selectedName,
      imageSrc: selectedImage?.src ?? "",
      imageAlt: selectedImage?.alt ?? selectedName,
      moq: selectedMoq,
      variantSlug: selectedVariant?.slug,
    });
  }

  if (view === "list") {
    return (
      <article className="group flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
        <Link
          href={href}
          prefetch={false}
          onClick={handleLinkClick}
          className="shrink-0"
        >
          <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={selectedImage?.src || "/placeholder.jpg"}
              alt={selectedImage?.alt || selectedName}
              fill
              sizes="96px"
              className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold tracking-widest text-slate-600">
              {formatBadge(selectedVariant?.sku ?? product.sku, product.slug)}
            </span>
            {product.variantCount > 1 && (
              <span className="text-xs font-medium text-slate-400">
                {product.variantCount} {t.variants}
              </span>
            )}
          </div>

          <Link href={href} prefetch={false} onClick={handleLinkClick}>
            <h3 className="text-sm font-bold leading-snug text-slate-950 hover:text-slate-700">
              {selectedName}
            </h3>
          </Link>

          {selectedDescription && (
            <p className="line-clamp-2 text-xs leading-5 text-slate-500">
              {selectedDescription}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {selectedMoq && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {t.moq}: {selectedMoq}
              </span>
            )}
            {selectedLeadTime && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {t.leadTime} {selectedLeadTime} {t.leadTimeSuffix}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={toggleQuote}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            style={
              inQuote
                ? { background: "#0f172a", color: "#fff" }
                : { background: "#f1f5f9", color: "#475569" }
            }
          >
            {inQuote ? <CheckIcon /> : <PlusIcon />}
            {inQuote ? t.inQuote : t.addQuote}
          </button>
          <Link
            href={href}
            prefetch={false}
            onClick={handleLinkClick}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950"
          >
            {t.viewDetails} <ChevronRight />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <Link
        href={href}
        prefetch={false}
        onClick={handleLinkClick}
        className="block"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
          <Image
            src={selectedImage?.src || "/placeholder.jpg"}
            alt={selectedImage?.alt || selectedName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.variantCount > 1 && (
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {product.variantCount} {t.variants}
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-slate-600">
            {formatBadge(selectedVariant?.sku ?? product.sku, product.slug)}
          </span>
          {product.variantSummary && (
            <span className="text-xs font-medium text-slate-500">
              {product.variantSummary}
            </span>
          )}
        </div>

        <div>
          <Link href={href} prefetch={false} onClick={handleLinkClick}>
            <h3 className="text-base font-semibold leading-snug text-slate-950 hover:text-slate-700">
              {selectedName}
            </h3>
          </Link>
          {selectedDescription && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
              {selectedDescription}
            </p>
          )}
        </div>

        {(selectedMoq || selectedLeadTime) && (
          <div className="flex flex-wrap gap-2">
            {selectedMoq && (
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {t.moq}: {selectedMoq}
              </span>
            )}
            {selectedLeadTime && (
              <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {t.leadTime} {selectedLeadTime} {t.leadTimeSuffix}
              </span>
            )}
          </div>
        )}

        {product.variantCount > 1 && product.variantGroups.length > 0 && (
          <div className="space-y-2.5 pt-1">
            {product.variantGroups.map((group) => (
              <div key={group.key}>
                <p className="mb-1.5 text-xs font-medium text-slate-500">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.values.map((value) => {
                    const isActive = selectedVariant?.options.some(
                      (option) =>
                        option.groupKey === group.key &&
                        option.valueLabel === value.valueLabel,
                    );
                    const nextVariant = selectedVariant
                      ? resolveCatalogVariantForValue(
                          product.variants,
                          product.variantGroups,
                          selectedVariant,
                          group.key,
                          value.valueLabel,
                        )
                      : undefined;

                    return (
                      <button
                        key={`${group.key}-${value.valueKey}`}
                        type="button"
                        onClick={() => {
                          if (nextVariant?.slug) {
                            setSelectedVariantSlug(nextVariant.slug);
                          }
                        }}
                        className="rounded-lg border px-3 py-1 text-xs font-medium transition-all duration-150"
                        style={{
                          borderColor: isActive ? "#0f172a" : "#e2e8f0",
                          background: isActive ? "#0f172a" : "#f8fafc",
                          color: isActive ? "#fff" : "#475569",
                        }}
                      >
                        {value.valueLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={toggleQuote}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all"
            style={
              inQuote
                ? { background: "#0f172a", color: "#fff" }
                : { background: "#f1f5f9", color: "#475569" }
            }
          >
            {inQuote ? <CheckIcon /> : <PlusIcon />}
            {inQuote ? t.inQuote : t.addQuote}
          </button>
          <Link
            href={href}
            prefetch={false}
            onClick={handleLinkClick}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-950"
          >
            {t.viewDetails}
            <ChevronRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
