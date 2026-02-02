import Image from 'next/image'
import { CompanyView } from '@/app/lib/types/view'

export default function ContactSection({
  data,
}: {
  data: CompanyView
}) {
  return (
    <section className="bg-amber-50 container mx-auto py-20 border-b border-dashed">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">

          {/* LEFT : INFO */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Contact Us
            </h2>

            <p className="mt-4 text-sm text-gray-600">
              {data.address}
            </p>

            <div className="mt-6 space-y-2 text-sm">
              {data.phones.map((p) => (
                <p key={p.number}>
                  <span className="font-medium">{p.label}:</span>{' '}
                  {p.number}
                </p>
              ))}

              {data.email.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex gap-4">
              <a
                href="tel:0890000000"
                className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Call Now
              </a>

              <a
                href="#"
                className="rounded-full border px-6 py-3 text-sm font-medium hover:bg-white transition"
              >
                Contact Form
              </a>
            </div>

            {/* LINE QR */}
            <div className="mt-10">
              <p className="mb-2 text-xs text-gray-500">
                LINE Official
              </p>
              <Image
                src="/images/line-qr.png"
                alt="LINE QR"
                width={120}
                height={120}
              />
            </div>
          </div>

          {/* RIGHT : IMAGE */}
          <div className="relative h-[320px] sm:h-[420px]">
            <Image
              src="/images/contact-products.png"
              alt="Packaging Products"
              fill
              className="object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
