"use client"

import "./admin.css"
import { useState, useEffect, useCallback, useRef, useId, useMemo } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface WPProduct {
  id: number
  slug: string
  status: "publish" | "draft" | "pending" | "private"
  title: { rendered: string }
  date?: string
  featured_media?: number
  featured_image_url?: string
  product_category?: number[]
  acf?: {
    name_th?: string; name_en?: string
    description_th?: string; description_en?: string
    content_th?: string; content_en?: string
    application_th?: string; application_en?: string
    image_alt_th?: string; image_alt_en?: string
    specs_json?: string
    sku?: string; brand_name?: string; material?: string
    capacity?: string; dimensions?: string
    moq?: string; lead_time_days?: number
    availability_status?: boolean | string
    canonical_url_th?: string; canonical_url_en?: string
    focus_keyword_th?: string; focus_keyword_en?: string
    seo_title_th?: string; seo_title_en?: string
    seo_description_th?: string; seo_description_en?: string
    og_title_th?: string; og_title_en?: string
    og_description_th?: string; og_description_en?: string
    og_image?: number | null
    robots_index?: boolean; robots_follow?: boolean
  }
}

interface WPCategory {
  id: number
  slug: string
  name: string
  count: number
  acf?: {
    name_th?: string; name_en?: string
    description_th?: string; description_en?: string
    image?: number | { url?: string }
    image_url?: string
    image_alt_th?: string; image_alt_en?: string
    seo_title_th?: string; seo_title_en?: string
    seo_description_th?: string; seo_description_en?: string
  }
}

type SortKey = "name" | "status" | "sku" | "date"
type SortDir = "asc" | "desc"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pName = (p: WPProduct) => p.acf?.name_th || p.acf?.name_en || p.title?.rendered || p.slug
const cName = (c: WPCategory) => c.acf?.name_th || c.acf?.name_en || c.name
const isAvailableStatus = (
  value: WPProduct["acf"] extends infer A ? A extends { availability_status?: infer V } ? V | undefined : never : never
) =>
  value === true || value === "in_stock" || value === "preorder"
