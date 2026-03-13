"use client"

import Image from "next/image"
import Link from "next/link"

import { uiText } from "@/app/lib/i18n/ui"
import { ProductView } from "@/app/lib/types/view"
import { withLocalePath } from "@/app/lib/utils/withLocalePath"

/* ─────────────────────────────
   spotlight slugs
───────────────────────────── */

const PRIMARY_SLUG   = "oil-spout-os200"
const SECONDARY_SLUG = "coffee-bag-valve-hl400-40mm"

const PRIMARY_META = {
  badge:      { th: "สินค้าเด่น · Spout",        en: "Featured · Spout"   },
  accentText: "#2d6b57",
  accentBg:   "#ddf0ea",
  imageBg:    "#eef4f2",
}

const SECONDARY_META = {
  badge:      { th: "สินค้าใหม่ · Coffee Valve", en: "New · Coffee Valve" },
  accentText: "#7a4a1e",
  accentBg:   "#f2e9dc",
  imageBg:    "#f7f2ec",
}

const BORDER = "0.5px solid rgba(0,0,0,0.09)"

/* desktop height constants */
const PANEL_H   = 560
const SEC_IMG_H = 220
const FOOTER_H  = 82

interface ProductMarqueeProps {
  items:  ProductView[]
  locale: "th" | "en"
}

