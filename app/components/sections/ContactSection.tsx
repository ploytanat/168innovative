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
    <section className="w-full md:py-24 border-y border-dashed border-gray-black bg-[#EEEEEE] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ปรับ Grid ratio เป็น 5:7 (lg:grid-cols-[5fr_7fr]) เพื่อให้ฝั่งรูปใหญ่กว่าฝั่งตัวหนังสือ */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] items-center">

          {/* LEFT : INFO (เล็กลงเล็กน้อย) */}
          <div className="order-2 lg:order-1 z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Contact Us
            </h2>

          

            <div className="mt-10 space-y-6">
              <div className="space-y-3">
             
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {data.phones.map((p) => (
                    <div key={p.number} className="flex flex-col">
                      <span className="text-xs text-gray-400">{p.label}</span>
                      <a 
                        href={`tel:${p.number.replace(/-/g, '')}`} 
                        className="text-lg md:text-xl text-gray-900 hover:text-blue-600 transition-colors font-bold"
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

            {/* CTA Buttons */}
            {data.lineQrCode && (
              <div className="mt-12 p-6 inline-block bg-white rounded-[2rem] border border-gray-100 shadow-sm">
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

          {/* RIGHT : MAIN IMAGE (ใหญ่พิเศษ) */}
          <div className="order-1 lg:order-2 relative w-full h-[400px] md:h-[600px] lg:h-[700px] flex justify-center items-center">
             {data.contactImage && (
                <div className="relative h-full w-full group scale-110 lg:scale-125 transition-transform duration-1000">
                  {/* Glow Effect พื้นหลัง */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-full blur-[100px] opacity-60" />
                  
                  <Image
                    src={data.contactImage.src}
                    alt={data.contactImage.alt}
                    fill
                    priority
                    className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
             )}
          </div>

        </div>
      </div>
    </section>
  )
}