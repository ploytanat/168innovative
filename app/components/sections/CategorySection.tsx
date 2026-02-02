// components/sections/CategorySection.tsx
import Image from 'next/image'
import { CategoryView } from '@/app/lib/types/view'

export default function CategorySection({
  items = [],
}: {
  items: CategoryView[]
}) {
  if (!items.length) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-lg font-semibold text-gray-900">
          Categories
        </h2>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(item => (
            <div
              key={item.id}
              className="
                rounded-2xl bg-white/70
               shadow-md
                transition hover:shadow-xl
              "
            >
              {/* IMAGE 1:1 */}
              {item.image?.src && (
                <div className="relative aspect-square w-full overflow-hidden rounded-xl   ">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-contain p-4 "
                  />
                </div>
              )}

              {/* TITLE */}
              <p className="mt-4 text-center text-sm font-medium text-gray-800">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
