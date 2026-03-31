'use client'

const COPY = {
  th: [
    'บรรจุภัณฑ์เครื่องสำอาง',
    'OEM & ODM',
    'ราคาโรงงาน',
    'จุก Spout',
    'ตลับแป้ง',
    'มาสคาร่า',
    'ฝาพลาสติก',
    'Food Grade',
    'Cosmetic Grade',
    'จัดส่งทั่วประเทศ',
  ],
  en: [
    'Cosmetic Packaging',
    'OEM & ODM',
    'Factory Price',
    'Spout Caps',
    'Compact Cases',
    'Mascara',
    'Plastic Caps',
    'Food Grade',
    'Cosmetic Grade',
    'Nationwide Delivery',
  ],
} as const

export default function HomeTicker({ locale }: { locale: 'th' | 'en' }) {
  const items = [...COPY[locale], ...COPY[locale]]

  return (
    <div className="overflow-hidden bg-[#c96870] py-3">
      <div className="animate-marquee flex gap-12 whitespace-nowrap">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-3 text-[12.5px] font-medium uppercase tracking-[0.12em] text-white/90"
          >
            {item}
            <span className="text-[9px] opacity-50">✿</span>
          </span>
        ))}
      </div>
    </div>
  )
}
