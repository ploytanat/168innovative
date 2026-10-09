"use client"

import { useEffect, useRef, useState } from "react"

export default function FacebookPageFeed({ pageUrl, locale }: { pageUrl: string; locale: "th" | "en" }) {
  const container = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [nearby, setNearby] = useState(false)

  useEffect(() => {
    const element = container.current
    if (!element) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const measure = () => setWidth(Math.max(180, Math.min(500, Math.floor(element.getBoundingClientRect().width))))
    measure()
    const resize = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(measure, 200)
    })
    resize.observe(element)
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNearby(true)
        observer.disconnect()
      }
    }, { rootMargin: "300px" })
    observer.observe(element)
    return () => { clearTimeout(timer); resize.disconnect(); observer.disconnect() }
  }, [])

  const parameters = new URLSearchParams({
    href: pageUrl, tabs: "timeline", width: String(width || 500), height: "400",
    small_header: "true", adapt_container_width: "true", hide_cover: "false",
    show_facepile: "false", locale: locale === "th" ? "th_TH" : "en_US",
  })

  return <div ref={container} className="facebook-feed-frame">
    {nearby && width > 0 ? <iframe
      src={`https://www.facebook.com/plugins/page.php?${parameters}`}
      title={locale === "th" ? "โพสต์จากเพจ Facebook ของ 168 Innovative" : "Posts from the 168 Innovative Facebook page"}
      width={width} height="400" loading="lazy"
      allow="encrypted-media; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
    /> : <p className="facebook-feed-placeholder">{locale === "th" ? "โพสต์จากเพจ Facebook" : "Posts from our Facebook page"}</p>}
  </div>
}