function cImgUrl(c: WPCategory) {
  const img = c.acf?.image
  if (typeof img === "object" && img?.url) return img.url
  return c.acf?.image_url ?? ""
}

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json()
    if (typeof data?.message === "string" && data.message) return data.message
    if (typeof data?.error === "string" && data.error) return data.error
  } catch {}

  return fallback
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: (id: string) => React.ReactNode }) {
  const id = useId()
  return (
    <div className="a-field">
      <label htmlFor={id}>{label}</label>
      {children(id)}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="a-section-title">{children}</div>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="a-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="a-modal">
        <div className="a-modal-header">
          <h2 className="a-modal-title">{title}</h2>
          <button type="button" className="a-btn--close" onClick={onClose} aria-label="ปิด">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ImageUploader({ currentUrl = "", onUploaded, label = "รูปภาพ" }: {
  currentUrl?: string
  onUploaded: (mediaId: number, url: string) => void
  label?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(currentUrl)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState("")

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true); setErr("")
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/admin/upload-media", { method: "POST", body: fd })
      if (!res.ok) throw new Error(await readErrorMessage(res, "Upload failed"))
      const { id, url } = await res.json()
      setPreview(url)
      onUploaded(id, url)
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="a-field">
      <label>{label}</label>
      <div className="a-img-upload">
        <div
          className={`a-img-thumb${uploading ? " a-img-thumb--disabled" : ""}`}
          onClick={() => !uploading && fileRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label={`อัปโหลด${label}`}
          onKeyDown={(e) => e.key === "Enter" && !uploading && fileRef.current?.click()}
        >
          {preview
            ? <img src={preview} alt="" />
            : <span className="a-img-thumb-placeholder">+</span>}
          {uploading && <div className="a-img-uploading">กำลังอัปโหลด...</div>}
        </div>
        <div className="a-img-info">
          <div>คลิกที่รูปเพื่อเลือกไฟล์</div>
          <div className="a-img-hint">JPG, PNG, WEBP (ไม่เกิน 5MB)</div>
          {err && <div className="a-img-err">{err}</div>}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        aria-label={`เลือกไฟล์รูป${label}`}
        className="a-file-hidden"
        onChange={handleFile}
      />
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const PAGE_SIZE = 25

export default function ProductsPanel() {
  const [products, setProducts] = useState<WPProduct[]>([])
  const [categories, setCategories] = useState<WPCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modal, setModal] = useState<{ item: WPProduct | null } | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "publish" | "draft">("all")
  const [filterCategory, setFilterCategory] = useState<number | "all">("all")
  const [filterAvail, setFilterAvail] = useState<"all" | "yes" | "no">("all")
  // Sort
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  // Pagination
  const [page, setPage] = useState(1)

  // Bulk
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  // ── Fetch ──
  const loadProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products")
    if (!res.ok) throw new Error(await readErrorMessage(res, "โหลดสินค้าไม่สำเร็จ"))
    setProducts(await res.json())
  }, [])

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories")
    if (!res.ok) throw new Error(await readErrorMessage(res, "โหลดหมวดหมู่ไม่สำเร็จ"))
    setCategories(await res.json())
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([loadProducts(), loadCategories()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [loadProducts, loadCategories])

  // ── Filtered + sorted list ──
  const processed = useMemo(() => {
    let list = products

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        pName(p).toLowerCase().includes(q) ||
        (p.acf?.sku ?? "").toLowerCase().includes(q) ||
        p.slug.includes(q)
      )
    }
    if (filterStatus !== "all") list = list.filter((p) => p.status === filterStatus)
    if (filterCategory !== "all") list = list.filter((p) => p.product_category?.includes(filterCategory as number))
    if (filterAvail === "yes") list = list.filter((p) => isAvailableStatus(p.acf?.availability_status))
    if (filterAvail === "no") list = list.filter((p) => !isAvailableStatus(p.acf?.availability_status))

    list = [...list].sort((a, b) => {
      let va = "", vb = ""
      if (sortKey === "name") { va = pName(a); vb = pName(b) }
      else if (sortKey === "status") { va = a.status; vb = b.status }
      else if (sortKey === "sku") { va = a.acf?.sku ?? ""; vb = b.acf?.sku ?? "" }
      else if (sortKey === "date") { va = a.date ?? ""; vb = b.date ?? "" }
      return sortDir === "asc" ? va.localeCompare(vb, "th") : vb.localeCompare(va, "th")
    })

    return list
  }, [products, search, filterStatus, filterCategory, filterAvail, sortKey, sortDir])

  const totalPages = Math.ceil(processed.length / PAGE_SIZE)
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
    setPage(1)
  }

  function resetFilters() {
    setSearch(""); setFilterStatus("all"); setFilterCategory("all")
    setFilterAvail("all"); setPage(1); setSelected(new Set())
  }

  // ── Quick publish/draft toggle ──
  async function quickStatus(p: WPProduct, newStatus: "publish" | "draft") {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...flattenProduct(p), status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, status: updated.status } : x))
    } else {
      setError(await readErrorMessage(res, "เปลี่ยนสถานะไม่สำเร็จ"))
    }
  }

  // ── Delete single ──
  async function deleteProduct(id: number) {
    if (!confirm("ลบสินค้านี้? ไม่สามารถกู้คืนได้")) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) { setProducts((p) => p.filter((x) => x.id !== id)); selected.delete(id); setSelected(new Set(selected)) }
    else setError(await readErrorMessage(res, "ลบไม่สำเร็จ"))
  }

  // ── Bulk ──
  function toggleSelect(id: number) {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }

  function selectAll() {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map((p) => p.id)))
  }

  async function bulkAction(action: "publish" | "draft" | "delete") {
    if (action === "delete" && !confirm(`ลบ ${selected.size} รายการ? ไม่สามารถกู้คืนได้`)) return
    setBulkLoading(true)
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      })
      const { failed } = await res.json()
      if (failed > 0) setError(`${failed} รายการดำเนินการไม่สำเร็จ`)
      await loadProducts()
      setSelected(new Set())
    } catch {
      setError("Bulk action ไม่สำเร็จ")
    } finally {
      setBulkLoading(false)
    }
  }

  const activeFilters = filterStatus !== "all" || filterCategory !== "all" || filterAvail !== "all" || search.trim()

  return (
    <div className="a-wrap">
      {/* ── Toolbar ── */}
      <div className="a-toolbar">
        <input type="search" className="a-search" placeholder="ค้นหาชื่อ / SKU..."
          aria-label="ค้นหา" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        <button type="button" className="a-btn a-btn--add"
          onClick={() => setModal({ item: null })}>
          + เพิ่มสินค้า
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="a-filterbar">
          <span className="a-filterbar-label">กรอง</span>

          {/* Status */}
          <select className="a-select" aria-label="กรองสถานะ"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value as typeof filterStatus); setPage(1) }}>
            <option value="all">ทุกสถานะ</option>
            <option value="publish">Publish</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category */}
          <select className="a-select" aria-label="กรองหมวดหมู่"
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value)); setPage(1) }}>
            <option value="all">ทุกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{cName(c)}</option>
            ))}
          </select>

          {/* Availability */}
          {(["all", "yes", "no"] as const).map((v) => (
            <button key={v} type="button"
              className={`a-filter-chip${filterAvail === v ? " a-filter-chip--active" : ""}`}
              onClick={() => { setFilterAvail(v); setPage(1) }}>
              {v === "all" ? "ทุกสินค้า" : v === "yes" ? "พร้อมขาย" : "ไม่พร้อมขาย"}
            </button>
          ))}

          <div className="a-filterbar-right">
            {activeFilters && (
              <button type="button" className="a-btn a-btn--ghost" onClick={resetFilters}>
                ล้างตัวกรอง
              </button>
            )}
            <span className="a-count-badge">{processed.length} รายการ</span>
          </div>
        </div>

      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div className="a-bulkbar">
          <span>เลือกแล้ว</span>
          <span className="a-bulkbar-count">{selected.size} รายการ</span>
          <div className="a-bulkbar-right">
            <button type="button" className="a-btn a-btn--pub" disabled={bulkLoading}
              onClick={() => bulkAction("publish")}>
              Publish ทั้งหมด
            </button>
            <button type="button" className="a-btn a-btn--draft" disabled={bulkLoading}
              onClick={() => bulkAction("draft")}>
              Draft ทั้งหมด
            </button>
            <button type="button" className="a-btn a-btn--danger" disabled={bulkLoading}
              onClick={() => bulkAction("delete")}>
              ลบทั้งหมด
            </button>
            <button type="button" className="a-btn a-btn--ghost"
              onClick={() => setSelected(new Set())}>
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="a-error">
          {error}
          <button type="button" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <p className="a-loading">กำลังโหลด...</p>
      ) : (
        <>
          <ProductTable
            products={paginated}
            categories={categories}
            selected={selected}
            sortKey={sortKey}
            sortDir={sortDir}
            allSelected={selected.size > 0 && selected.size === paginated.length}
            onSort={handleSort}
            onSelectAll={selectAll}
            onSelect={toggleSelect}
            onEdit={(p) => setModal({ item: p })}
            onDelete={deleteProduct}
            onQuickStatus={quickStatus}
          />
          {totalPages > 1 && (
            <Pagination page={page} total={totalPages} onChange={(p) => { setPage(p); setSelected(new Set()) }} />
          )}
        </>
      )}

      {modal && (
        <ProductModal
          item={modal.item}
          categories={categories}
          onSave={(p) => {
            setProducts((prev) => {
              const idx = prev.findIndex((x) => x.id === p.id)
              return idx >= 0 ? prev.map((x) => x.id === p.id ? p : x) : [p, ...prev]
            })
            setModal(null)
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages: (number | "...")[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push("...")
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i)
    if (page < total - 2) pages.push("...")
    pages.push(total)
  }

  return (
    <div className="a-pagination">
      <button type="button" className="a-pg-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="a-pg-info">…</span>
        ) : (
          <button key={p} type="button"
            className={`a-pg-btn${page === p ? " a-pg-btn--active" : ""}`}
            onClick={() => onChange(p as number)}>
            {p}
          </button>
        )
      )}
      <button type="button" className="a-pg-btn" disabled={page === total} onClick={() => onChange(page + 1)}>›</button>
      <span className="a-pg-info">หน้า {page}/{total}</span>
    </div>
  )
}

