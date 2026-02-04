'use client'

import Image from 'next/image'
import { CompanyView } from '@/app/lib/types/view'
import { useState, useEffect } from 'react'

export default function ContactSection({
  data,
}: {
  data: CompanyView
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="w-full mx-auto  container py-10 md:py-24 border rounded-2xl border-dashed border-[#140a06] bg-[#EEEEEE] overflow-hidden">
      <div className="mx-auto  px-4 sm:px-6">
        {/* เพิ่ม text-center สำหรับจอเล็ก และ lg:text-left สำหรับจอใหญ่ */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] items-center text-center lg:text-left">

          {/* LEFT : INFO (แสดงเป็นลำดับที่ 2 ในจอเล็ก เพื่อให้รูปภาพขึ้นก่อน หรือปรับ order ตามชอบ) */}
          <div className="order-2 lg:order-1 z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Contact Us
            </h2>

            <div className="mt-10 space-y-8">
              <div className="space-y-3">
                {/* ปรับให้เบอร์โทรศัพท์อยู่ตรงกลางในจอเล็ก */}
                <div className="flex flex-col items-center lg:items-start gap-4">
                  {data.phones.map((p) => (
                    <div key={p.number} className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase tracking-widest">{p.label}</span>
                      <a 
                        href={`tel:${p.number.replace(/-/g, '')}`} 
                        className="text-xl md:text-2xl text-gray-900 hover:text-blue-600 transition-colors font-bold"
                      >
                        {p.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Email Address</p>
                {data.email.map((e) => (
                  <a key={e} href={`mailto:${e}`} className="block text-base text-gray-900 hover:text-blue-600 transition-colors">
                    {e}
                  </a>
                ))}
              </div>
            </div>

            {/* QR Code: ใช้ mx-auto เพื่อให้อยู่ตรงกลางจอเล็ก */}
            {data.lineQrCode && (
              <div className="mt-12 p-6 inline-block bg-white rounded-4xl border border-gray-100 shadow-sm mx-auto lg:mx-0">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-center text-gray-400">
                  Scan to Add LINE
                </p>
                <div className="relative h-32 w-32 mx-auto">
                  <Image
                    src={data.lineQrCode.src}
                    alt={data.lineQrCode.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT : MAIN IMAGE */}
          <div className="order-1 lg:order-2 relative w-full h-80 md:h-120 lg:h-175 flex justify-center items-center">
             {data.contactImage && (
                <div className="relative h-full w-full group scale-100 lg:scale-125 transition-transform duration-1000">
                  <Image
                    src={data.contactImage.src}
                    alt={data.contactImage.alt}
                    fill
                    priority
                    className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.1)] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
             )}
          </div>

        </div>
      </div>
    </section>
  )
}