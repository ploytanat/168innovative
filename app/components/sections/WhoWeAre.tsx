export default function WhoWeAre({ data }: {
  data: {
    title: string
    content: string
    image: { src: string; alt: string }
  }
}) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">

        {/* IMAGE */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={data.image.src}
              alt={data.image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* TEXT */}
        <div className="lg:col-span-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {data.title}
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            {data.content}
          </p>
        </div>

      </div>
    </section>
  )
}
