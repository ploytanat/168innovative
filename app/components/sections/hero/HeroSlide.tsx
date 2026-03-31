'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { HeroSlideView } from '@/app/lib/types/view'
import { BADGE_ICONS, HERO_THEMES, type HeroTheme } from './heroThemes'

type SlideMetric = { value: string; label: string }

const THEME_CONTENT: Record<
  HeroTheme,
  {
    tag: string
    subheading: string
    stats: SlideMetric[]
    visualTitle: string
    visualSubtitle: string
    visualChips: string[]
  }
> = {
  rose: {
    tag: 'ยินดีต้อนรับ',
    subheading: '168 Innovative Co., Ltd.',
    stats: [
      { value: '100+', label: 'รายการสินค้า' },
      { value: '6+', label: 'หมวดหมู่' },
      { value: 'OEM', label: 'รองรับทุกแบรนด์' },
    ],
    visualTitle: '168 Innovative',
    visualSubtitle: 'พาร์ทเนอร์ด้านบรรจุภัณฑ์ OEM/ODM ที่เน้นคุณภาพ ราคาโรงงาน และงานผลิตที่คุยสเปกได้จริง',
    visualChips: ['ราคาโรงงาน', 'Food Grade', 'พร้อมส่ง'],
  },
  sky: {
    tag: 'คอลเลกชันสินค้า',
    subheading: 'สำหรับซองครีม อาหาร และของเหลว',
    stats: [
      { value: '12', label: 'รุ่น Spout' },
      { value: 'HDPE', label: 'วัสดุคุณภาพ' },
      { value: 'OEM', label: 'สั่งผลิตได้' },
    ],
    visualTitle: 'จุก Spout แนะนำ',
    visualSubtitle: 'รุ่นเด่นสำหรับงานบรรจุซอง ใช้งานง่าย ภาพชัดขึ้น และถูกดันให้เป็นจุดโฟกัสหลักของสไลด์นี้',
    visualChips: ['Leak Proof', 'HDPE', 'Refill'],
  },
  violet: {
    tag: 'เครื่องสำอาง',
    subheading: 'ตลับแป้ง · มาสคาร่า · ลิปสติก',
    stats: [
      { value: '4', label: 'ประเภท' },
      { value: 'Premium', label: 'คุณภาพ' },
      { value: 'ODM', label: 'ออกแบบเอง' },
    ],
    visualTitle: 'Mascara Collection',
    visualSubtitle: 'แพ็กเกจจิ้งเครื่องสำอางโทนพรีเมียม พร้อมพื้นที่ภาพใหญ่สำหรับโชว์ทรงสินค้าและวัสดุได้เด่นกว่าเดิม',
    visualChips: ['Premium', 'Private Label', 'Custom Color'],
  },
  emerald: {
    tag: 'บริการของเรา',
    subheading: 'สั่งผลิตตามแบบ ราคาโรงงาน',
    stats: [
      { value: 'Direct', label: 'นำเข้าเอง' },
      { value: 'Fast', label: 'จัดส่งไว' },
      { value: '3', label: 'ช่องทางติดต่อ' },
    ],
    visualTitle: 'OEM / ODM Service',
    visualSubtitle: 'สไลด์บริการยังใช้ภาพใหญ่เหมือนกัน แต่ลดข้อมูลย่อยลงเพื่อให้หน้า hero ดูเบาและเลื่อนชัดขึ้น',
    visualChips: ['Consulting', 'Production', 'Delivery'],
  },
}

interface Props {
  slide: HeroSlideView
  index: number
  isActive: boolean
}

function formatTitle(title: string) {
  const lines = title.split('\n').filter(Boolean)
  const first = lines[0] ?? ''
  const second = lines.slice(1).join(' ') || undefined
  return { first, second }
}

