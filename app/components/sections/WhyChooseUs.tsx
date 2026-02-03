// components/sections/WhyChooseUs.tsx
import Image from "next/image";
import { WhyItemView } from "@/app/lib/types/view";

export default function WhyChooseUs({
  items,
}: {
  items: WhyItemView[];
}) {
  if (!items.length) return null;

  return (
    <section className="py-16 md:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4">
        {/* หัวข้อ Section ปรับให้ดูพรีเมียมขึ้น */}
        <h2 className="mb-12 text-center text-2xl font-bold text-[#1e3a5f] md:text-3xl">
          Why Choose 168 Innovative
        </h2>

        {/* Grid: 4 คอลัมน์ตามรูปตัวอย่าง */}
        <div className="grid gap-6 grid-2 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col items-center rounded-[2.5rem] bg-white p-8 text-center border border-gray-50 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Icon Area: ใช้รูปภาพจากข้อมูลที่ส่งมา */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center overflow-hidden">
                {item.image?.src ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt || item.title}
                    width={80}
                    height={80}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  // Placeholder กรณีไม่มีรูป
                  <div className="h-full w-full rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title: เน้นตัวหนาและขนาดกำลังดี */}
              <h3 className="mb-3 text-base font-bold text-gray-900 md:text-lg">
                {item.title}
              </h3>

              {/* Description: ใช้สีเทาเพื่อความสะอาดตา และระยะบรรทัดที่อ่านง่าย */}
              <p className="text-sm leading-relaxed text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}