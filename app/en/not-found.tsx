"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=Noto+Sans+Thai:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f8f7f4;
          overflow: hidden;
        }

        .page {
          font-family: 'Noto Sans Thai', 'Syne', sans-serif;
          min-height: 100vh;
          background: #f8f7f4;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Soft background blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: rgba(255, 160, 80, 0.12);
          top: -120px; right: -80px;
          animation: driftA 12s ease-in-out infinite;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: rgba(255, 120, 50, 0.08);
          bottom: -100px; left: -60px;
          animation: driftB 15s ease-in-out infinite;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: rgba(255, 200, 120, 0.1);
          top: 40%; left: 40%;
          animation: driftA 18s ease-in-out infinite reverse;
        }

        @keyframes driftA {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -25px); }
        }
        @keyframes driftB {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 20px); }
        }

        /* Main content */
        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .content.ready {
          opacity: 1;
          transform: translateY(0);
        }

        /* 404 number wrapper */
        .num-wrap {
          position: relative;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .big-404 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: clamp(100px, 20vw, 220px);
          line-height: 1;
          letter-spacing: -0.03em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(200, 110, 40, 0.2);
        }

        .big-404-fill {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: clamp(100px, 20vw, 220px);
          line-height: 1;
          letter-spacing: -0.03em;
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #f5a058 0%, #e8724a 60%, #f0956a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.5;
        }

        /* Thin rule */
        .rule {
          width: 36px;
          height: 1px;
          background: rgba(200, 110, 40, 0.25);
          margin: 0 auto 1.5rem;
        }

        /* Heading */
        .heading-th {
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 500;
          color: #2c2016;
          margin-bottom: 0.6rem;
        }

        /* Sub text */
        .subtext {
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: clamp(0.8rem, 1.4vw, 0.9rem);
          color: rgba(60, 40, 20, 0.42);
          font-weight: 300;
          line-height: 1.85;
          margin-bottom: 2.5rem;
        }

        /* Buttons */
        .btn-group {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.65rem 1.75rem;
          background: #e8724a;
          color: #fff;
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 12px rgba(232, 114, 74, 0.22);
        }
        .btn-primary:hover {
          background: #d9603a;
          box-shadow: 0 4px 20px rgba(232, 114, 74, 0.32);
          transform: translateY(-1px);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.65rem 1.75rem;
          background: transparent;
          color: rgba(60, 40, 20, 0.45);
          font-family: 'Noto Sans Thai', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          text-decoration: none;
          border-radius: 100px;
          border: 1px solid rgba(60, 40, 20, 0.14);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          border-color: rgba(200, 110, 40, 0.3);
          color: #c06a30;
          background: rgba(200, 110, 40, 0.04);
        }

        /* Brand badge */
        .brand-badge {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(60, 40, 20, 0.18);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          white-space: nowrap;
        }
      `}</style>

      <div className="page">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className={`content ${mounted ? "ready" : ""}`}>
          <div className="num-wrap">
            <div className="big-404">404</div>
            <div className="big-404-fill">404</div>
          </div>

          <div className="rule" />

          <h1 className="heading-th">ไม่พบหน้าที่คุณต้องการ</h1>
          <p className="subtext">
            หน้านี้อาจถูกย้าย ลบ หรือไม่เคยมีอยู่
            <br />
            Page not found or may have been moved
          </p>

          <div className="btn-group">
            <Link href="/" className="btn-primary">
              ← กลับหน้าแรก
            </Link>
            <Link href="/contact" className="btn-secondary">
              ติดต่อเรา
            </Link>
          </div>
        </div>

        <div className="brand-badge">168innovative</div>
      </div>
    </>
  );
}