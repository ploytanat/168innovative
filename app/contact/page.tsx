import { getCompany } from '@/app/lib/api/company'
import { Locale } from '@/app/lib/types/content'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import Breadcrumb from '../components/ui/Breadcrumb'

export default async function ContactPage() {
  const locale: Locale = 'th'
  const company = await getCompany(locale)

  return (
    <main className="min-h-screen pt-24 bg-white relative overflow-hidden font-sans">
      
      {/* 1. BACKGROUND BLOBS - วางตำแหน่งตามรูป */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px] opacity-40" />
      <div className="absolute top-[30%] right-[5%] w-[350px] h-[350px] bg-cyan-300 rounded-full blur-[90px] opacity-40" />
      <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-30" />
      <div className="absolute bottom-[10%] right-[20%] w-[250px] h-[250px] bg-purple-400 rounded-full blur-[80px] opacity-40" />

      <div className="mx-auto max-w-7xl px-6 relative z-10 pb-10">
        
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-6xl font-bold text-black mb-4">
            Contact Us
          </h1>
          <div className="flex justify-start md:ml-20">
             <Breadcrumb />
          </div>
        </header>

        {/* 2. MAIN GLASS CARD */}
        <div className="relative mx-auto max-w-6xl">
          <section className="relative rounded-[40px] border border-white/40 bg-white/30 backdrop-blur-xl shadow-2xl p-10 md:p-20 overflow-hidden">
            
            {/* วงกลมฟุ้งๆ เล็กๆ ภายในการ์ด (ตามรูป) */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-600/40 rounded-full blur-xl" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
              
              {/* Phone Column */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#222] p-4 rounded-2xl mb-4 shadow-lg">
                  <Phone className="text-white w-8 h-8" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-widest">Phone Number</h3>
                <div className="w-40 h-[1px] bg-gray-400 mb-6" />
                <div className="space-y-2">
                  {company.phones.map((p, i) => (
                    <p key={i} className="text-xl md:text-2xl font-bold text-gray-800">
                      {p.number} <span className="font-medium text-gray-600 ml-2">คุณ{p.label}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Email Column */}
              <div className="flex flex-col items-center text-center">
                <div className="bg-[#222] p-4 rounded-2xl mb-4 shadow-lg">
                  <Mail className="text-white w-8 h-8" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-widest">Email Address</h3>
                <div className="w-40 h-[1px] bg-gray-400 mb-6" />
                <div className="space-y-2">
                  {company.email.map((mail, i) => (
                    <p key={i} className="text-xl md:text-2xl font-bold text-gray-800 break-all">
                      {mail}
                    </p>
                  ))}
                </div>
                
                {/* จรวดกระดาษเส้นประ */}
                <div className="absolute bottom-[-20px] right-20 opacity-40">
                   <Image src="/paper-plane-sketch.png" alt="decor" width={100} height={60} />
                </div>
              </div>
            </div>

            {/* Address Footer */}
            <div className="mt-16 flex items-start justify-center gap-4 max-w-3xl mx-auto">
              <MapPin className="text-black w-6 h-6 shrink-0 mt-1" fill="black" />
              <p className="text-lg md:text-xl font-bold text-gray-700 text-center">
                {company.address}
              </p>
            </div>
          </section>

          {/* 3. SOCIAL ICONS - วางมุมขวาล่าง */}
          <div className="flex justify-end gap-3 mt-6">
             <a href="#" className="hover:scale-110 transition-transform">
                <Image src="/icons/line.png" alt="Line" width={45} height={45} className="rounded-xl shadow-lg" />
             </a>
             <a href="#" className="hover:scale-110 transition-transform">
                <Image src="/icons/facebook.png" alt="Facebook" width={45} height={45} className="rounded-xl shadow-lg" />
             </a>
             <a href="#" className="hover:scale-110 transition-transform">
                <Image src="/icons/shopee.png" alt="Shopee" width={45} height={45} className="rounded-xl shadow-lg" />
             </a>
          </div>
        </div>
      </div>

      {/* 4. MAP SECTION */}
      <section className="w-full h-[500px] mt-10 relative">
        <iframe
          title="Map"
          src="https://www.google.com/maps/embed?..." // เปลี่ยนเป็น URL ของบริษัทคุณ
          className="w-full h-full border-none grayscale-[0.2]"
          allowFullScreen
          loading="lazy"
        />
      </section>
    </main>
  )
}