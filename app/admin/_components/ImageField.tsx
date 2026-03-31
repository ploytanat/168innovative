'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface ImageFieldProps {
  name: string
  label?: string
  value?: string
  altNameTh?: string
  altNameEn?: string
  altValueTh?: string
  altValueEn?: string
}

export default function ImageField({
  name,
  label = 'Image URL',
  value = '',
  altNameTh,
  altNameEn,
  altValueTh = '',
  altValueEn = '',
}: ImageFieldProps) {
  const [url, setUrl] = useState(value)

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <input
          type="text"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Preview */}
      {url && (
        <div className="w-24 h-24 rounded-lg border border-gray-700 overflow-hidden bg-gray-800 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden flex-col items-center text-gray-600">
            <ImageIcon size={24} />
            <span className="text-xs mt-1">Error</span>
          </div>
        </div>
      )}

      {/* Alt text fields */}
      {(altNameTh || altNameEn) && (
        <div className="grid grid-cols-2 gap-3">
          {altNameTh && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alt (TH)</label>
              <input
                type="text"
                name={altNameTh}
                defaultValue={altValueTh}
                placeholder="คำอธิบายรูปภาพ"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          {altNameEn && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alt (EN)</label>
              <input
                type="text"
                name={altNameEn}
                defaultValue={altValueEn}
                placeholder="Image description"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
