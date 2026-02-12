import { getCategories } from "@/app/lib/api/categories";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/ui/Breadcrumb";
import type { Metadata } from "next";
import BackgroundBlobs from "../components/ui/BackgroundBlobs";

export const metadata: Metadata = {
  title: "หมวดหมู่บรรจุภัณฑ์เครื่องสำอางทั้งหมด | OEM / ODM ครบวงจร",
  description:
    "รวมหมวดหมู่บรรจุภัณฑ์เครื่องสำอางทุกประเภท เช่น ขวดเซรั่ม กระปุกครีม หลอด และตลับแป้ง พร้อมบริการ OEM / ODM และสกรีนโลโก้",
  alternates: {
    canonical: "https://yourwebsite.com/categories",
  },
};

export default async function AllCategoriesPage() {
  const categories = await getCategories("th");
  const seoCategories = categories?.filter((c) => c.seoDescription).slice(0, 6);

  if (!categories || categories.length === 0) {
    return (
      <main className="relative bg-gray-50 ">
        <div className="hidden lg:block">
    <BackgroundBlobs />
  </div>
        <div className="container mx-auto  text-center">
          <Breadcrumb />
        
          <p className="mt-4 text-gray-500">
            ขณะนี้ยังไม่มีข้อมูลหมวดหมู่ในระบบ
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA] pt-12 pb-32">
     <div className="hidden lg:block">
    <BackgroundBlobs />
  </div>

      <div className="mx-auto container relative px-4 lg:px-8">
        <Breadcrumb />

        {/* ================= Hero ================= */}
        <header className="mx-auto mt-12 max-w-4xl text-center">
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            หมวดหมู่บรรจุภัณฑ์เครื่องสำอาง
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            เลือกบรรจุภัณฑ์ให้เหมาะกับแบรนด์ของคุณ ตั้งแต่สายพรีเมียม
            ไปจนถึงรักษ์โลก พร้อมบริการ OEM / ODM ครบวงจร
          </p>
        </header>

        {/* ================= Categories Grid ================= */}
        <section
          aria-label="Product Categories"
          className="mt-20 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 border-t border-gray-300 pt-6"
        >
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="
    group relative overflow-hidden rounded-xl bg-white
    shadow-sm transition-all duration-500
    hover:-translate-y-2 hover:shadow-2xl
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
  "
            >
              {/* IMAGE */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {category.image?.src ? (
                  <Image
                    src={category.image.src}
                    alt={category.image.alt || `บรรจุภัณฑ์${category.name}`}
                    fill
                    priority={index < 4}
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700
                               group-hover:scale-110 "
                    />
                ) : (
                  <div
                    className="
        flex h-full w-full items-center justify-center
        bg-gradient-to-br from-gray-100 to-gray-200
      "
                  >
                    <span className="text-xs font-semibold text-gray-400">
                      Image coming soon
                    </span>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="flex flex-col items-center p-6 text-center">
                <h2
                  className="
      text-lg font-bold text-gray-900
      transition-colors
      group-hover:text-blue-600
    "
                >
                  {category.name}
                </h2>

                {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </section>

        {/* ================= Knowledge / SEO Section ================= */}
        {seoCategories && seoCategories.length > 0 && (
          <section className="mt-32 rounded-[3rem] bg-white px-8 py-20 shadow-sm md:px-20">
            <div className="mx-auto max-w-5xl">
              <header className="mb-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  เจาะลึกประเภทบรรจุภัณฑ์เครื่องสำอาง
                </h2>
                <p className="mt-4 text-gray-500">
                  ข้อมูลเชิงลึกเพื่อช่วยให้คุณเลือกบรรจุภัณฑ์ได้เหมาะกับสินค้าและแบรนด์
                </p>
              </header>

              <div className="grid gap-12 md:grid-cols-2">
                {seoCategories.map((cat) => (
                  <article
                    key={cat.id}
                    className="group relative border-l-4 border-gray-200 pl-6 transition-colors hover:border-blue-600"
                  >
                    <Link href={`/categories/${cat.slug}`}>
                      <h3 className="text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
                        {cat.seoTitle || cat.name}
                      </h3>
                    </Link>
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
