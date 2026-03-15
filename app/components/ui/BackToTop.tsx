'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0

    const updateVisibility = () => {
      frame = 0
      const nextVisible = window.scrollY > 420
      setVisible((current) => (current === nextVisible ? current : nextVisible))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateVisibility)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`liquid-glass-pill fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-[#1A2535] transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] ${
        visible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-6 scale-95 opacity-0'
      }`}
    >
      <span className="text-lg">↑</span>
    </button>
  )
}
