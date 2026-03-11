import type { CompanyView } from "@/app/lib/types/view"

type ContactPhoneListProps = {
  phones: CompanyView["phones"]
  locale: "th" | "en"
}

function isOfficeLabel(label: string) {
  const normalized = label.trim().toLowerCase()

  return (
    normalized.includes("สำนักงานใหญ่") ||
    normalized.includes("ติดต่อสำนักงาน") ||
    normalized.includes("head office") ||
    normalized.includes("office")
  )
}

export default function ContactPhoneList({
  phones,
  locale,
}: ContactPhoneListProps) {
  const officePhones = phones.filter((phone) => isOfficeLabel(phone.label))
  const salesPhones = phones.filter((phone) => !isOfficeLabel(phone.label))
  const salesHeading = locale === "th" ? "ฝ่ายขาย" : "Sales Team"

  return (
    <div className="w-full">
      {officePhones.map((phone, index) => (
        <div key={`${phone.number}-${index}`} className="mb-4 last:mb-0">
          <p className="text-2xl font-bold text-gray-800">{phone.number}</p>
          <p className="text-sm font-medium text-gray-500">{phone.label}</p>
        </div>
      ))}

      {officePhones.length > 0 && salesPhones.length > 0 && (
        <div className="mb-4 mt-7">
          <p className="text-xs font-black tracking-[0.18em] text-gray-400">
            {salesHeading}
          </p>
          <div className="mt-3 h-px w-14 bg-black/10" />
        </div>
      )}

      {salesPhones.map((phone, index) => (
        <div key={`${phone.number}-${index}`} className="mb-4 last:mb-0">
          <p className="text-2xl font-bold text-gray-800">{phone.number}</p>
          <p className="text-sm font-medium text-gray-500">{phone.label}</p>
        </div>
      ))}
    </div>
  )
}
