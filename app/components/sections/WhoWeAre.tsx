import Image from "next/image"
import { COLORS, GLASS, SECTION_BACKGROUNDS, SOFT_IMAGE_BG } from "../ui/designSystem"

export default function WhoWeAre({ data }: {
  data: {
    title: string
    content: string
    image: { src: string; alt: string }
  }
}) {
  return (
    <section className="py-20" style={{ background: SECTION_BACKGROUNDS.neutral }}>
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">

        {/* IMAGE */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl" style={{ ...GLASS.primary, background: SOFT_IMAGE_BG }}>
            <Image
              src={data.image.src}
              alt={data.image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* TEXT */}
        <div className="lg:col-span-6">
          <h2 className="text-2xl font-semibold" style={{ color: COLORS.dark }}>
            {data.title}
          </h2>

          <p className="mt-6 leading-relaxed" style={{ color: COLORS.mid }}>
            {data.content}
          </p>
        </div>

      </div>
    </section>
  )
}