// ─── ProductTable ─────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="a-sort-icon--inactive"> ↕</span>
  return <span> {dir === "asc" ? "↑" : "↓"}</span>
}

function ProductTable({ products, categories, selected, sortKey, sortDir,
  allSelected, onSort, onSelectAll, onSelect, onEdit, onDelete, onQuickStatus }: {
  products: WPProduct[]
  categories: WPCategory[]
  selected: Set<number>

  sortKey: SortKey; sortDir: SortDir
  allSelected: boolean
  onSort: (k: SortKey) => void
  onSelectAll: () => void
  onSelect: (id: number) => void
  onEdit: (p: WPProduct) => void
  onDelete: (id: number) => void
  onQuickStatus: (p: WPProduct, s: "publish" | "draft") => void
}) {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, cName(c)]))

  return (
    <div className="a-table-wrap">
      <table className="a-table">
        <thead className="a-thead">
          <tr>
            <th className="a-th a-td--cb">
              <input type="checkbox" aria-label="เลือกทั้งหมด" checked={allSelected} onChange={onSelectAll} />
            </th>
            <th className="a-th">รูป</th>
            <th className="a-th a-th--sort" onClick={() => onSort("name")}>
              ชื่อสินค้า <SortIcon active={sortKey === "name"} dir={sortDir} />
            </th>
            <th className="a-th a-th--sort" onClick={() => onSort("sku")}>
              SKU <SortIcon active={sortKey === "sku"} dir={sortDir} />
            </th>
            <th className="a-th">หมวดหมู่</th>
            <th className="a-th a-th--sort" onClick={() => onSort("status")}>
              สถานะ <SortIcon active={sortKey === "status"} dir={sortDir} />
            </th>
            <th className="a-th">จำหน่าย</th>
            <th className="a-th a-th--actions"><span className="a-sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={8} className="a-empty">ไม่พบสินค้าที่ตรงกับเงื่อนไข</td></tr>
          )}
          {products.map((p) => {
            const isDraft = p.status !== "publish"
            return (
              <tr key={p.id} className={`a-tr${isDraft ? " a-tr--draft" : ""}`}>
                <td className="a-td a-td--cb">
                  <input type="checkbox" aria-label={`เลือก ${pName(p)}`}
                    checked={selected.has(p.id)} onChange={() => onSelect(p.id)} />
                </td>
                <td className="a-td">
                  {p.featured_image_url
                    ? <img className="a-thumb" src={p.featured_image_url} alt={p.acf?.image_alt_th || ""} />
                    : <div className="a-thumb-empty">?</div>}
                </td>
                <td className="a-td">
                  <div className="a-name-main">
                    {p.acf?.name_th || "—"}

                  </div>
                  <div className="a-name-sub">{p.acf?.name_en}</div>
                </td>
                <td className="a-td a-mono">{p.acf?.sku || "—"}</td>
                <td className="a-td a-muted">
                  {(p.product_category ?? []).map((id) => catMap[id] ?? id).join(", ") || "—"}
                </td>
                <td className="a-td">
                  {p.status === "publish"
                    ? <button type="button" className="a-btn--pub" onClick={() => onQuickStatus(p, "draft")}>Publish</button>
                    : <button type="button" className="a-btn--draft" onClick={() => onQuickStatus(p, "publish")}>Draft</button>}
                </td>
                <td className="a-td">
                  <span className={`a-status ${isAvailableStatus(p.acf?.availability_status) ? "a-status--avail" : "a-status--unavail"}`}>
                    {p.acf?.availability_status ? "พร้อมขาย" : "ไม่พร้อม"}
                  </span>
                </td>
                <td className="a-td">
                  <div className="a-actions">
                    <button type="button" className="a-btn--edit" onClick={() => onEdit(p)}>แก้ไข</button>
                    <button type="button" className="a-btn--del" onClick={() => onDelete(p.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── flattenProduct (for quick-status patch) ──────────────────────────────────

function flattenProduct(p: WPProduct) {
  const a = p.acf ?? {}
  return {
    name_th: a.name_th, name_en: a.name_en,
    description_th: a.description_th, description_en: a.description_en,
    content_th: a.content_th, content_en: a.content_en,
    application_th: a.application_th, application_en: a.application_en,
    image_alt_th: a.image_alt_th, image_alt_en: a.image_alt_en,
    specs_json: a.specs_json, sku: a.sku, brand_name: a.brand_name,
    material: a.material, capacity: a.capacity, dimensions: a.dimensions,
    moq: a.moq, lead_time_days: a.lead_time_days,
    availability_status: a.availability_status,
    seo_title_th: a.seo_title_th, seo_title_en: a.seo_title_en,
    seo_description_th: a.seo_description_th, seo_description_en: a.seo_description_en,
    canonical_url_th: a.canonical_url_th, canonical_url_en: a.canonical_url_en,
    focus_keyword_th: a.focus_keyword_th, focus_keyword_en: a.focus_keyword_en,
    og_title_th: a.og_title_th, og_title_en: a.og_title_en,
    og_description_th: a.og_description_th, og_description_en: a.og_description_en,
    robots_index: a.robots_index, robots_follow: a.robots_follow,
    categoryIds: p.product_category ?? [],
    featured_media: p.featured_media ?? 0,
    featured_image_url: p.featured_image_url ?? "",
  }
}

// ─── ProductModal ─────────────────────────────────────────────────────────────

function ProductModal({ item, categories, onSave, onClose }: {
  item: WPProduct | null
  categories: WPCategory[]
  onSave: (p: WPProduct) => void
  onClose: () => void
}) {
  const base = item ? flattenProduct(item) : {}
  const defaultForm = {
    status: (item?.status ?? "publish") as "publish" | "draft",
    name_th: "", name_en: "",
    description_th: "", description_en: "",
    content_th: "", content_en: "",
    application_th: "", application_en: "",
    image_alt_th: "", image_alt_en: "",
    specs_json: "",
    sku: "", brand_name: "", material: "", capacity: "", dimensions: "",
    moq: "", lead_time_days: "",
    availability_status: false,
    categoryIds: [] as number[],
    featured_media: 0, featured_image_url: "",
    seo_title_th: "", seo_title_en: "",
    seo_description_th: "", seo_description_en: "",
    canonical_url_th: "", canonical_url_en: "",
    focus_keyword_th: "", focus_keyword_en: "",
    og_title_th: "", og_title_en: "",
    og_description_th: "", og_description_en: "",
    robots_index: true, robots_follow: true,
  }
  const [form, setForm] = useState({
    ...defaultForm,
    ...Object.fromEntries(Object.entries(base).map(([k, v]) => [k, v ?? ""])),
    // booleans need explicit defaults
    availability_status: isAvailableStatus(item?.acf?.availability_status),
    robots_index: item?.acf?.robots_index ?? true,
    robots_follow: item?.acf?.robots_follow ?? true,
    lead_time_days: String(item?.acf?.lead_time_days ?? ""),
    categoryIds: item?.product_category ?? [],
    featured_media: item?.featured_media ?? 0,
    featured_image_url: item?.featured_image_url ?? "",
  })

  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }
  function toggleCat(id: number) {
    set("categoryIds", form.categoryIds.includes(id)
      ? form.categoryIds.filter((x) => x !== id)
      : [...form.categoryIds, id])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr(null)
    try {
      const res = await fetch(item ? `/api/admin/products/${item.id}` : "/api/admin/products", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lead_time_days: Number(form.lead_time_days) || 0 }),
      })
      if (!res.ok) throw new Error(await readErrorMessage(res, "เกิดข้อผิดพลาด"))
      onSave(await res.json())
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={item ? `แก้ไข: ${pName(item)}` : "เพิ่มสินค้าใหม่"} onClose={onClose}>
      <form onSubmit={submit}>
        {/* Status picker */}
        <div className="a-field">
          <label>สถานะการเผยแพร่</label>
          <div className="a-status-select">
            {(["publish", "draft"] as const).map((s) => (
              <label key={s}
                className={`a-status-option a-status-option--${s}${form.status === s ? ` a-status-option--selected-${s}` : ""}`}>
                <input type="radio" name="status" value={s} checked={form.status === s}
                  className="a-radio-no-margin" onChange={() => set("status", s)} />
                {s === "publish" ? "✓ Publish" : "◎ Draft"}
              </label>
            ))}
          </div>
        </div>

        <ImageUploader label="รูปภาพหลัก (Featured Image)"
          currentUrl={form.featured_image_url}
          onUploaded={(id, url) => { set("featured_media", id); set("featured_image_url", url) }} />

        <SectionTitle>ข้อมูลสินค้า</SectionTitle>
        <div className="a-grid-2">
          <Field label="ชื่อ (ภาษาไทย) *">{(id) => <input id={id} className="a-input" value={form.name_th} onChange={(e) => set("name_th", e.target.value)} required />}</Field>
          <Field label="ชื่อ (English)">{(id) => <input id={id} className="a-input" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="Alt รูป (TH)">{(id) => <input id={id} className="a-input" value={form.image_alt_th} onChange={(e) => set("image_alt_th", e.target.value)} />}</Field>
          <Field label="Alt รูป (EN)">{(id) => <input id={id} className="a-input" value={form.image_alt_en} onChange={(e) => set("image_alt_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="คำอธิบายสั้น (TH)">{(id) => <textarea id={id} className="a-textarea" value={form.description_th} onChange={(e) => set("description_th", e.target.value)} />}</Field>
          <Field label="คำอธิบายสั้น (EN)">{(id) => <textarea id={id} className="a-textarea" value={form.description_en} onChange={(e) => set("description_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="เนื้อหาหลัก (TH)">{(id) => <textarea id={id} className="a-textarea a-textarea--tall" value={form.content_th} onChange={(e) => set("content_th", e.target.value)} />}</Field>
          <Field label="เนื้อหาหลัก (EN)">{(id) => <textarea id={id} className="a-textarea a-textarea--tall" value={form.content_en} onChange={(e) => set("content_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="การใช้งาน (TH)">{(id) => <input id={id} className="a-input" value={form.application_th} onChange={(e) => set("application_th", e.target.value)} />}</Field>
          <Field label="การใช้งาน (EN)">{(id) => <input id={id} className="a-input" value={form.application_en} onChange={(e) => set("application_en", e.target.value)} />}</Field>
        </div>
        <Field label="Specs JSON">{(id) => <textarea id={id} className="a-textarea" value={form.specs_json} onChange={(e) => set("specs_json", e.target.value)} />}</Field>

        <SectionTitle>รายละเอียดสินค้า</SectionTitle>
        <div className="a-grid-3">
          <Field label="SKU">{(id) => <input id={id} className="a-input" value={form.sku} onChange={(e) => set("sku", e.target.value)} />}</Field>
          <Field label="Brand Name">{(id) => <input id={id} className="a-input" value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} />}</Field>
          <Field label="Material">{(id) => <input id={id} className="a-input" value={form.material} onChange={(e) => set("material", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-3">
          <Field label="Capacity">{(id) => <input id={id} className="a-input" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />}</Field>
          <Field label="Dimensions">{(id) => <input id={id} className="a-input" value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />}</Field>
          <Field label="MOQ">{(id) => <input id={id} className="a-input" value={form.moq} onChange={(e) => set("moq", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="Lead Time (วัน)">{(id) => <input id={id} type="number" min="0" className="a-input" value={form.lead_time_days} onChange={(e) => set("lead_time_days", e.target.value)} />}</Field>
        </div>

        <div className="a-field">
          <label>หมวดหมู่</label>
          <div className="a-cats">
            {categories.map((c) => (
              <label key={c.id} className={`a-cat-chip${form.categoryIds.includes(c.id) ? " a-cat-chip--selected" : ""}`}>
                <input type="checkbox" checked={form.categoryIds.includes(c.id)} onChange={() => toggleCat(c.id)} />
                {cName(c)}
              </label>
            ))}
          </div>
        </div>

        <div className="a-grid-2">
          <div className="a-field">
            <label>สถานะการจำหน่าย</label>
            <label className="a-checkbox-row">
              <input type="checkbox" checked={form.availability_status} onChange={(e) => set("availability_status", e.target.checked)} />
              พร้อมจำหน่าย
            </label>
          </div>
          <div className="a-field">
            <label>Robots</label>
            <div className="a-robots-row">
              <label className="a-checkbox-row">
                <input type="checkbox" checked={form.robots_index} onChange={(e) => set("robots_index", e.target.checked)} />
                Index
              </label>
              <label className="a-checkbox-row">
                <input type="checkbox" checked={form.robots_follow} onChange={(e) => set("robots_follow", e.target.checked)} />
                Follow
              </label>
            </div>
          </div>
        </div>

        <SectionTitle>SEO</SectionTitle>
        <div className="a-grid-2">
          <Field label="SEO Title (TH)">{(id) => <input id={id} className="a-input" value={form.seo_title_th} onChange={(e) => set("seo_title_th", e.target.value)} />}</Field>
          <Field label="SEO Title (EN)">{(id) => <input id={id} className="a-input" value={form.seo_title_en} onChange={(e) => set("seo_title_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="SEO Description (TH)">{(id) => <textarea id={id} className="a-textarea" value={form.seo_description_th} onChange={(e) => set("seo_description_th", e.target.value)} />}</Field>
          <Field label="SEO Description (EN)">{(id) => <textarea id={id} className="a-textarea" value={form.seo_description_en} onChange={(e) => set("seo_description_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="Focus Keyword (TH)">{(id) => <input id={id} className="a-input" value={form.focus_keyword_th} onChange={(e) => set("focus_keyword_th", e.target.value)} />}</Field>
          <Field label="Focus Keyword (EN)">{(id) => <input id={id} className="a-input" value={form.focus_keyword_en} onChange={(e) => set("focus_keyword_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="Canonical URL (TH)">{(id) => <input id={id} type="url" className="a-input" value={form.canonical_url_th} onChange={(e) => set("canonical_url_th", e.target.value)} />}</Field>
          <Field label="Canonical URL (EN)">{(id) => <input id={id} type="url" className="a-input" value={form.canonical_url_en} onChange={(e) => set("canonical_url_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="OG Title (TH)">{(id) => <input id={id} className="a-input" value={form.og_title_th} onChange={(e) => set("og_title_th", e.target.value)} />}</Field>
          <Field label="OG Title (EN)">{(id) => <input id={id} className="a-input" value={form.og_title_en} onChange={(e) => set("og_title_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="OG Description (TH)">{(id) => <textarea id={id} className="a-textarea" value={form.og_description_th} onChange={(e) => set("og_description_th", e.target.value)} />}</Field>
          <Field label="OG Description (EN)">{(id) => <textarea id={id} className="a-textarea" value={form.og_description_en} onChange={(e) => set("og_description_en", e.target.value)} />}</Field>
        </div>

        {err && <p className="a-form-err">{err}</p>}
        <div className="a-form-footer">
          <button type="button" className="a-btn a-btn--ghost" onClick={onClose}>ยกเลิก</button>
          <button type="submit" className="a-btn a-btn--save" disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
