"use client"
import { useSyncExternalStore } from "react"
import { MAX_SAVED, parseSaved, productKey, type SavedProduct } from "./shortlist-model"
import type { ProductView } from "@/app/lib/types/view"
const STORAGE_KEY = "168:shortlist:v1"
const EMPTY: SavedProduct[] = []
let snapshot = EMPTY
const listeners = new Set<() => void>()
function notify() { listeners.forEach(listener => listener()) }
function refresh() {
  try { snapshot = parseSaved(localStorage.getItem(STORAGE_KEY)); notify() } catch { /* In-memory use remains available if storage is blocked. */ }
}
function onStorage(event: StorageEvent) { if (event.key === STORAGE_KEY || event.key === null) refresh() }
function subscribe(listener: () => void) {
  const first = listeners.size === 0
  listeners.add(listener)
  if (first) { refresh(); window.addEventListener("storage", onStorage) }
  return () => { listeners.delete(listener); if (!listeners.size) window.removeEventListener("storage", onStorage) }
}
export function useShortlist() { return useSyncExternalStore(subscribe, () => snapshot, () => EMPTY) }
function publish(next: SavedProduct[]) {
  snapshot = next
  let persisted = true
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { persisted = false }
  notify()
  return persisted
}
export function removeSaved(key: string) { return publish(snapshot.filter(p => p.key !== key)) }
export function toggleSaved(product: ProductView): "added" | "removed" | "full" | "temporary" {
  const key = productKey(product)
  if (snapshot.some(p => p.key === key)) { removeSaved(key); return "removed" }
  if (snapshot.length >= MAX_SAVED) return "full"
  const item: SavedProduct = { key, slug: product.slug, categorySlug: product.categorySlug, name: product.name, image: product.image?.src || "", specs: product.specs || [] }
  return publish([...snapshot, item]) ? "added" : "temporary"
}
