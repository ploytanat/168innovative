'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`
        cursor-pointer
        fixed bottom-6 right-6 z-50
        rounded-full bg-black/80 p-3 text-white shadow-lg
        backdrop-blur-sm
        transition-all duration-500
        [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
        hover:bg-blackฟฟ
        ${
          visible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'pointer-events-none opacity-0 translate-y-6 scale-95'
        }
      `}
    >
      ↑
    </button>
  )
}
