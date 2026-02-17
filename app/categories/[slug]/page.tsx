// app/categories/[slug]/page.tsx

import { getCategoryBySlug } from "@/app/lib/api/categories";
import { getProductsByCategory } from "@/app/lib/api/products";
import { Locale } from "@/app/lib/types/content";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

/* ================= Metadata ================= */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { slug } = await params; // ✅ ต้อง await

  const locale: Locale = "th";

  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    return {
      title: "ไม่พบหมวดหมู่สินค้า",
    };
  }

  return {
    title:
      category.seoTitle ||
      `${category.name} | บรรจุภัณฑ์เครื่องสำอาง`,
    description:
      category.seoDescription ||
      category.description ||
      `สินค้าในหมวด ${category.name}`,
  };
}

/* ================= Page ================= */

export default async function CategoryPage(
  { params }: Props
) {

  const { slug } = await params; // ✅ ต้อง await

  const locale: Locale = "th";

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="container mx-auto py-20">

      <h1 className="text-4xl font-bold text-center mb-8">
        {category.name}
      </h1>

      {category.description && (
        <p className="text-center text-gray-600 mb-12">
          {category.description}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/categories/${slug}/${product.slug}`}
            className="group"
          >
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.image?.src && (
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
              )}
            </div>

            <h2 className="mt-3 text-center font-semibold">
              {product.name}
            </h2>
          </Link>
        ))}
      </div>

    </main>
  );
}
