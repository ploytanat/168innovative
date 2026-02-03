import Image from 'next/image'

export default function AboutHero({ data }: { data: {
  title: string
  description: string
  image: { src: string; alt: string }
}}) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">

        {/* LEFT */}
        <div className="lg:col-span-6">
          <p className="mb-4 text-sm text-gray-400">
            Home / About Us
          </p>

          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {data.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            {data.description}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={data.image.src}
              alt={data.image.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  )
}
