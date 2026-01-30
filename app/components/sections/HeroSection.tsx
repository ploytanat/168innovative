import Image from 'next/image'

export default function HeroSection({ data }: any) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto  px-6">

        {/* CARD (อย่า overflow-hidden) */}
        <div className="relative rounded-3xl bg-[#f3faf7] px-16 py-24">
          <div className="grid grid-cols-1 items-center lg:grid-cols-12">

            {/* LEFT: TEXT */}
            <div className="relative z-10 lg:col-span-6">
              <span className="inline-block rounded-full bg-white px-4 py-1 text-xs font-medium text-gray-700">
                New Collection
              </span>

              <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight text-gray-900">
                {data.title}
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600">
                {data.description}
              </p>

              <div className="mt-10 flex items-center gap-4">
                <a
                  href={data.ctaPrimary.href}
                  className="rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white"
                >
                  {data.ctaPrimary.label}
                </a>

                <a
                  href={data.ctaSecondary.href}
                  className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline"
                >
                  ดูรายละเอียดเพิ่มเติม
                </a>
              </div>
            </div>

            {/* RIGHT: IMAGE ZONE */}
            <div className="relative lg:col-span-6">
              
              {/* soft base (อยู่ใน card) */}
              <div className="absolute right-0 top-1/2 h-[320px] w-[420px] -translate-y-1/2 rounded-[40px] bg-[#dfeee9]" />

              {/* PRODUCT (ล้นออกมา) */}
              <div className="pointer-events-none absolute -right-24 top-1/2 z-20 h-[420px] w-[520px] -translate-y-1/2">
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  fill
                  priority
                  className="object-contain"
                />
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
