"use client"

import "./admin.css"
import { useState, useEffect, useCallback, useRef, useId } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cName = (c: WPCategory) => c.acf?.name_th || c.acf?.name_en || c.name
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

// ─── CategoriesPanel ──────────────────────────────────────────────────────────

export default function CategoriesPanel() {
  const [categories, setCategories] = useState<WPCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState<{ item: WPCategory | null } | null>(null)

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/categories")
    if (!res.ok) throw new Error(await readErrorMessage(res, "โหลดหมวดหมู่ไม่สำเร็จ"))
    setCategories(await res.json())
  }, [])

  useEffect(() => {
    setLoading(true)
    load().catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [load])

  async function deleteCategory(id: number) {
    if (!confirm("ลบหมวดหมู่นี้?")) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    if (res.ok) setCategories((c) => c.filter((x) => x.id !== id))
    else setError(await readErrorMessage(res, "ลบหมวดหมู่ไม่สำเร็จ"))
  }

  const filtered = search.trim()
    ? categories.filter((c) => cName(c).toLowerCase().includes(search.toLowerCase()))
    : categories

  return (
    <div className="a-wrap">
      <div className="a-toolbar">
        <input type="search" className="a-search" placeholder="ค้นหาหมวดหมู่..."
          aria-label="ค้นหา" value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <button type="button" className="a-btn a-btn--add"
          onClick={() => setModal({ item: null })}>
          + เพิ่มหมวดหมู่
        </button>
      </div>

      {error && (
        <div className="a-error">
          {error}
          <button type="button" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <p className="a-loading">กำลังโหลด...</p>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead className="a-thead">
              <tr>
                {["รูป", "ชื่อ (TH / EN)", "Slug", "สินค้า", ""].map((h) => (
                  <th key={h} className="a-th">{h || <span className="a-sr-only">Actions</span>}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="a-empty">ไม่พบหมวดหมู่</td></tr>
              )}
              {filtered.map((c) => {
                const img = cImgUrl(c)
                return (
                  <tr key={c.id} className="a-tr">
                    <td className="a-td">
                      {img ? <img className="a-thumb" src={img} alt={c.acf?.image_alt_th || ""} />
                           : <div className="a-thumb-empty">?</div>}
                    </td>
                    <td className="a-td">
                      <div className="a-name-main">{c.acf?.name_th || "—"}</div>
                      <div className="a-name-sub">{c.acf?.name_en}</div>
                    </td>
                    <td className="a-td a-mono">{c.slug}</td>
                    <td className="a-td a-muted">{c.count}</td>
                    <td className="a-td">
                      <div className="a-actions">
                        <button type="button" className="a-btn--edit" onClick={() => setModal({ item: c })}>แก้ไข</button>
                        <button type="button" className="a-btn--del" onClick={() => deleteCategory(c.id)}>ลบ</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <CategoryModal
          item={modal.item}
          onSave={(c) => {
            setCategories((prev) => {
              const idx = prev.findIndex((x) => x.id === c.id)
              return idx >= 0 ? prev.map((x) => x.id === c.id ? c : x) : [c, ...prev]
            })
            setModal(null)
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

// ─── CategoryModal ────────────────────────────────────────────────────────────

function CategoryModal({ item, onSave, onClose }: {
  item: WPCategory | null
  onSave: (c: WPCategory) => void
  onClose: () => void
}) {
  const a = item?.acf ?? {}
  const [form, setForm] = useState({
    name_th: a.name_th ?? "", name_en: a.name_en ?? "",
    description_th: a.description_th ?? "", description_en: a.description_en ?? "",
    image_media_id: typeof a.image === "number" ? a.image : 0,
    image_url: cImgUrl(item ?? { id: 0, slug: "", name: "", count: 0 }),
    image_alt_th: a.image_alt_th ?? "", image_alt_en: a.image_alt_en ?? "",
    seo_title_th: a.seo_title_th ?? "", seo_title_en: a.seo_title_en ?? "",
    seo_description_th: a.seo_description_th ?? "", seo_description_en: a.seo_description_en ?? "",
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setErr(null)
    try {
      const res = await fetch(item ? `/api/admin/categories/${item.id}` : "/api/admin/categories", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <Modal title={item ? `แก้ไข: ${cName(item)}` : "เพิ่มหมวดหมู่ใหม่"} onClose={onClose}>
      <form onSubmit={submit}>
        <ImageUploader label="รูปภาพหมวดหมู่"
          currentUrl={form.image_url}
          onUploaded={(id, url) => { set("image_media_id", id); set("image_url", url) }} />

        <SectionTitle>ข้อมูลหมวดหมู่</SectionTitle>
        <div className="a-grid-2">
          <Field label="ชื่อ (ภาษาไทย) *">{(id) => <input id={id} className="a-input" value={form.name_th} onChange={(e) => set("name_th", e.target.value)} required />}</Field>
          <Field label="ชื่อ (English)">{(id) => <input id={id} className="a-input" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="Alt รูป (TH)">{(id) => <input id={id} className="a-input" value={form.image_alt_th} onChange={(e) => set("image_alt_th", e.target.value)} />}</Field>
          <Field label="Alt รูป (EN)">{(id) => <input id={id} className="a-input" value={form.image_alt_en} onChange={(e) => set("image_alt_en", e.target.value)} />}</Field>
        </div>
        <div className="a-grid-2">
          <Field label="คำอธิบาย (TH)">{(id) => <textarea id={id} className="a-textarea" value={form.description_th} onChange={(e) => set("description_th", e.target.value)} />}</Field>
          <Field label="คำอธิบาย (EN)">{(id) => <textarea id={id} className="a-textarea" value={form.description_en} onChange={(e) => set("description_en", e.target.value)} />}</Field>
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
