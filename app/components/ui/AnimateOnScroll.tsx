'use client'

import { useEffect } from 'react'

/**
 * Tiny IntersectionObserver that adds `.in-view` to every [data-animate] element
 * when it enters the viewport. Uses only opacity + transform (GPU-composited).
 * Self-contained: no external deps, ~0.5 KB minified.
 */
export default function AnimateOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-animate]')
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target) // fire once, then stop watching
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
