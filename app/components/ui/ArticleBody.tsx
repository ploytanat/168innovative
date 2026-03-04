// components/ui/ArticleBody.tsx  ← สร้างไฟล์ใหม่
'use client'

import { useRef, useEffect } from 'react'

export default function ArticleBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // ตัวอย่าง: เพิ่ม class หรือ behavior ผ่าน ref ได้เลย
    // เช่น ทำ FAQ accordion, anchor link highlight, etc.
    const headings = ref.current.querySelectorAll('h2')
    headings.forEach((h) => {
      h.style.scrollMarginTop = '80px' // offset สำหรับ sticky nav
    })
  }, [html])

  return (
    <article className="mt-12" ref={ref}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}