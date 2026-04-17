interface USPBarProps {
  items: string[]
}

export default function USPBar({ items }: USPBarProps) {
  return (
    <div className="border-b border-[#eee] bg-[#fdfcf5] py-[15px]">
      <div className="mx-auto flex max-w-[1200px] justify-around px-[20px] text-[13px] uppercase text-[#555]">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-[8px]">
            <span className="inline-block h-[20px] w-[20px] rounded-full bg-[#ccc]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
