'use client'

import { useState } from 'react'

interface BilingualFieldProps {
  name: string
  labelTh?: string
  labelEn?: string
  valueTh?: string
  valueEn?: string
  type?: 'input' | 'textarea' | 'richtext'
  required?: boolean
  placeholder?: string
}

export default function BilingualField({
  name,
  labelTh = 'ภาษาไทย',
  labelEn = 'English',
  valueTh = '',
  valueEn = '',
  type = 'input',
  required = false,
  placeholder = '',
}: BilingualFieldProps) {
  const [tab, setTab] = useState<'th' | 'en'>('th')

  const baseClass =
    'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

  return (
    <div className="space-y-2">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab('th')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            tab === 'th'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          TH
        </button>
        <button
          type="button"
          onClick={() => setTab('en')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            tab === 'en'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>

      {/* TH field */}
      <div className={tab === 'th' ? 'block' : 'hidden'}>
        <label className="block text-xs text-gray-400 mb-1">{labelTh}</label>
        {type === 'input' ? (
          <input
            type="text"
            name={`${name}_th`}
            defaultValue={valueTh}
            required={required}
            placeholder={placeholder}
            className={baseClass}
          />
        ) : (
          <textarea
            name={`${name}_th`}
            defaultValue={valueTh}
            required={required}
            placeholder={placeholder}
            rows={type === 'richtext' ? 10 : 4}
            className={`${baseClass} resize-y font-mono text-xs`}
          />
        )}
      </div>

      {/* EN field */}
      <div className={tab === 'en' ? 'block' : 'hidden'}>
        <label className="block text-xs text-gray-400 mb-1">{labelEn}</label>
        {type === 'input' ? (
          <input
            type="text"
            name={`${name}_en`}
            defaultValue={valueEn}
            placeholder={placeholder}
            className={baseClass}
          />
        ) : (
          <textarea
            name={`${name}_en`}
            defaultValue={valueEn}
            placeholder={placeholder}
            rows={type === 'richtext' ? 10 : 4}
            className={`${baseClass} resize-y font-mono text-xs`}
          />
        )}
      </div>
    </div>
  )
}
