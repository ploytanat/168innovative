"use client"

import { useState, useMemo } from "react"

export interface AdminProduct {
  id: number
  slug: string
  title: string
  image: string
  categoryIds: number[]
  relatedProducts: number[] // ACF: related_products
}

interface Props {
  products: AdminProduct[]
}

type GroupMap = Record<number, number[]> // parentId -> childIds[]

function buildInitialGroups(products: AdminProduct[]): GroupMap {
  const map: GroupMap = {}
  for (const p of products) {
    if (p.relatedProducts.length > 0) {
      map[p.id] = p.relatedProducts
    }
  }
  return map
}

function isChildOfAny(productId: number, groups: GroupMap): boolean {
  return Object.values(groups).some((children) => children.includes(productId))
}

export default function ProductGroupDashboard({ products }: Props) {
  const [groups, setGroups] = useState<GroupMap>(() => buildInitialGroups(products))
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<number | null>(null)

  const productMap = useMemo(() => {
    const m: Record<number, AdminProduct> = {}
    for (const p of products) m[p.id] = p
    return m
  }, [products])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    )
  }, [products, search])

  // Products that are parents (have children assigned)
  const parentIds = useMemo(() => new Set(Object.keys(groups).map(Number)), [groups])

  // Products that are already a child of someone
  const childIds = useMemo(() => {
    const ids = new Set<number>()
    for (const children of Object.values(groups)) {
      for (const c of children) ids.add(c)
    }
    return ids
  }, [groups])

  function toggleChild(parentId: number, childId: number) {
    if (parentId === childId) return
    setGroups((prev) => {
      const current = prev[parentId] ?? []
      const updated = current.includes(childId)
        ? current.filter((id) => id !== childId)
        : [...current, childId]
      return { ...prev, [parentId]: updated }
    })
  }

  async function saveGroup(parentId: number) {
    setSaving(parentId)
    setError(null)
    try {
      const res = await fetch("/api/admin/update-product", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parentId,
          related_products: groups[parentId] ?? [],
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Unknown error")
      }
      setSuccess(parentId)
      setTimeout(() => setSuccess(null), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(null)
    }
  }

  const parents = products.filter((p) => parentIds.has(p.id))
  const ungrouped = filtered.filter((p) => !parentIds.has(p.id) && !childIds.has(p.id))

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        จัดกลุ่มสินค้า (Product Groups)
      </h1>
      <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>
        กำหนด "สินค้าแม่" และเลือก "สินค้าลูก" ที่จะผูกเข้าด้วยกัน ผ่านฟิลด์{" "}
        <code>related_products</code> ใน WordPress
      </p>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* ─── Existing groups ─── */}
      {parents.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            กลุ่มสินค้าที่มีอยู่
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {parents.map((parent) => (
              <GroupCard
                key={parent.id}
                parent={parent}
                children={(groups[parent.id] ?? [])
                  .map((id) => productMap[id])
                  .filter(Boolean)}
                allProducts={products}
                childIds={childIds}
                parentIds={parentIds}
                groupChildren={groups[parent.id] ?? []}
                onToggle={(childId) => toggleChild(parent.id, childId)}
                onSave={() => saveGroup(parent.id)}
                saving={saving === parent.id}
                saved={success === parent.id}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Create new group ─── */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          สินค้าที่ยังไม่มีกลุ่ม
        </h2>
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "8px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {ungrouped.map((p) => (
            <UngroupedProductCard
              key={p.id}
              product={p}
              allProducts={products}
              childIds={childIds}
              parentIds={parentIds}
              onMakeParent={() => {
                setGroups((prev) => ({ ...prev, [p.id]: prev[p.id] ?? [] }))
              }}
            />
          ))}
          {ungrouped.length === 0 && (
            <p style={{ color: "#94a3b8", fontSize: 14 }}>ไม่มีสินค้าที่ตรงกับการค้นหา</p>
          )}
        </div>
      </section>
    </div>
  )
}

// ─── GroupCard ─────────────────────────────────────────────────────────────

interface GroupCardProps {
  parent: AdminProduct
  children: AdminProduct[]
  allProducts: AdminProduct[]
  childIds: Set<number>
  parentIds: Set<number>
  groupChildren: number[]
  onToggle: (childId: number) => void
  onSave: () => void
  saving: boolean
  saved: boolean
}

function GroupCard({
  parent,
  children,
  allProducts,
  childIds,
  parentIds,
  groupChildren,
  onToggle,
  onSave,
  saving,
  saved,
}: GroupCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Candidates = not already a parent, not this product itself
  const candidates = allProducts.filter(
    (p) => p.id !== parent.id && !parentIds.has(p.id)
  )

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        {parent.image && (
          <img
            src={parent.image}
            alt={parent.title}
            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{parent.title}</div>
          <div style={{ color: "#94a3b8", fontSize: 12 }}>{parent.slug}</div>
        </div>
        <span
          style={{
            background: "#dbeafe",
            color: "#1d4ed8",
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 99,
          }}
        >
          {children.length} ลูก
        </span>
      </div>

      {/* Children chips */}
      {children.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {children.map((c) => (
            <span
              key={c.id}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: 99,
                padding: "2px 10px",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {c.title}
              <button
                onClick={() => onToggle(c.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444",
                  padding: 0,
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Toggle picker */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          fontSize: 12,
          color: "#3b82f6",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: expanded ? 8 : 0,
        }}
      >
        {expanded ? "▲ ซ่อน" : "▼ เพิ่ม/ลบสินค้าลูก"}
      </button>

      {expanded && (
        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          {candidates.map((c) => (
            <label
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f1f5f9",
                fontSize: 13,
              }}
            >
              <input
                type="checkbox"
                checked={groupChildren.includes(c.id)}
                onChange={() => onToggle(c.id)}
              />
              {c.image && (
                <img
                  src={c.image}
                  alt={c.title}
                  style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 4 }}
                />
              )}
              <span>{c.title}</span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={onSave}
        disabled={saving}
        style={{
          background: saved ? "#22c55e" : "#1e293b",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "7px 18px",
          fontSize: 13,
          fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
          transition: "background 0.2s",
        }}
      >
        {saving ? "กำลังบันทึก..." : saved ? "✓ บันทึกแล้ว" : "บันทึก"}
      </button>
    </div>
  )
}

// ─── UngroupedProductCard ──────────────────────────────────────────────────

interface UngroupedProductCardProps {
  product: AdminProduct
  allProducts: AdminProduct[]
  childIds: Set<number>
  parentIds: Set<number>
  onMakeParent: () => void
}

function UngroupedProductCard({
  product,
  childIds,
  onMakeParent,
}: UngroupedProductCardProps) {
  const isChild = childIds.has(product.id)

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.title}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 11 }}>{product.slug}</div>
        {isChild && (
          <span
            style={{
              fontSize: 10,
              background: "#fef9c3",
              color: "#854d0e",
              padding: "1px 6px",
              borderRadius: 99,
              fontWeight: 600,
            }}
          >
            เป็นสินค้าลูกอยู่แล้ว
          </span>
        )}
      </div>
      {!isChild && (
        <button
          onClick={onMakeParent}
          style={{
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            color: "#334155",
          }}
        >
          + ตั้งเป็นแม่
        </button>
      )}
    </div>
  )
}
