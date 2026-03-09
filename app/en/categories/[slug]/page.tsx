// app/en/categories/[slug]/page.tsx

import { getCategoryBySlug } from "@/app/lib/api/categories";
import { getProductsByCategory } from "@/app/lib/api/products";
import type { Metadata } from "next";
import { Locale } from "@/app/lib/types/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/app/components/ui/Breadcrumb";
import ProductGrid from "@/app/components/product/Productgrid";
import Pagination from "@/app/components/ui/Pagination";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

/* ================= Metadata ================= */

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {

  const { slug } = await params;
  const sp = await searchParams;

  const page = Math.max(1, Number(sp?.page ?? 1));
  const locale: Locale = "en";

  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    return {
      title: "Category not found",
    };
  }

  return {
    title:
      page > 1
        ? `${category.name} Page ${page} | Cosmetic Packaging`
        : category.seoTitle ||
        `${category.name} | Cosmetic Packaging`,
    description:
      category.seoDescription ||
      category.description ||
      `Products in category ${category.name}`,
  };
}

/* ================= Page ================= */

export default async function CategoryPage(
  { params, searchParams }: Props
) {

  const { slug } = await params;
  const sp = await searchParams;

  const locale: Locale = "en";
  const page = Math.max(1, Number(sp?.page ?? 1));

  const [category, result] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale, page),
  ]);

  if (!category) {
    notFound();
  }

  const { products, totalPages, totalCount } = result;

  if (page > totalPages && totalPages > 0) notFound();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-6">
        <Breadcrumb />

        {/* Header */}
        <header className="mb-14 mt-6 border-b border-[#E5E7EB] pb-10">
          <Link
            href="/en/categories"
            className="mb-5 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-[#14B8A6] transition-colors hover:text-[#0F766E]"
          >
            <ChevronLeft className="h-3 w-3" />
            All Categories
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#1A2535] md:text-4xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#5A6A7E]">
              {category.description}
            </p>
          )}
        </header>

        <ProductGrid
          products={products}
          categorySlug={slug}
          totalCount={totalCount}
          locale="en"
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/en/categories/${slug}`}
        />
      </div>
    </main>
  );
}