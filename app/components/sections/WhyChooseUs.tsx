import { WhyItemView } from "@/app/lib/types/view"

export default function WhyChooseUs({
  items,
}: {
  items: WhyItemView[]
}) {
  if (!items.length) return null

  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-xl font-semibold">
          Why Choose Us
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 text-center shadow-sm"
            >
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}