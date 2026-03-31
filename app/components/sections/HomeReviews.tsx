'use client'

const COPY = {
  th: {
    eyebrow: 'รีวิวจากลูกค้า',
    title: 'ลูกค้าพูดถึงเราอย่างไร',
    items: [
      {
        avatar: '👩',
        name: 'คุณนภา ว.',
        role: 'เจ้าของแบรนด์สกินแคร์',
        text: 'สินค้าคุณภาพดีมาก ราคาถูกกว่าเจ้าอื่นเยอะเลย ทีมงานตอบไวมาก จัดส่งก็รวดเร็ว ใช้อยู่ทุกเดือนเลยครับ',
      },
      {
        avatar: '👨',
        name: 'คุณสมชาย ก.',
        role: 'ผู้ผลิตเครื่องสำอาง',
        text: 'ประทับใจมากค่ะ สั่ง OEM ครั้งแรกก็ราบรื่นดี ทีมช่วยแนะนำตลอด ได้สินค้าตรงตามสเปคที่วางไว้ทุกอย่าง',
      },
      {
        avatar: '👩',
        name: 'คุณมาลี ส.',
        role: 'เจ้าของร้านขายส่ง',
        text: 'ซื้อมาหลายปีแล้วค่ะ ไม่เคยผิดหวัง สินค้าตรงปก ราคาดี และบริการหลังการขายดีเยี่ยม แนะนำเลยค่ะ',
      },
    ],
  },
  en: {
    eyebrow: 'Testimonials',
    title: 'What Clients Say',
    items: [
      {
        avatar: '👩',
        name: 'Napa W.',
        role: 'Skincare Brand Owner',
        text: 'Great quality, better pricing than many suppliers, and the team responds quickly every time.',
      },
      {
        avatar: '👨',
        name: 'Somchai K.',
        role: 'Cosmetic Manufacturer',
        text: 'Our first OEM order went smoothly. The team guided us well and delivered according to spec.',
      },
      {
        avatar: '👩',
        name: 'Mali S.',
        role: 'Wholesale Store Owner',
        text: 'We have ordered for years and the service has remained reliable, fast, and consistent.',
      },
    ],
  },
} as const

const AVATAR_BG = ['#fdeef0', '#e4f5f0', '#ede8f8']

export default function HomeReviews({ locale }: { locale: 'th' | 'en' }) {
  const copy = COPY[locale]

  return (
    <section className="bg-[linear-gradient(160deg,#fdeef0_0%,#fff_50%,#e4f5f0_100%)] py-20">
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="text-center">
          <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c96870]">
            {copy.eyebrow}
          </span>
          <h2 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.25] text-[#2e2820]">
            {copy.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {copy.items.map((item, index) => (
            <div
              key={item.name}
              className="rounded-2xl border border-[rgba(180,150,140,.15)] bg-white p-6 shadow-[0_4px_20px_rgba(150,110,100,.10)]"
            >
              <div className="mb-4 text-[16px] tracking-[2px] text-[#f5b942]">★★★★★</div>
              <div className="text-[15px] leading-8 text-[#6e6558]">{item.text}</div>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="grid h-[42px] w-[42px] place-items-center rounded-full text-[18px]"
                  style={{ background: AVATAR_BG[index] }}
                >
                  {item.avatar}
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold text-[#2e2820]">{item.name}</div>
                  <div className="text-[12.5px] text-[#aea49a]">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
