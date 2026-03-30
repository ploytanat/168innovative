interface Props {
  specs: Record<string, string>
}

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function ProductSpecs({ specs }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {Object.entries(specs).map(([key, value]) => (
        <div
          key={key}
          className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:grid-cols-[220px_1fr]"
        >
          <dt className="text-sm font-medium text-slate-500">{formatLabel(key)}</dt>
          <dd className="text-sm font-semibold text-slate-950">{value}</dd>
        </div>
      ))}
    </div>
  )
}
