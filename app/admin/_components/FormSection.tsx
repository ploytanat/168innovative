interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export default function FormSection({ title, description, children, className = '' }: FormSectionProps) {
  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 p-6 ${className}`}>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
