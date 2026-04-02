"use client"

import { useState, useMemo } from "react"

export interface AdminProduct {
  id: number
  slug: string
  nameTh: string
  nameEn: string
  image: string
  categoryIds: number[]
  familyNameTh: string // acf.family_name_th — group identifier
  familyNameEn: string
}

interface Props {
  products: AdminProduct[]
}

type ViewTab = "view" | "edit"

// Products belong to a family if familyNameTh is set AND differs from their own nameTh
// (or if multiple products share the same familyNameTh, even if equal to one's name)
function buildFamilyMap(products: AdminProduct[]): Record<string, AdminProduct[]> {
  const map: Record<string, AdminProduct[]> = {}
  for (const p of products) {
    if (!p.familyNameTh) continue
    if (!map[p.familyNameTh]) map[p.familyNameTh] = []
    map[p.familyNameTh].push(p)
  }
  // Only keep families with >1 product — single-product "families" are solo
  const result: Record<string, AdminProduct[]> = {}
  for (const [name, members] of Object.entries(map)) {
    if (members.length > 1) result[name] = members
  }
  return result
}

export default function ProductGroupDashboard({ products }: Props) {
  // local state: track family name overrides before saving
  const [localFamily, setLocalFamily] = useState<Record<number, { th: string; en: string }>>({})
  const [saving, setSaving] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<number | null>(null)
  const [tab, setTab] = useState<ViewTab>("view")
  const [search, setSearch] = useState("")

  // Merged product list with local overrides
  const mergedProducts = useMemo<AdminProduct[]>(() =>
    products.map((p) => {
      const override = localFamily[p.id]
      if (!override) return p
      return { ...p, familyNameTh: override.th, familyNameEn: override.en }
    }),
    [products, localFamily]
  )

  const families = useMemo(() => buildFamilyMap(mergedProducts), [mergedProducts])
  const familyNames = Object.keys(families).sort()

  // IDs of products that are in a family
  const groupedIds = useMemo(() => {
    const ids = new Set<number>()
    for (const members of Object.values(families)) {
      for (const m of members) ids.add(m.id)
    }
    return ids
  }, [families])

  const soloProducts = useMemo(
    () => mergedProducts.filter((p) => !groupedIds.has(p.id)),
    [mergedProducts, groupedIds]
  )

  const filteredSolo = useMemo(() => {
    const q = search.toLowerCase()
    return soloProducts.filter(
      (p) => !q || p.nameTh.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
    )
  }, [soloProducts, search])

  function setFamilyForProduct(id: number, th: string, en: string) {
    setLocalFamily((prev) => ({ ...prev, [id]: { th, en } }))
  }

  async function saveProductFamily(productId: number) {
    const override = localFamily[productId]
    if (!override) return
    setSaving(productId)
    setError(null)
    try {
      const res = await fetch("/api/admin/update-family", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          family_name_th: override.th || null,
          family_name_en: override.en || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Unknown error")
      }
      setSuccess(productId)
      setTimeout(() => setSuccess(null), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(null)
    }
  }

  const totalGrouped = Object.values(families).reduce((s, m) => s + m.length, 0)

  return (
    <div className="pg-wrap">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h1 className="pg-title">จัดกลุ่มสินค้า</h1>
          <p className="pg-subtitle">
            กลุ่มสินค้าถูกกำหนดด้วยฟิลด์ <code>family_name_th</code> ใน WordPress —
            สินค้าที่มีชื่อกลุ่มเดียวกันจะถูกจัดอยู่ในกลุ่มเดียวกัน
          </p>
        </div>
        <div className="pg-stats">
          <div className="pg-stat pg-stat--groups">
            <span className="pg-stat-num">{familyNames.length}</span>กลุ่ม
          </div>
          <div className="pg-stat pg-stat--children">
            <span className="pg-stat-num">{totalGrouped}</span>ในกลุ่ม
          </div>
          <div className="pg-stat pg-stat--ungrouped">
            <span className="pg-stat-num">{soloProducts.length}</span>ไม่มีกลุ่ม
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pg-tabs">
        <button type="button" className={`pg-tab${tab === "view" ? " pg-tab--active" : ""}`} onClick={() => setTab("view")}>
          ดูกลุ่มสินค้า
        </button>
        <button type="button" className={`pg-tab${tab === "edit" ? " pg-tab--active" : ""}`} onClick={() => setTab("edit")}>
          แก้ไขกลุ่ม
        </button>
      </div>

      {error && <div className="pg-error">{error}</div>}

      {/* ─── VIEW TAB ─── */}
      {tab === "view" && (
        <div>
          {familyNames.length === 0 ? (
            <p className="pg-empty">ยังไม่มีกลุ่มสินค้า — ไปที่แท็บ "แก้ไขกลุ่ม" เพื่อกำหนดชื่อกลุ่มให้สินค้า</p>
          ) : (
            <div>
              <h2 className="pg-section-title">กลุ่มสินค้าทั้งหมด ({familyNames.length} กลุ่ม)</h2>
              <div className="pg-group-list">
                {familyNames.map((familyName) => (
                  <ViewFamilyCard
                    key={familyName}
                    familyName={familyName}
                    members={families[familyName]}
                  />
                ))}
              </div>

              {/* All grouped products with their family */}
              <div className="pg-section-mt">
                <h2 className="pg-section-title">
                  สินค้าที่อยู่ในกลุ่ม ({totalGrouped} รายการ)
                </h2>
                <div className="pg-children-grid">
                  {familyNames.flatMap((familyName) =>
                    families[familyName].map((p) => (
                      <MemberInfoCard key={p.id} product={p} familyName={familyName} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── EDIT TAB ─── */}
      {tab === "edit" && (
        <div>
          {/* Existing families */}
          {familyNames.length > 0 && (
            <section className="pg-section-mb">
              <h2 className="pg-section-title">กลุ่มที่มีอยู่แล้ว</h2>
              <div className="pg-group-list">
                {familyNames.map((familyName) => (
                  <EditFamilyCard
                    key={familyName}
                    familyName={familyName}
                    members={families[familyName]}
                    allProducts={mergedProducts}
                    groupedIds={groupedIds}
                    localFamily={localFamily}
                    saving={saving}
                    success={success}
                    onAssign={(productId, th, en) => setFamilyForProduct(productId, th, en)}
                    onSave={saveProductFamily}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Solo products — can be assigned to a group */}
          <section>
            <h2 className="pg-section-title">สินค้าที่ยังไม่มีกลุ่ม ({soloProducts.length} รายการ)</h2>
            <p className="pg-section-hint">
              กำหนด <strong>ชื่อกลุ่ม</strong> ให้กับสินค้าเพื่อจัดเข้ากลุ่ม — สินค้าที่ใช้ชื่อกลุ่มเดียวกันจะถูกจัดอยู่ด้วยกัน
            </p>
            <input
              type="text"
              className="pg-search"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="pg-ungrouped-grid">
              {filteredSolo.map((p) => {
                const override = localFamily[p.id]
                const currentTh = override?.th ?? p.familyNameTh
                const currentEn = override?.en ?? p.familyNameEn
                const isDirty = override !== undefined
                return (
                  <SoloProductCard
                    key={p.id}
                    product={p}
                    familyNameTh={currentTh}
                    familyNameEn={currentEn}
                    familyOptions={familyNames}
                    isDirty={isDirty}
                    saving={saving === p.id}
                    saved={success === p.id}
                    onChange={(th, en) => setFamilyForProduct(p.id, th, en)}
                    onSave={() => saveProductFamily(p.id)}
                  />
                )
              })}
              {filteredSolo.length === 0 && soloProducts.length > 0 && (
                <p className="pg-section-hint">ไม่มีสินค้าที่ตรงกับการค้นหา</p>
              )}
              {soloProducts.length === 0 && (
                <p className="pg-section-hint">สินค้าทุกรายการอยู่ในกลุ่มแล้ว</p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

// ─── ViewFamilyCard ────────────────────────────────────────────────────────

function ViewFamilyCard({ familyName, members }: { familyName: string; members: AdminProduct[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="pg-parent-card">
      <button type="button" className="pg-parent-card-header" onClick={() => setOpen((v) => !v)}>
        <div className="pg-parent-card-info">
          <div className="pg-parent-card-name">
            <span className="pg-parent-card-title">{familyName}</span>
            <Badge variant="parent" text="กลุ่ม" />
          </div>
          <div className="pg-parent-card-slug">family_name_th = &quot;{familyName}&quot;</div>
        </div>
        <div className="pg-parent-card-meta">
          <Badge variant="count" text={`${members.length} สินค้า`} />
          <span className="pg-parent-card-arrow">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="pg-parent-card-body">
          <div className="pg-children-list">
            {members.map((m) => (
              <div key={m.id} className="pg-child-row">
                {m.image && <img src={m.image} alt={m.nameTh} className="pg-child-row-img" />}
                <div className="pg-child-row-info">
                  <div className="pg-child-row-name">
                    <span className="pg-child-row-title">{m.nameTh}</span>
                    <Badge variant="child" text="สินค้า" />
                  </div>
                  <div className="pg-child-row-slug">{m.slug}</div>
                </div>
                <div className="pg-child-row-parent">
                  กลุ่ม:<strong>{familyName}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MemberInfoCard ────────────────────────────────────────────────────────

function MemberInfoCard({ product, familyName }: { product: AdminProduct; familyName: string }) {
  return (
    <div className="pg-child-card">
      {product.image && (
        <img src={product.image} alt={product.nameTh} className="pg-child-card-img" />
      )}
      <div className="pg-child-card-info">
        <div className="pg-child-card-name">
          <span className="pg-child-card-title">{product.nameTh}</span>
        </div>
        <div className="pg-child-card-slug">{product.slug}</div>
        <div className="pg-child-card-parent">
          <span className="pg-child-card-parent-label">กลุ่ม:</span>
          <span className="pg-child-card-parent-name">{familyName}</span>
        </div>
      </div>
    </div>
  )
}

// ─── EditFamilyCard ────────────────────────────────────────────────────────

interface EditFamilyCardProps {
  familyName: string
  members: AdminProduct[]
  allProducts: AdminProduct[]
  groupedIds: Set<number>
  localFamily: Record<number, { th: string; en: string }>
  saving: number | null
  success: number | null
  onAssign: (productId: number, th: string, en: string) => void
  onSave: (productId: number) => void
}

function EditFamilyCard({
  familyName,
  members,
  allProducts,
  groupedIds,
  localFamily,
  saving,
  success,
  onAssign,
  onSave,
}: EditFamilyCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Products not in any family (solo) that could be added
  const candidates = allProducts.filter((p) => !groupedIds.has(p.id))

  function addToFamily(product: AdminProduct) {
    onAssign(product.id, familyName, product.familyNameEn || familyName)
  }

  return (
    <div className="pg-edit-card">
      <div className="pg-edit-card-header">
        <div className="pg-edit-card-info">
          <div className="pg-edit-card-name">
            <span className="pg-edit-card-title">{familyName}</span>
            <Badge variant="parent" text="กลุ่ม" />
          </div>
          <div className="pg-edit-card-slug">family_name_th = &quot;{familyName}&quot;</div>
        </div>
        <Badge variant="count" text={`${members.length} สินค้า`} />
      </div>

      {/* Current members with remove option */}
      <div className="pg-child-chips">
        {members.map((m) => {
          const isSaving = saving === m.id
          const isSaved = success === m.id
          return (
            <span key={m.id} className="pg-child-chip">
              <span className="pg-child-chip-label">สินค้า</span>
              {m.nameTh}
              <button
                type="button"
                className="pg-child-chip-remove"
                disabled={isSaving}
                onClick={() => {
                  onAssign(m.id, "", "")
                  setTimeout(() => onSave(m.id), 0)
                }}
                title="นำออกจากกลุ่ม"
              >
                {isSaved ? "✓" : isSaving ? "…" : "×"}
              </button>
            </span>
          )
        })}
      </div>

      {/* Add more products to this family */}
      {candidates.length > 0 && (
        <>
          <button type="button" className="pg-picker-toggle" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "▲ ซ่อน" : "▼ เพิ่มสินค้าเข้ากลุ่มนี้"}
          </button>
          {expanded && (
            <div className="pg-picker">
              {candidates.map((c) => (
                <div key={c.id} className="pg-picker-row">
                  {c.image && <img src={c.image} alt={c.nameTh} className="pg-picker-row-img" />}
                  <span className="pg-picker-row-name">{c.nameTh}</span>
                  <button
                    type="button"
                    className="pg-make-parent-btn"
                    disabled={saving === c.id}
                    onClick={() => {
                      addToFamily(c)
                      setTimeout(() => onSave(c.id), 0)
                    }}
                  >
                    {saving === c.id ? "..." : success === c.id ? "✓" : "+ เพิ่ม"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── SoloProductCard ───────────────────────────────────────────────────────

interface SoloProductCardProps {
  product: AdminProduct
  familyNameTh: string
  familyNameEn: string
  familyOptions: string[]
  isDirty: boolean
  saving: boolean
  saved: boolean
  onChange: (th: string, en: string) => void
  onSave: () => void
}

function SoloProductCard({
  product,
  familyNameTh,
  familyNameEn,
  familyOptions,
  isDirty,
  saving,
  saved,
  onChange,
  onSave,
}: SoloProductCardProps) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="pg-ungroup-card pg-solo-card">
      <div className="pg-solo-card-row">
        {product.image && (
          <img src={product.image} alt={product.nameTh} className="pg-ungroup-card-img" />
        )}
        <div className="pg-ungroup-card-info">
          <div className="pg-ungroup-card-title">{product.nameTh}</div>
          <div className="pg-ungroup-card-slug">{product.slug}</div>
          {familyNameTh && (
            <div className="pg-solo-current-family">
              กลุ่ม: <strong>{familyNameTh}</strong>
            </div>
          )}
        </div>
        <button
          type="button"
          className="pg-make-parent-btn"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? "ยกเลิก" : "ตั้งกลุ่ม"}
        </button>
      </div>

      {editing && (
        <div className="pg-solo-edit-panel">
          <div className="pg-solo-edit-label">เลือกกลุ่มที่มีอยู่:</div>
          <div className="pg-solo-options">
            {familyOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`pg-solo-option${familyNameTh === opt ? " pg-solo-option--active" : ""}`}
                onClick={() => onChange(opt, product.familyNameEn || opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="pg-solo-edit-label-mt">หรือพิมพ์ชื่อกลุ่มใหม่:</div>
          <input
            type="text"
            className="pg-solo-input"
            placeholder="ชื่อกลุ่ม (ภาษาไทย)"
            value={familyNameTh}
            onChange={(e) => onChange(e.target.value, familyNameEn)}
          />
          <input
            type="text"
            className="pg-solo-input"
            placeholder="Family name (English)"
            value={familyNameEn}
            onChange={(e) => onChange(familyNameTh, e.target.value)}
          />
          {isDirty && (
            <button
              type="button"
              className={`pg-save-btn${saved ? " pg-save-btn--saved" : ""}`}
              onClick={onSave}
              disabled={saving || !familyNameTh}
            >
              {saving ? "กำลังบันทึก..." : saved ? "✓ บันทึกแล้ว" : "บันทึก"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Badge ─────────────────────────────────────────────────────────────────

function Badge({ variant, text }: { variant: "parent" | "child" | "count"; text: string }) {
  return <span className={`pg-badge pg-badge--${variant}`}>{text}</span>
}
