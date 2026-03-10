import Link from "next/link"

type Locale = "th" | "en"

const copy = {
  th: {
    heading: "ไม่พบหน้าที่คุณต้องการ",
    description:
      "หน้านี้อาจถูกย้าย ลบ หรือไม่เคยมีอยู่ ลองกลับไปหน้าแรกหรือติดต่อทีมงานของเรา",
    homeHref: "/",
    homeLabel: "กลับหน้าแรก",
    contactHref: "/contact",
    contactLabel: "ติดต่อเรา",
  },
  en: {
    heading: "Page not found",
    description:
      "This page may have been moved, deleted, or never existed. Try returning home or contact our team.",
    homeHref: "/en",
    homeLabel: "Back Home",
    contactHref: "/en/contact",
    contactLabel: "Contact Us",
  },
} as const

export default function NotFoundView({ locale }: { locale: Locale }) {
  const text = copy[locale]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=Noto+Sans+Thai:wght@300;400;500&display=swap');

        body {
          background: #f8f7f4;
          overflow: hidden;
        }

        .page {
          position: relative;
          display: flex;
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #f8f7f4;
          font-family: 'Noto Sans Thai', 'Syne', sans-serif;
        }

        .blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .blob-1 {
          top: -120px;
          right: -80px;
          width: 500px;
          height: 500px;
          background: rgba(255, 160, 80, 0.12);
          animation: driftA 12s ease-in-out infinite;
        }

        .blob-2 {
          bottom: -100px;
          left: -60px;
          width: 400px;
          height: 400px;
          background: rgba(255, 120, 50, 0.08);
          animation: driftB 15s ease-in-out infinite;
        }

        .blob-3 {
          top: 40%;
          left: 40%;
          width: 300px;
          height: 300px;
          background: rgba(255, 200, 120, 0.1);
          animation: driftA 18s ease-in-out infinite reverse;
        }

        .content {
          position: relative;
          z-index: 10;
          max-width: 40rem;
          padding: 2rem;
          text-align: center;
          animation: contentEnter 0.8s ease both;
        }

        .num-wrap {
          position: relative;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .big-404,
        .big-404-fill {
          font-family: 'Syne', sans-serif;
          font-size: clamp(100px, 20vw, 220px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .big-404 {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(200, 110, 40, 0.2);
        }

        .big-404-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #f5a058 0%, #e8724a 60%, #f0956a 100%);
          opacity: 0.5;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rule {
          width: 36px;
          height: 1px;
          margin: 0 auto 1.5rem;
          background: rgba(200, 110, 40, 0.25);
        }

        .heading {
          margin-bottom: 0.6rem;
          color: #2c2016;
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 500;
        }

        .subtext {
          margin-bottom: 2.5rem;
          color: rgba(60, 40, 20, 0.42);
          font-size: clamp(0.85rem, 1.4vw, 0.95rem);
          font-weight: 300;
          line-height: 1.85;
        }

        .btn-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 9999px;
          padding: 0.65rem 1.75rem;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .btn-primary {
          border: none;
          background: #e8724a;
          color: #fff;
          box-shadow: 0 2px 12px rgba(232, 114, 74, 0.22);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          background: #d9603a;
          box-shadow: 0 4px 20px rgba(232, 114, 74, 0.32);
        }

        .btn-secondary {
          border: 1px solid rgba(60, 40, 20, 0.14);
          background: transparent;
          color: rgba(60, 40, 20, 0.45);
        }

        .btn-secondary:hover {
          border-color: rgba(200, 110, 40, 0.3);
          background: rgba(200, 110, 40, 0.04);
          color: #c06a30;
        }

        .brand-badge {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(60, 40, 20, 0.18);
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        @keyframes contentEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes driftA {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -25px); }
        }

        @keyframes driftB {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 20px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .blob,
          .content {
            animation: none;
          }
        }
      `}</style>

      <div className="page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="content">
          <div className="num-wrap">
            <div className="big-404">404</div>
            <div className="big-404-fill">404</div>
          </div>

          <div className="rule" />

          <h1 className="heading">{text.heading}</h1>
          <p className="subtext">{text.description}</p>

          <div className="btn-group">
            <Link href={text.homeHref} className="btn-primary">
              {locale === "th" ? "← " : ""}
              {text.homeLabel}
            </Link>
            <Link href={text.contactHref} className="btn-secondary">
              {text.contactLabel}
            </Link>
          </div>
        </div>

        <div className="brand-badge">168innovative</div>
      </div>
    </>
  )
}
