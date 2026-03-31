'use client'

const COPY = {
  th: {
    eyebrow: 'วิธีการสั่งซื้อ',
    title: 'สั่งง่าย 4 ขั้นตอน',
    desc: 'ไม่ต้องยุ่งยาก ทีมงานดูแลตั้งแต่ต้นจนจบ',
    steps: [
      {
        icon: '💬',
        title: 'ติดต่อสอบถาม',
        desc: 'แจ้งความต้องการ ประเภทสินค้า ปริมาณ และสเปคที่ต้องการ ผ่าน LINE หรือโทรศัพท์',
      },
      {
        icon: '📋',
        title: 'รับใบเสนอราคา',
        desc: 'ทีมงานส่งใบเสนอราคาให้รวดเร็ว พร้อมรายละเอียดสินค้าและระยะเวลาจัดส่ง',
      },
      {
        icon: '✅',
        title: 'ยืนยันและชำระเงิน',
        desc: 'ยืนยันออเดอร์และชำระเงิน รองรับหลายช่องทาง สะดวก ปลอดภัย',
      },
      {
        icon: '📦',
        title: 'จัดส่งถึงมือคุณ',
        desc: 'แพ็คสินค้าอย่างดี จัดส่งทั่วประเทศ มีระบบแจ้งเลข Tracking ทุกออเดอร์',
      },
    ],
  },
  en: {
    eyebrow: 'Order Process',
    title: '4 Simple Steps',
    desc: 'A straightforward flow from inquiry to delivery.',
    steps: [
      {
        icon: '💬',
        title: 'Send Inquiry',
        desc: 'Share the product type, quantity, and required specification through LINE or phone.',
      },
      {
        icon: '📋',
        title: 'Receive Quote',
        desc: 'Our team prepares a quotation quickly with key details and delivery timing.',
      },
      {
        icon: '✅',
        title: 'Confirm Order',
        desc: 'Approve the order and complete payment through convenient channels.',
      },
      {
        icon: '📦',
        title: 'Delivery',
        desc: 'We pack carefully and ship nationwide with tracking support.',
      },
    ],
  },
} as const

const COLORS = ['#fdeef0', '#e4f5f0', '#ede8f8', '#fdf0e4']

export default function HomeProcess({ locale }: { locale: 'th' | 'en' }) {
  const copy = COPY[locale]

  return (
    <section id="process" className="bg-[#faf8f5] py-20">
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="text-center">
          <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c96870]">
            {copy.eyebrow}
          </span>
          <h2 className="text-[clamp(26px,3.5vw,38px)] font-bold leading-[1.25] text-[#2e2820]">
            {copy.title}
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[16px] leading-8 text-[#6e6558]">
            {copy.desc}
          </p>
        </div>

        <div className="relative mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-[2px] bg-[linear-gradient(90deg,#f5d0d4,#e4f5f0,#ede8f8,#fdf0e4)] lg:block" />

          {copy.steps.map((step, index) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center px-4 text-center">
              <div
                className="mb-4 grid h-16 w-16 place-items-center rounded-full border-[3px] border-white text-[26px] shadow-[0_4px_16px_rgba(150,110,100,.10)]"
                style={{ background: COLORS[index] }}
              >
                {step.icon}
              </div>
              <div className="text-[16px] font-bold text-[#2e2820]">{step.title}</div>
              <div className="mt-2 text-[13.5px] leading-7 text-[#6e6558]">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
