import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSaved, specRows } from '../app/components/product/shortlist-model.ts'
const item = (n, specs = []) => ({ key: `caps/${n}`, slug: String(n), categorySlug: 'caps', name: `Product ${n}`, image: '', specs })
test('corrupt or incompatible browser storage recovers safely', () => {
  for (const value of [null, '{broken', '{}', 'null', '[null,1,"x"]']) assert.deepEqual(parseSaved(value), [])
  assert.deepEqual(parseSaved(JSON.stringify([{...item(1), specs: [null]}, item(2)])), [item(2)])
})
test('restored list rejects duplicates and mismatched keys and enforces capacity', () => {
  const values = [item(1), item(1), {...item(2), key: 'wrong'}, ...Array.from({length: 30}, (_, i) => item(i + 3))]
  const result = parseSaved(JSON.stringify(values))
  assert.equal(result.length, 20)
  assert.equal(new Set(result.map(p => p.key)).size, 20)
  assert.equal(result.some(p => p.key === 'wrong'), false)
})
test('comparison aligns varying specs and leaves absent values explicit', () => {
  const result = specRows([item(1, [{label: ' Material ', value: 'HDPE'}, {label: 'Size', value: '6 mm'}]), item(2, [{label: 'material', value: 'PP'}, {label: 'Colour', value: 'White'}])])
  assert.deepEqual(result.map(r => r.values), [['HDPE', 'PP'], ['6 mm', '—'], ['—', 'White']])
})
