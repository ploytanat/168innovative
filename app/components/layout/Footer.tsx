// components/Footer.tsx

import Image from "next/image";
import { CompanyView } from "@/app/lib/types/view";
export default function Footer({ company }: { company: CompanyView }) {
  return (
    <footer 
      className="relative h-100" // กำหนดความสูงตามต้องการ
      style={{ clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)" }}
    >
      <div className="fixed bottom-0  w-full  text-zinc-900 p-10 flex flex-col justify-between">
        {/* ส่วนบนของ Footer */}
<div className="relative mx-auto max-w-7xl px-6 pt-20">
          <div className="grid gap-12 lg:grid-cols-4">

            {/* LOGO + ADDRESS */}
            <div>
              <Image
                src="/images/logo.png"
                alt={company.name}
                width={120}
                height={40}
              />
              <p className="mt-4 text-sm text-gray-600 max-w-xs">
                {company.address}
              </p>
            </div>

            {/* PHONE */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                Phone Number
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {company.phones.map(p => (
                  <li key={p.number}>
                    {p.label}: {p.number}
                  </li>
                ))}
              </ul>
            </div>

            {/* EMAIL */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                Email
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {company.email.map(e => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">
                Social
              </h4>
              <div className="flex gap-4">
                {company.socials.map(s => (
                  <a
                    key={s.type}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={s.icon.src}
                      alt={s.icon.alt}
                      width={20}
                      height={20}
                    />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* bottom */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-6 sm:flex-row">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}