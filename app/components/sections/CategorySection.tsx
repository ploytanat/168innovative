// components/sections/CategorySection.tsx
import Image from 'next/image'
import { CategoryView } from '@/app/lib/types/content'

export default function CategorySection({
  items = [],
}: {
  items: CategoryView[]
}) {
  if (!items.length) return null

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-lg font-semibold">
          Categories
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map(item => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-4 text-center"
            >
              {item.image && (
                <div className="relative mx-auto h-16 w-16">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <p className="mt-3 text-sm font-medium">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
