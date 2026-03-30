import type { ProductSpecView } from "@/app/lib/types/view"

interface Props {
  specs: ProductSpecView[]
}

export default function CatalogDetailSpecs({ specs }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {specs.map((spec, index) => (
        <div
          key={`${spec.label}-${index}`}
          className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
        >
          <dt className="text-sm font-medium text-slate-500">{spec.label}</dt>
          <dd className="text-sm font-semibold text-slate-950">{spec.value}</dd>
        </div>
      ))}
    </div>
  )
}
