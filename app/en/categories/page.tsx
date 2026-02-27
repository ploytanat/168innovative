// app/categories/page.tsx

import { getCategories } from "@/app/lib/api/categories";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/ui/Breadcrumb";
import BackgroundBlobs from "@/app/components/ui/BackgroundBlobs";
import LocalizedLink from "@/app/components/ui/LocalizedLink";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Product Categories | Cosmetic Packaging & OEM Solutions",
    description:
      "Explore all cosmetic packaging categories with complete OEM/ODM services available.",
  };
}

export default async function CategoriesPage() {
  const locale = "en";

  const categories = await getCategories(locale);

  if (!categories.length) {
    return (
      <main className="bg-gray-50 pt-12 pb-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Breadcrumb />
          <p className="mt-10 text-gray-500">
            No product categories available at this time
          </p>
        </div>
      </main>
    );
  }

  const seoCategories = categories
    .filter((c) => c.seoDescription)
    .slice(0, 6);

  return (
    <main className="bg-[#F8F9FA] pb-32">
      <div className="hidden lg:block">
        <BackgroundBlobs />
      </div>

      <div className="mx-auto max-w-7xl relative px-6 pt-6 lg:px-8">
        <Breadcrumb />

        {/* ================= HERO ================= */}
        <header className="mx-auto mt-6 max-w-4xl text-center">
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Cosmetic Packaging Categories
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            Find the perfect packaging solution for your brand.
            Complete OEM and ODM services available.
          </p>
        </header>

        {/* ================= GRID ================= */}
        <section
          aria-label="Product Categories"
          className="mt-20 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 border-t border-gray-300 pt-6"
        >
          {categories.map((category) => (
            <LocalizedLink
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {category.image?.src ? (
                  <Image
                    src={category.image.src}
                    alt={category.image.alt || category.name}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                    quality={75}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-6 text-center">
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {category.description}
                  </p>
                )}
              </div>
            </LocalizedLink>
          ))}
        </section>

        {/* ================= SEO SECTION ================= */}
        {seoCategories.length > 0 && (
          <section className="mt-32 rounded-[3rem] bg-white px-8 py-20 shadow-sm md:px-20">
            <div className="mx-auto max-w-5xl">
              <header className="mb-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Explore Packaging Types In Detail
                </h2>
                <p className="mt-4 text-gray-500">
                  In-depth insights to help you choose the right solution
                </p>
              </header>

              <div className="grid gap-12 md:grid-cols-2">
                {seoCategories.map((cat) => (
                  <article
                    key={cat.id}
                    className="group border-l-4 border-gray-200 pl-6 hover:border-blue-600 transition-colors"
                  >
                    
                    <LocalizedLink href={`/categories/${cat.slug}`}>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                        {cat.seoTitle || cat.name}
                      </h3>
                    </LocalizedLink>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {cat.seoDescription}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
