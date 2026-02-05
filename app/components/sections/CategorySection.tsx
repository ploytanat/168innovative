"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryView } from "@/app/lib/types/view";

interface CategorySectionProps {
  items: CategoryView[];
}

export default function CategorySection({ items = [] }: CategorySectionProps) {
  const pathname = usePathname();
  const isEN = pathname.startsWith("/en");

  if (items.length === 0) return null;

  const content = {
    title: isEN ? "Our Categories" : "หมวดหมู่สินค้า",
    viewAll: isEN ? "View All Categories" : "ดูหมวดหมู่ทั้งหมด",
    link: isEN ? "/en/categories" : "/categories",
  };

  const displayItems = items.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        {/* Main Glassmorphism Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/40 p-8 md:p-16 lg:p-20 shadow-2xl shadow-gray-200/50 backdrop-blur-md">
          
          {/* Header */}
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {content.title}
            </h2>
            <div className="mt-4 h-1 w-20 rounded-full bg-gray-900 md:w-24" />
          </div>

          {/* Grid Layout */}
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-8">
            {displayItems.map((item) => (
              <Link
                key={item.id}
                href={`${content.link}/${item.id}`} // สมมติว่าต้องการกดเข้าหมวดหมู่ได้เลย
                className="group/card flex flex-col items-center"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-500 group-hover/card:shadow-xl group-hover/card:-translate-y-2">
                  {item.image?.src ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt || item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                      No Image
                    </div>
                  )}
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
                </div>

                {/* Text Content */}
                <div className="mt-4 text-center transition-colors duration-300">
                  <h3 className="text-base font-bold text-gray-900 md:text-xl">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="mt-1 hidden line-clamp-1 text-sm text-gray-500 md:block">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Footer Action */}
          <div className="mt-16 flex justify-center">
            <Link
              href={content.link}
              className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gray-900 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95"
            >
              <span className="relative z-10">{content.viewAll}</span>
              <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-50/50 blur-3xl" />
        </div>
      </div>
    </section>
  );
}