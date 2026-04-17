import Image from "next/image"

import type { ClientModel, ClientsSectionModel } from "@/types/homepage"

interface ClientsSectionProps {
  section: ClientsSectionModel
}

function LogoCell({ client }: { client: ClientModel }) {
  return (
    <div className="flex h-[64px] items-center justify-center rounded-[6px] border border-[#eeeeee] bg-white px-[10px] py-[8px]">
      {client.logo ? (
        <div className="relative h-full w-full">
          <Image
            src={client.logo}
            alt={client.name}
            fill
            sizes="120px"
            className="object-contain"
          />
        </div>
      ) : (
        <span className="text-center text-[11px] font-bold leading-tight text-[#aaa]">
          {client.name}
        </span>
      )}
    </div>
  )
}

export default function ClientsSection({ section }: ClientsSectionProps) {
  return (
    <section className="bg-white py-[60px]">
      <div className="mx-auto flex max-w-[1200px] items-center gap-[60px] px-[20px]">
        {/* Left — stat + CTA */}
        <div className="w-[280px] shrink-0">
          <p className="text-[16px] leading-[1.5] text-[#333]">
            {section.headline}
          </p>
          <p className="my-[4px] text-[56px] font-black leading-none text-[#1565c0]">
            {section.stat}
          </p>
          <p className="text-[16px] leading-[1.5] text-[#333]">
            {section.subheadline}
          </p>
          <a
            href={section.ctaHref}
            className="mt-[20px] inline-block rounded-[5px] border border-[#333] px-[18px] py-[8px] text-[13px] font-bold text-[#333] hover:bg-[#333] hover:text-white"
          >
            {section.ctaLabel}
          </a>
        </div>

        {/* Right — logo grid */}
        <div className="flex-1">
          {section.clients.length > 0 ? (
            <div className="grid grid-cols-7 gap-[10px]">
              {section.clients.map((client) => (
                <LogoCell key={client.id} client={client} />
              ))}
            </div>
          ) : (
            /* Placeholder grid for future use */
            <div className="grid grid-cols-7 gap-[10px]">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-[64px] items-center justify-center rounded-[6px] border border-[#eeeeee] bg-[#fafafa]"
                >
                  <span className="text-[10px] uppercase text-[#ccc]">Logo</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
