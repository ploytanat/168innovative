'use client'

import { useState } from 'react'

interface StatusToggleProps {
  name?: string
  defaultChecked?: boolean
  label?: string
  onChange?: (checked: boolean) => void
}

export default function StatusToggle({
  name = 'is_published',
  defaultChecked = false,
  label,
  onChange,
}: StatusToggleProps) {
  const [checked, setChecked] = useState(defaultChecked)

  const handleChange = () => {
    const next = !checked
    setChecked(next)
    onChange?.(next)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-green-600' : 'bg-gray-700'
        }`}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <input type="hidden" name={name} value={checked ? '1' : '0'} />
      <span className={`text-sm ${checked ? 'text-green-400' : 'text-gray-500'}`}>
        {label ?? (checked ? 'Published' : 'Draft')}
      </span>
    </div>
  )
}
