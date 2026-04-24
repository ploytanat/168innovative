export default function PromoBanner() {
  return (
    <div className="sticky top-0 z-70 flex items-center justify-center gap-3 bg-[linear-gradient(90deg,#24457c_0%,#3a7bd5_48%,#2ab8b0_100%)] px-4 py-2 text-center text-[11px] font-extrabold tracking-[0.04em] text-white shadow-[0_8px_24px_rgba(58,123,213,.16)] sm:text-[12px]">
      <span>บรรจุภัณฑ์ OEM/ODM ครบวงจร — ตัวอย่างฟรี ไม่มีค่าใช้จ่าย</span>
      <span className="hidden h-3.5 w-px bg-white/30 sm:block" />
      <span className="hidden text-white/90 sm:inline">
        รับใบเสนอราคาภายใน 24 ชม. · ส่งทั่วประเทศ
      </span>
    </div>
  )
}
