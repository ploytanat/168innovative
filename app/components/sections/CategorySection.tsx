// components/sections/CategorySection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryView } from "@/app/lib/types/view";

export default function CategorySection({
  items = [],
}: {
  items: CategoryView[];
}) {
  const pathname = usePathname();
  const isEN = pathname.startsWith("/en");

  if (!items.length) return null;

  // เลือกแสดง 6 อันแรก
  const displayItems = items.slice(0, 6);

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto container  px-4">
        {/* กล่อง Container ขาวขนาดใหญ่ */}
        <div className="group relative overflow-hidden rounded-2xl  border border-white/50 bg-white/30 px-6 py-10 sm:px-10 sm:py-16 lg:px-16 lg:py-20 shadow-2xl backdrop-blur-sm">
          
          <h2 className="mb-10 text-center text-xl md:text-2xl font-bold text-gray-900">
            {isEN ? "Our Categories" : "หมวดหมู่สินค้า"}
          </h2>

          {/* Grid Container*/}
          <div className="grid grid-cols-2 p-4 gap-2 sm:grid-cols-3 lg:grid-cols-3 md:gap-12 max-w-6xl mx-auto">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="group/card flex flex-col items-center overflow-hidden rounded-xl 
                           md:rounded-2xl bg-white p-2 md:p-2
                           shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 
                           hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#f2f2f2]">
                  {item.image?.src && (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}  
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover/card:scale-120"
                    />
                  )}
                </div>

                {/* Text Section */}
                <div className="flex flex-col items-center pt-2 md:py-6 px-2 text-center">
                  <h3 className="text-sm md:text-lg font-bold tracking-tight text-gray-900 leading-tight">
                    {item.name}
                  </h3>

                  <span className="hidden md:block mt-1  text-sm lowercase   text-gray-600">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ปุ่มดูทั้งหมด (อยู่ข้างในกล่องขาวใหญ่) */}
          <div className="mt-12 flex justify-center">
            <Link
              href={isEN ? "/en/categories" : "/categories"}
              className="group/btn inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/50 px-8 py-2.5 text-[12px] font-medium text-gray-500 transition-all hover:border-gray-900 hover:text-gray-900 hover:bg-white"
            >
              {isEN ? "View All Categories" : "ดูหมวดหมู่ทั้งหมด"}
              <span className="transition-transform group-hover/btn:translate-x-1">
                →
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}