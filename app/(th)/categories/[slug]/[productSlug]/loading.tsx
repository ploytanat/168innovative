export default function Loading() {
  return <div className="catalog-loading" role="status" aria-live="polite">
    <p>กำลังโหลดรายละเอียดสินค้า…</p>
    <div className="catalog-loading-grid" aria-hidden="true"><div /><div /></div>
  </div>
}