export default function ProductMarquee({ items, locale }: ProductMarqueeProps) {
  if (!items.length) return null

  const isSpoutShowcase = items.every((i) => i.categorySlug === "spout")
  const secondaryItem   = items.find((i) => i.slug === SECONDARY_SLUG) ?? null

  let primaryItem = items.find((i) => i.slug === PRIMARY_SLUG) ?? null
  if (!primaryItem) primaryItem = items.find((i) => i.slug !== SECONDARY_SLUG) ?? null
  if (items.length === 1) primaryItem = null

  const restItems = items.filter(
    (i) => i.slug !== PRIMARY_SLUG && i.slug !== SECONDARY_SLUG,
  )

  const ctaHref      = isSpoutShowcase ? "/categories/spout" : "/categories"
  const ctaLabel     = isSpoutShowcase ? uiText.viewAllSpoutProducts[locale] : uiText.viewAllProducts[locale]
  const sectionTitle = isSpoutShowcase ? uiText.spoutProducts[locale] : uiText.featuredProducts[locale]

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .pm-img, .pm-thumb-img { transition: none !important; }
          .pm-pulse               { animation:  none !important; }
        }
        .pm-primary:hover .pm-img     { transform: scale(1.05); }
        .pm-sec:hover     .pm-img     { transform: scale(1.05); }
        .pm-thumb:hover .pm-thumb-img { transform: scale(1.07); }
        .pm-img {
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
          will-change: transform;
        }
        .pm-thumb-img {
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
          will-change: transform;
        }
        .pm-thumb {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .pm-thumb:hover {
          border-color: rgba(0,0,0,0.18) !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }
        @keyframes pm-pulse {
          0%,100% { opacity:1;  transform:scale(1);   }
          50%      { opacity:.4; transform:scale(1.6); }
        }
        .pm-pulse {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
          animation: pm-pulse 2.2s ease-in-out infinite;
          vertical-align: middle;
          margin-right: 5px;
          flex-shrink: 0;
        }
        .pm-primary .pm-desc {
          max-height: 0; overflow: hidden; opacity: 0;
          transition: max-height 0.4s ease, opacity 0.3s ease 0.05s;
        }
        .pm-primary:hover .pm-desc { max-height: 4rem; opacity: 1; }
        .pm-thumb-name { transition: color 0.18s ease; }
        .pm-thumb:hover .pm-thumb-name { color: #1a2332 !important; }
        .pm-hscroll { scrollbar-width: none; }
        .pm-hscroll::-webkit-scrollbar { display: none; }

        /* mobile: show only mobile section */
        @media (min-width: 1024px) {
          .pm-mobile { display: none !important; }
        }
        @media (max-width: 1023px) {
          .pm-desktop { display: none !important; }
        }
      `}</style>

      <section style={{ background: "#f3f5f7", padding: "52px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px" }}>

          {/* ── HEADER ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9eaab8", marginBottom: "6px" }}>
                Product Focus
              </p>
              <h2 style={{ fontSize: "22px", fontWeight: 500, letterSpacing: "-0.02em", color: "#1a2332", lineHeight: 1.2 }}>
                {sectionTitle}
              </h2>
            </div>
            <Link
              href={withLocalePath(ctaHref, locale)}
              className="hidden md:block"
              style={{ fontSize: "12px", fontWeight: 500, color: "#64748b", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "#c0cad4", whiteSpace: "nowrap" }}
            >
              {ctaLabel} →
            </Link>
          </div>

          {/* ═══════════════════════════
              DESKTOP ONLY
          ═══════════════════════════ */}
          <div
            className="pm-desktop"
            style={{ display: "flex", gap: "10px", height: `${PANEL_H}px` }}
          >
            {/* PRIMARY */}
            {primaryItem && (
              <Link
                href={withLocalePath(`/categories/${primaryItem.categorySlug}/${primaryItem.slug}`, locale)}
                className="pm-primary"
                style={{
                  flex: "0 0 58%",
                  borderRadius: "14px",
                  border: BORDER,
                  overflow: "hidden",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  height: `${PANEL_H}px`,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: `${PANEL_H - FOOTER_H}px`,
                    flexShrink: 0,
                    background: PRIMARY_META.imageBg,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={primaryItem.image.src}
                    alt={primaryItem.image.alt || primaryItem.name}
                    fill
                    sizes="58vw"
                    className="pm-img"
                    style={{ objectFit: "contain", padding: "40px" }}
                    priority
                  />
                </div>
                <div
                  style={{
                    height: `${FOOTER_H}px`,
                    flexShrink: 0,
                    padding: "0 22px",
                    borderTop: BORDER,
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "5px",
                  }}
                >
                  <span style={{ display: "inline-block", width: "fit-content", fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", background: PRIMARY_META.accentBg, color: PRIMARY_META.accentText, padding: "3px 8px", borderRadius: "4px" }}>
                    {PRIMARY_META.badge[locale]}
                  </span>
                  <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1a2332", lineHeight: 1.35, margin: 0 }}>
                    {primaryItem.name}
                  </h3>
                  {primaryItem.description && (
                    <p className="pm-desc" style={{ fontSize: "11px", color: "#7a8fa6", margin: 0, lineHeight: 1.5 }}>
                      {primaryItem.description}
                    </p>
                  )}
                </div>
              </Link>
            )}

            {/* RIGHT COLUMN */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                height: `${PANEL_H}px`,
                minWidth: 0,
              }}
            >
              {/* SECONDARY */}
              {secondaryItem && (
                <Link
                  href={withLocalePath(`/categories/${secondaryItem.categorySlug}/${secondaryItem.slug}`, locale)}
                  className="pm-sec"
                  style={{
                    height: `${SEC_IMG_H + FOOTER_H}px`,
                    flexShrink: 0,
                    borderRadius: "14px",
                    border: BORDER,
                    overflow: "hidden",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: `${SEC_IMG_H}px`,
                      flexShrink: 0,
                      background: SECONDARY_META.imageBg,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={secondaryItem.image.src}
                      alt={secondaryItem.image.alt || secondaryItem.name}
                      fill
                      sizes="42vw"
                      className="pm-img"
                      style={{ objectFit: "contain", padding: "28px" }}
                    />
                  </div>
                  <div
                    style={{
                      height: `${FOOTER_H}px`,
                      flexShrink: 0,
                      padding: "0 18px",
                      borderTop: BORDER,
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", width: "fit-content", fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", background: SECONDARY_META.accentBg, color: SECONDARY_META.accentText, padding: "3px 8px", borderRadius: "4px" }}>
                      <span className="pm-pulse" />
                      {SECONDARY_META.badge[locale]}
                    </span>
                    <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#1a2332", lineHeight: 1.35, margin: 0 }}>
                      {secondaryItem.name}
                    </h3>
                  </div>
                </Link>
              )}

              {/* MINI GRID */}
              {restItems.length > 0 && (
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    borderRadius: "14px",
                    border: BORDER,
                    background: "#fff",
                    padding: "14px 16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b0bac5", marginBottom: "10px", flexShrink: 0 }}>
                    {locale === "th" ? "สินค้าอื่นๆ" : "More products"}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gridTemplateRows: "repeat(2, 1fr)",
                      gap: "8px",
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    {restItems.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
                        className="pm-thumb"
                        style={{
                          borderRadius: "9px",
                          border: BORDER,
                          overflow: "hidden",
                          background: "#fff",
                          display: "flex",
                          flexDirection: "column",
                          minHeight: 0,
                        }}
                      >
                        {/* image: use paddingTop trick instead of fill so height is predictable */}
                        <div style={{ position: "relative", paddingTop: "70%", background: "#f3f5f7", overflow: "hidden", flexShrink: 0 }}>
                          <Image
                            src={item.image.src}
                            alt={item.image.alt || item.name}
                            fill
                            sizes="5rem"
                            className="pm-thumb-img"
                            style={{ objectFit: "contain", padding: "12%" }}
                          />
                        </div>
                        <div style={{ flex: 1, padding: "5px 7px 6px" }}>
                          <p
                            className="pm-thumb-name"
                            style={{
                              fontSize: "9.5px",
                              lineHeight: 1.35,
                              color: "#64748b",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              margin: 0,
                            }}
                          >
                            {item.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {restItems.length > 6 && (
                    <Link
                      href={withLocalePath(ctaHref, locale)}
                      style={{ display: "block", marginTop: "10px", fontSize: "11px", color: "#64748b", textAlign: "center", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "#c0cad4", flexShrink: 0 }}
                    >
                      {locale === "th" ? `ดูทั้งหมด ${restItems.length} รายการ →` : `View all ${restItems.length} →`}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════
              MOBILE ONLY
          ═══════════════════════════ */}
          <div className="pm-mobile" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

            {/* primary card */}
            {primaryItem && (
              <Link
                href={withLocalePath(`/categories/${primaryItem.categorySlug}/${primaryItem.slug}`, locale)}
                style={{ borderRadius: "12px", border: BORDER, overflow: "hidden", background: "#fff", display: "flex", height: "110px" }}
              >
                <div style={{ position: "relative", width: "110px", flexShrink: 0, background: PRIMARY_META.imageBg }}>
                  <Image src={primaryItem.image.src} alt={primaryItem.image.alt || primaryItem.name} fill sizes="110px" style={{ objectFit: "contain", padding: "14px" }} />
                </div>
                <div style={{ padding: "14px 16px", borderLeft: BORDER, display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px", minWidth: 0 }}>
                  <span style={{ display: "inline-block", width: "fit-content", fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", background: PRIMARY_META.accentBg, color: PRIMARY_META.accentText, padding: "2px 7px", borderRadius: "4px" }}>
                    {PRIMARY_META.badge[locale]}
                  </span>
                  <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#1a2332", lineHeight: 1.35, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {primaryItem.name}
                  </h3>
                </div>
              </Link>
            )}

            {/* secondary card */}
            {secondaryItem && (
              <Link
                href={withLocalePath(`/categories/${secondaryItem.categorySlug}/${secondaryItem.slug}`, locale)}
                style={{ borderRadius: "12px", border: BORDER, overflow: "hidden", background: "#fff", display: "flex", height: "110px" }}
              >
                <div style={{ position: "relative", width: "110px", flexShrink: 0, background: SECONDARY_META.imageBg }}>
                  <Image src={secondaryItem.image.src} alt={secondaryItem.image.alt || secondaryItem.name} fill sizes="110px" style={{ objectFit: "contain", padding: "14px" }} />
                </div>
                <div style={{ padding: "14px 16px", borderLeft: BORDER, display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px", minWidth: 0 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", width: "fit-content", fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", background: SECONDARY_META.accentBg, color: SECONDARY_META.accentText, padding: "2px 7px", borderRadius: "4px" }}>
                    <span className="pm-pulse" />
                    {SECONDARY_META.badge[locale]}
                  </span>
                  <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#1a2332", lineHeight: 1.35, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {secondaryItem.name}
                  </h3>
                </div>
              </Link>
            )}

            {/* horizontal scroll strip */}
            {restItems.length > 0 && (
              <div className="pm-hscroll" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
                {restItems.slice(0, 8).map((item) => (
                  <Link
                    key={item.id}
                    href={withLocalePath(`/categories/${item.categorySlug}/${item.slug}`, locale)}
                    style={{ flexShrink: 0, width: "88px", borderRadius: "10px", border: BORDER, overflow: "hidden", background: "#fff" }}
                  >
                    <div style={{ position: "relative", width: "88px", height: "88px", background: "#f3f5f7" }}>
                      <Image src={item.image.src} alt={item.image.alt || item.name} fill sizes="88px" style={{ objectFit: "contain", padding: "14%" }} />
                    </div>
                    <div style={{ padding: "5px 7px 7px" }}>
                      <p style={{ fontSize: "9.5px", color: "#64748b", lineHeight: 1.35, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", margin: 0 }}>
                        {item.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href={withLocalePath(ctaHref, locale)}
              style={{ fontSize: "12px", fontWeight: 500, color: "#64748b", textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "#c0cad4", paddingTop: "4px" }}
            >
              {ctaLabel} →
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}