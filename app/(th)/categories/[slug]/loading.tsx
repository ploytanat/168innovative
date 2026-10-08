export default function Loading() {
  return <div className="catalog-loading" role="status" aria-live="polite">
    <p>กำลังโหลดสินค้า…</p>
    <div className="catalog-loading-grid" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <div key={i} />)}</div>
  </div>
}
