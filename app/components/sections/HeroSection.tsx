import Image from 'next/image'

export default function HeroSection({ data }: any) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* HERO CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-[#c8d5dd] px-6 py-2 sm:px-10 sm:py-16 lg:rounded-[48px] lg:px-20 lg:py-18 shadow-[0_40px_120px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 items-center lg:grid-cols-12">

            {/* LEFT */}
            <div className="relative z-10 lg:col-span-5">
          
              <h1 className="text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {data.title}
              </h1>

              <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
                {data.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={data.ctaPrimary.href}
                  className="rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  {data.ctaPrimary.label}
                </a>

                <a
                  href={data.ctaSecondary.href}
                  className="text-sm font-medium text-gray-700 underline-offset-4 hover:underline"
                >
                  Learn more
                </a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative lg:col-span-7">
              {/* soft glow (อยู่ใน card) */}
              <div className="pointer-events-none absolute right-1/2 top-1/2 hidden h-[420px] w-[420px] translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#eef6f2] to-transparent blur-2xl lg:block" />

              {/* PRODUCT */}
              <div className="relative mx-auto h-[340px] w-full max-w-xs sm:h-[400px] sm:max-w-sm lg:h-[420px] lg:max-w-lg">
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  fill
                  priority
                  className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.12)]"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
