// components/Footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import { CompanyView } from '@/app/lib/types/view'

interface FooterProps {
  company: CompanyView
  locale: 'th' | 'en'
}

export default function Footer({ company, locale }: FooterProps) {
  const isEN = locale === 'en'

  return (
    <footer className="relative w-full overflow-hidden bg-[#F8FAFC]">
      {/* Decorative Blur - เพิ่มความทันสมัยแบบ Tech Agency */}
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-cyan-100/50 blur-[120px] -z-10" />
      
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Profile - กินพื้นที่ 4/12 */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image
                src={company.logo.src}
                alt={company.logo.alt}
                width={140}
                height={48}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              {company.address}
            </p>
            {/* Social Icons - ย้ายมาไว้ใต้ Brand เพื่อความ Balance */}
            <div className="flex gap-3 mt-2">
              {company.socials.map(s => (
                <a
                  key={s.type}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm hover:border-cyan-500 hover:text-cyan-500 transition-all duration-300"
                >
                  <Image
                    src={s.icon.src}
                    alt={s.icon.alt}
                    width={18}
                    height={18}
                    className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation - กระจายพื้นที่ 8/12 ให้ดูไม่อัดแน่น */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900 mb-6">
                {isEN ? 'Navigation' : 'เมนูหลัก'}
              </h4>
              <ul className="flex flex-col gap-4">
                {['หน้าหลัก', 'หมวดหมู่สินค้า', 'เกี่ยวกับเรา', 'ติดต่อเรา'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-500 hover:text-cyan-600 hover:translate-x-1 transition-all inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Detail */}
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900 mb-6">
                {isEN ? 'Contact' : 'ข้อมูลการติดต่อ'}
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {company.phones.map(p => (
                    <a key={p.number} href={`tel:${p.number}`} className="flex flex-col group">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">{p.label}</span>
                      <span className="text-sm text-slate-600 group-hover:text-cyan-600 transition-colors">{p.number}</span>
                    </a>
                  ))}
                </div>
                <div className="space-y-4">
                  {company.email.map(e => (
                    <a key={e} href={`mailto:${e}`} className="flex flex-col group">
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Email</span>
                      <span className="text-sm text-slate-600 group-hover:text-cyan-600 transition-colors break-all">{e}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            © {new Date().getFullYear()} {company.name}. Crafted with Quality.
          </p>
          <div className="flex gap-6">
             <Link href="#top" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 hover:text-cyan-600 transition-colors">
              {isEN ? 'Back to top ↑' : 'กลับขึ้นด้านบน ↑'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}