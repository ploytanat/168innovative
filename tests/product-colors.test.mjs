import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseProductColors } from '../app/lib/product-colors.ts'
const white = { id: 'white', name_th: '\u0e02\u0e32\u0e27', name_en: 'White', hex: '#ffffff', image_url: 'https://example.com/white.jpg' }
test('old products and invalid JSON remain compatible', () => {
 for (const raw of [undefined, null, '', '{bad', '{}', '[null,1]']) assert.deepEqual(parseProductColors(raw, 'th'), [])
})
test('localizes colors and preserves real images', () => {
 const [result] = parseProductColors(JSON.stringify([white]), 'en')
 assert.equal(result.name, 'White'); assert.equal(result.image, white.image_url); assert.equal(result.hex, '#ffffff')
 assert.equal(parseProductColors([white], 'th')[0].name, white.name_th)
})
test('rejects missing photos, unsafe URLs and repeated IDs', () => {
 const rows = [white, white, {...white,id:'no-photo',image_url:''}, {...white,id:'unsafe',image_url:'javascript:alert(1)'}, {...white,id:'relative',image_url:'//example.com/a.jpg'}]
 assert.equal(parseProductColors(rows, 'en').length, 1)
 assert.equal(parseProductColors([{...white,hex:'red',image_url:'/images/white.jpg'}],'en')[0].hex, undefined)
})
