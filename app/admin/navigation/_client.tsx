'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Save, Edit, X, Check, ChevronRight } from 'lucide-react'
import {
  upsertNavItem, deleteNavItem,
  upsertFooterGroup, deleteFooterGroup,
  upsertFooterLink, deleteFooterLink,
} from '@/app/admin/actions/navigation'

type Tab = 'nav' | 'footer'

const inputClass = 'w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500'

interface NavItem { id?: unknown; parent_id?: unknown; label_th?: unknown; label_en?: unknown; href?: unknown; sort_order?: unknown; is_published?: unknown }
interface FooterLink { id?: unknown; label_th?: unknown; label_en?: unknown; href?: unknown; sort_order?: unknown; is_published?: unknown }
interface FooterGroup { id?: unknown; label_th?: unknown; label_en?: unknown; sort_order?: unknown; is_published?: unknown; links?: FooterLink[] }

export default function NavigationClient({ navItems: initNav, footerGroups: initGroups }: {
  navItems: Record<string, unknown>[]
  footerGroups: Record<string, unknown>[]
}) {
  const [tab, setTab] = useState<Tab>('nav')
  const [navItems, setNavItems] = useState<NavItem[]>(initNav as NavItem[])
  const [groups, setGroups] = useState<FooterGroup[]>(initGroups as FooterGroup[])
  const [editingNav, setEditingNav] = useState<NavItem | null>(null)
  const [editingGroup, setEditingGroup] = useState<FooterGroup | null>(null)
  const [editingLink, setEditingLink] = useState<{ link: FooterLink; groupId: unknown } | null>(null)
  const [, startTransition] = useTransition()

  // Nav helpers
  const saveNav = () => {
    if (!editingNav) return
    startTransition(async () => {
      const id = editingNav.id ? Number(editingNav.id) : null
      await upsertNavItem(id, editingNav as Record<string, unknown>)
      if (id) setNavItems(n => n.map(x => x.id === editingNav.id ? editingNav : x))
      else setNavItems(n => [...n, editingNav])
      setEditingNav(null)
    })
  }

  const removeNav = (id: unknown) => {
    if (!confirm('Delete this nav item?')) return
    startTransition(async () => {
      await deleteNavItem(Number(id))
      setNavItems(n => n.filter(x => x.id !== id))
    })
  }

  // Footer group helpers
  const saveGroup = () => {
    if (!editingGroup) return
    startTransition(async () => {
      const id = editingGroup.id ? Number(editingGroup.id) : null
      await upsertFooterGroup(id, { label_th: String(editingGroup.label_th ?? ''), label_en: String(editingGroup.label_en ?? ''), sort_order: Number(editingGroup.sort_order ?? 0), is_published: !!editingGroup.is_published })
      if (id) setGroups(g => g.map(x => x.id === editingGroup.id ? { ...x, ...editingGroup } : x))
      else setGroups(g => [...g, { ...editingGroup, links: [] }])
      setEditingGroup(null)
    })
  }

  const removeGroup = (id: unknown) => {
    if (!confirm('Delete this footer group?')) return
    startTransition(async () => {
      await deleteFooterGroup(Number(id))
      setGroups(g => g.filter(x => x.id !== id))
    })
  }

  // Footer link helpers
  const saveLink = () => {
    if (!editingLink) return
    startTransition(async () => {
      const { link, groupId } = editingLink
      const id = link.id ? Number(link.id) : null
      await upsertFooterLink(id, Number(groupId), { label_th: String(link.label_th ?? ''), label_en: String(link.label_en ?? ''), href: String(link.href ?? ''), sort_order: Number(link.sort_order ?? 0), is_published: !!link.is_published })
      setGroups(g => g.map(group => {
        if (group.id !== groupId) return group
        const links = group.links ?? []
        return { ...group, links: id ? links.map(x => x.id === link.id ? link : x) : [...links, link] }
      }))
      setEditingLink(null)
    })
  }

  const removeLink = (groupId: unknown, linkId: unknown) => {
    if (!confirm('Delete this link?')) return
    startTransition(async () => {
      await deleteFooterLink(Number(linkId))
      setGroups(g => g.map(group => group.id !== groupId ? group : { ...group, links: (group.links ?? []).filter(x => x.id !== linkId) }))
    })
  }

  // Render top-level items, then indented child items
  const topLevel = navItems.filter(n => !n.parent_id)
  const childrenOf = (parentId: unknown) => navItems.filter(n => String(n.parent_id) === String(parentId))

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-800 rounded-xl p-1 w-fit">
        {[{ key: 'nav' as Tab, label: 'Main Navigation' }, { key: 'footer' as Tab, label: 'Footer Links' }].map(t => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'nav' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setEditingNav({ sort_order: navItems.length, is_published: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Item
            </button>
          </div>
          <div className="rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Label (TH)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Label (EN)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">href</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="text-right px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topLevel.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No navigation items.</td></tr>
                ) : topLevel.map(item => (
                  <>
                    <tr key={String(item.id)} className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-gray-200 font-medium">{String(item.label_th ?? '')}</td>
                      <td className="px-4 py-3 text-gray-400">{String(item.label_en ?? '')}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{String(item.href ?? '')}</td>
                      <td className="px-4 py-3 text-gray-400">{String(item.sort_order ?? 0)}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${item.is_published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{item.is_published ? 'Published' : 'Draft'}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingNav({ sort_order: navItems.length, is_published: true, parent_id: item.id })} title="Add child" className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg"><ChevronRight size={14} /></button>
                          <button onClick={() => setEditingNav({ ...item })} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => removeNav(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    {childrenOf(item.id).map(child => (
                      <tr key={String(child.id)} className="hover:bg-gray-800/20 bg-gray-900/30">
                        <td className="px-4 py-3 text-gray-300"><span className="ml-6 text-gray-500 mr-2">└</span>{String(child.label_th ?? '')}</td>
                        <td className="px-4 py-3 text-gray-400">{String(child.label_en ?? '')}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{String(child.href ?? '')}</td>
                        <td className="px-4 py-3 text-gray-400">{String(child.sort_order ?? 0)}</td>
                        <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${child.is_published ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{child.is_published ? 'Published' : 'Draft'}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingNav({ ...child })} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                            <button onClick={() => removeNav(child.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'footer' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setEditingGroup({ sort_order: groups.length, is_published: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
              <Plus size={15} /> Add Group
            </button>
          </div>
          {groups.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center"><p className="text-gray-500 text-sm">No footer groups.</p></div>
          ) : groups.map(group => (
            <div key={String(group.id)} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-900/50 border-b border-gray-700">
                <div>
                  <h3 className="text-white font-medium text-sm">{String(group.label_th ?? '')}</h3>
                  <p className="text-gray-500 text-xs">{String(group.label_en ?? '')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingLink({ link: { sort_order: (group.links ?? []).length, is_published: true }, groupId: group.id })} className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300"><Plus size={12} /> Add Link</button>
                  <button onClick={() => setEditingGroup({ ...group })} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={14} /></button>
                  <button onClick={() => removeGroup(group.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="divide-y divide-gray-700/50">
                {(group.links ?? []).length === 0 ? (
                  <p className="px-5 py-4 text-gray-500 text-sm">No links in this group.</p>
                ) : (group.links ?? []).map(link => (
                  <div key={String(link.id)} className="flex items-center px-5 py-3 hover:bg-gray-700/20">
                    <div className="flex-1">
                      <span className="text-gray-300 text-sm">{String(link.label_th ?? '')}</span>
                      <span className="text-gray-500 text-xs ml-2">{String(link.label_en ?? '')}</span>
                    </div>
                    <span className="text-gray-500 font-mono text-xs mr-4">{String(link.href ?? '')}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingLink({ link: { ...link }, groupId: group.id })} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit size={13} /></button>
                      <button onClick={() => removeLink(group.id, link.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nav item modal */}
      {editingNav && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Navigation Item</h3>
              <button onClick={() => setEditingNav(null)}><X size={18} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Label (TH)</label><input value={String(editingNav.label_th ?? '')} onChange={e => setEditingNav(n => n ? { ...n, label_th: e.target.value } : n)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Label (EN)</label><input value={String(editingNav.label_en ?? '')} onChange={e => setEditingNav(n => n ? { ...n, label_en: e.target.value } : n)} className={inputClass} /></div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">href</label><input value={String(editingNav.href ?? '')} onChange={e => setEditingNav(n => n ? { ...n, href: e.target.value } : n)} className={inputClass} placeholder="/path" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingNav.sort_order ?? 0)} onChange={e => setEditingNav(n => n ? { ...n, sort_order: e.target.value } : n)} className={inputClass} /></div>
                {!!editingNav.parent_id && <div><label className="block text-xs text-gray-400 mb-1">Parent ID</label><input type="number" value={String(editingNav.parent_id)} onChange={e => setEditingNav(n => n ? { ...n, parent_id: e.target.value } : n)} className={inputClass} /></div>}
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingNav.is_published} onChange={e => setEditingNav(n => n ? { ...n, is_published: e.target.checked } : n)} />Published</label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditingNav(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Cancel</button>
              <button onClick={saveNav} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"><Check size={15} />Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer group modal */}
      {editingGroup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Footer Group</h3>
              <button onClick={() => setEditingGroup(null)}><X size={18} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Label (TH)</label><input value={String(editingGroup.label_th ?? '')} onChange={e => setEditingGroup(g => g ? { ...g, label_th: e.target.value } : g)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Label (EN)</label><input value={String(editingGroup.label_en ?? '')} onChange={e => setEditingGroup(g => g ? { ...g, label_en: e.target.value } : g)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingGroup.sort_order ?? 0)} onChange={e => setEditingGroup(g => g ? { ...g, sort_order: e.target.value } : g)} className={inputClass} /></div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingGroup.is_published} onChange={e => setEditingGroup(g => g ? { ...g, is_published: e.target.checked } : g)} />Published</label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditingGroup(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Cancel</button>
              <button onClick={saveGroup} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"><Check size={15} />Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer link modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Footer Link</h3>
              <button onClick={() => setEditingLink(null)}><X size={18} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Label (TH)</label><input value={String(editingLink.link.label_th ?? '')} onChange={e => setEditingLink(l => l ? { ...l, link: { ...l.link, label_th: e.target.value } } : l)} className={inputClass} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Label (EN)</label><input value={String(editingLink.link.label_en ?? '')} onChange={e => setEditingLink(l => l ? { ...l, link: { ...l.link, label_en: e.target.value } } : l)} className={inputClass} /></div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">href</label><input value={String(editingLink.link.href ?? '')} onChange={e => setEditingLink(l => l ? { ...l, link: { ...l.link, href: e.target.value } } : l)} className={inputClass} /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Sort Order</label><input type="number" value={String(editingLink.link.sort_order ?? 0)} onChange={e => setEditingLink(l => l ? { ...l, link: { ...l.link, sort_order: e.target.value } } : l)} className={inputClass} /></div>
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" checked={!!editingLink.link.is_published} onChange={e => setEditingLink(l => l ? { ...l, link: { ...l.link, is_published: e.target.checked } } : l)} />Published</label>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button onClick={() => setEditingLink(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Cancel</button>
              <button onClick={saveLink} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"><Check size={15} />Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
