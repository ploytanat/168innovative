export default function PromoBanner() {
  return (
    <div className="sticky top-0 z-70 flex items-center justify-center gap-3 bg-[#5a8e6d] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.04em] text-white sm:text-[12px]">
      <span>บรรจุภัณฑ์ OEM/ODM ครบวงจร — ตัวอย่างฟรี ไม่มีค่าใช้จ่าย</span>
      <span className="hidden h-3.5 w-px bg-white/30 sm:block" />
      <span className="hidden text-white/80 sm:inline">
        รับใบเสนอราคาภายใน 24 ชม. · ส่งทั่วประเทศ
      </span>
    </div>
  )
}