export default function HeroSlide({ slide, index, isActive }: Props) {
  const themeKey = slide.theme ?? 'rose'
  const theme = HERO_THEMES[themeKey]
  const content = THEME_CONTENT[themeKey]
  const subheading = slide.subheading || content.subheading
  const stats = slide.stats?.length ? slide.stats : content.stats
  const visualTitle = slide.visualTitle || content.visualTitle
  const visualSubtitle = slide.visualSubtitle || content.visualSubtitle
  const visualChips = slide.visualChips?.length ? slide.visualChips : content.visualChips
  const title = formatTitle(slide.title)
  const badgeIcon = BADGE_ICONS[slide.badge?.variant ?? 'hot']

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden" style={{ background: theme.pageGradient }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(180,140,130,.12) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        className="absolute -right-16 -top-20 h-[32rem] w-[32rem] rounded-full blur-[72px]"
        style={{ background: theme.blobA, animation: 'heroBlobDrift 11s ease-in-out infinite alternate' }}
      />
      <div
        className="absolute -bottom-16 -left-16 h-[24rem] w-[24rem] rounded-full blur-[72px]"
        style={{ background: theme.blobB, animation: 'heroBlobDrift 14s ease-in-out infinite alternate-reverse' }}
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 pb-12 pt-24 md:px-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-6 lg:px-10 lg:pb-16 lg:pt-28 xl:px-14">
        <div className="max-w-[38rem]">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium"
            style={{
              background: theme.tagBg,
              color: theme.tagText,
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity .5s .1s, transform .5s .1s',
            }}
          >
            <span className="h-[7px] w-[7px] rounded-full" style={{ background: theme.tagText }} />
            <span>{content.tag}</span>
          </div>

          <h2
            className="text-[clamp(2.2rem,4.5vw,4.4rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#2e2820]"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity .55s .2s, transform .55s .2s',
            }}
          >
            {title.first}
            {title.second && (
              <>
                <br />
                <span style={{ color: theme.accentSolid }}>{title.second}</span>
              </>
            )}
          </h2>

          <div
            className="mt-3 text-[clamp(1.05rem,2vw,1.4rem)] font-normal text-[#6e6558]"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity .5s .3s, transform .5s .3s',
            }}
          >
            {subheading}
          </div>

          <p
            className="mt-5 max-w-[35rem] text-[15.5px] leading-8 text-[#6e6558] md:text-[16px]"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity .5s .4s, transform .5s .4s',
            }}
          >
            {slide.description}
          </p>

          <div
            className="mt-8 flex flex-wrap gap-3"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity .5s .5s, transform .5s .5s',
            }}
          >
            <Link
              href={slide.ctaPrimary.href}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium text-white transition hover:-translate-y-0.5"
              style={{ background: theme.accent, boxShadow: `0 10px 28px ${theme.shadow}` }}
            >
              {slide.ctaPrimary.label} <span aria-hidden>→</span>
            </Link>
            {slide.ctaSecondary && (
              <Link
                href={slide.ctaSecondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(180,150,140,.15)] bg-white px-6 py-3.5 text-[15px] font-medium text-[#6e6558] transition hover:-translate-y-0.5"
              >
                {slide.ctaSecondary.label}
              </Link>
            )}
          </div>

          <div
            className="mt-10 grid grid-cols-3 border-t pt-7"
            style={{
              borderColor: 'rgba(180,150,140,.15)',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity .5s .62s, transform .5s .62s',
            }}
          >
            {stats.map((stat, statIndex) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className="px-4 first:pl-0 last:pr-0"
                style={{
                  borderRight: statIndex === stats.length - 1 ? 'none' : '1px solid rgba(180,150,140,.15)',
                }}
              >
                <div className="text-[24px] font-bold leading-none md:text-[28px]" style={{ color: theme.accentSolid }}>
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] tracking-[0.05em] text-[#aea49a] md:text-[12px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateX(0) scale(1)' : 'translateX(40px) scale(.97)',
            transition: 'opacity .65s .2s, transform .75s .2s',
          }}
        >
          <div className="relative mx-auto w-full max-w-[820px] lg:mr-0 lg:ml-auto">
            <div
              className="absolute left-[10%] right-[12%] top-[12%] h-[58%] rounded-full blur-[72px]"
              style={{ background: theme.softAccent, opacity: 0.9 }}
            />

            <div className="relative min-h-[360px] overflow-visible rounded-[34px] border border-white/70 bg-white/42 px-4 pb-4 pt-4 shadow-[0_28px_80px_rgba(46,40,32,0.12)] backdrop-blur-sm sm:min-h-[480px] sm:px-6 sm:pb-6 sm:pt-6 lg:min-h-[650px]">
              <div
                className="absolute right-4 top-4 z-20 max-w-[230px] rounded-[22px] border border-white/80 bg-white/88 p-4 shadow-[0_18px_40px_rgba(46,40,32,0.10)] backdrop-blur-xl sm:right-6 sm:top-6"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(-12px)',
                  transition: 'opacity .5s .42s, transform .5s .42s',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] text-lg font-semibold text-white"
                    style={{ background: theme.accentSolid }}
                  >
                    {badgeIcon}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aea49a]">
                      {slide.badge.text}
                    </div>
                    <div className="mt-1 text-sm font-semibold leading-6 text-[#2e2820]">{visualTitle}</div>
                  </div>
                </div>
                {slide.highlight && (
                  <div className="mt-4 rounded-[16px] border border-[rgba(180,150,140,.15)] bg-[#faf8f5] px-3 py-2.5">
                    <div className="text-[22px] font-bold leading-none" style={{ color: theme.accentSolid }}>
                      {slide.highlight.value}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#6e6558]">
                      {slide.highlight.label}
                    </div>
                  </div>
                )}
              </div>

              <div className="pointer-events-none absolute inset-x-8 bottom-10 z-0 h-10 rounded-full bg-black/10 blur-2xl sm:inset-x-16 sm:h-14" />
              <div className="absolute inset-0 z-10 flex items-center justify-center overflow-visible px-2 sm:px-6">
                <div className="relative h-[92%] w-[108%] sm:w-[112%] lg:w-[118%]">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 54vw, 100vw"
                    className="object-contain drop-shadow-[0_26px_42px_rgba(46,40,32,0.22)] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{
                      transform: isActive ? 'scale(1) translate3d(0,0,0)' : 'scale(1.06) translate3d(18px,0,0)',
                    }}
                  />
                </div>
              </div>

              <div
                className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 sm:bottom-6 sm:left-6"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity .5s .5s, transform .5s .5s',
                }}
              >
                {visualChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/75 bg-white/86 px-3 py-1.5 text-[11px] font-medium text-[#6e6558] shadow-[0_8px_24px_rgba(46,40,32,0.08)] sm:text-[12px]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="relative z-20 -mt-12 ml-auto w-full max-w-[360px] rounded-[24px] border border-white/80 bg-white/92 p-5 shadow-[0_20px_48px_rgba(46,40,32,0.12)] backdrop-blur-xl sm:-mt-16 sm:p-6"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity .55s .58s, transform .55s .58s',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ background: theme.tagBg, color: theme.tagText }}
                >
                  สินค้าแนะนำ
                </span>
                <span className="text-[12px] font-medium text-[#6e6558]">{slide.image.alt}</span>
              </div>
              <h3 className="mt-3 text-[20px] font-bold leading-tight text-[#2e2820]">{visualTitle}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#6e6558] sm:text-[13.5px]">{visualSubtitle}</p>

              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {stats.map((stat) => (
                  <div
                    key={`visual-${stat.value}-${stat.label}`}
                    className="rounded-[16px] border border-[rgba(180,150,140,.15)] bg-[#faf8f5] px-3 py-3"
                  >
                    <div className="text-[15px] font-bold leading-none" style={{ color: theme.accentSolid }}>
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[#aea49a]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
