# SEO Content Overhaul Playbook

ใช้เอกสารนี้สำหรับเก็บรายละเอียดแบบยกแผงใน WordPress โดยเน้น 2 เป้าหมายพร้อมกัน:

- ให้หน้า `product`, `category`, `article` มีเนื้อหาที่ช่วยติดคำค้นจริง
- ให้ทีมกรอกข้อมูลได้เป็นระบบ โดยไม่ยัดคีย์เวิร์ดแบบซ้ำ ๆ

ไฟล์ workbook ที่สร้างจากข้อมูลจริงของ WordPress อยู่ที่:

- `docs/seo-content-workbook/products-workbook.csv`
- `docs/seo-content-workbook/categories-workbook.csv`
- `docs/seo-content-workbook/articles-workbook.csv`

## หลักการ

- ใช้ 1 primary keyword ต่อ 1 หน้า
- ใช้ 3-8 supporting terms ต่อ 1 หน้า
- ทุกหน้าต้องมีมุมตอบโจทย์ผู้ค้น ไม่ใช่แค่ชื่อสินค้า
- หลีกเลี่ยงการคัดลอก intro เดิมไปหลายสินค้า
- ถ้าข้อมูลคล้ายกัน ให้ต่างกันที่ use case, material, size, industry, buyer concern

## Product

ฟิลด์ที่ควรเก็บให้ครบก่อน:

- `name_th`, `name_en`
- `description_th`, `description_en`
- `content_th`, `content_en`
- `application_th`, `application_en`
- `focus_keyword_th`, `focus_keyword_en`
- `faq_items`

สูตรเขียน:

- `description_*`
  ใช้เป็นสรุป 1-2 ประโยคว่าคืออะไร เหมาะกับใคร
- `content_*`
  อธิบายจุดเด่น, วัสดุ, ขนาด, วิธีใช้งาน, จุดต่างจากรุ่นใกล้เคียง, เหตุผลที่เหมาะกับงาน OEM/B2B
- `application_*`
  เขียนเป็น use case เช่น เหมาะกับโลชั่น, เซรั่ม, ซองรีฟิล, travel size, sample pack
- `faq_items`
  ตอบคำถามเชิงซื้อ เช่น ใช้วัสดุอะไร, รองรับสินค้าประเภทไหน, ขั้นต่ำสั่งผลิตเท่าไร, ทำ OEM ได้ไหม

สิ่งที่ควรมีใน product page ทุกหน้า:

- คำอธิบายหลักที่ไม่ซ้ำกับสินค้าอื่น
- use case อย่างน้อย 3 แบบ
- spec ที่อ่านง่าย
- FAQ 3-5 ข้อ
- internal link ไป category หรือบทความที่เกี่ยวข้อง

## Category

ฟิลด์ที่ควรเก็บก่อน:

- `name_th`, `name_en`
- `description_th`, `description_en`
- `intro_html_th`, `intro_html_en`
- `focus_keyword_th`, `focus_keyword_en`
- `featured_products`
- `faq_items`

สูตรเขียน:

- `description_*`
  ใช้สรุปหมวดแบบสั้น
- `intro_html_*`
  เขียนเป็น landing content ของหมวด: ภาพรวมหมวด, วิธีเลือก, รุ่นย่อยที่พบบ่อย, งานที่เหมาะ, สิ่งที่ผู้ซื้อควรถามก่อนสั่ง
- `faq_items`
  ตอบคำถามเชิงเปรียบเทียบและคัดเลือก เช่น แบบไหนเหมาะกับความหนืดสูง, แบบไหนเหมาะกับอาหาร, เลือกขนาดอย่างไร

สิ่งที่ควรมีใน category page ทุกหน้า:

- overview ของหมวด
- buying guide หรือ selection guide
- featured products 6-12 ตัว
- FAQ 4-6 ข้อ
- related articles 2-4 ชิ้น

## Article

ฟิลด์ที่ควรเก็บก่อน:

- `title_th`, `title_en`
- `excerpt_th`, `excerpt_en`
- `content_th`, `content_en`
- `focus_keyword_th`, `focus_keyword_en`
- `related_products`
- `faq_items`

สูตรเขียน:

- 1 บทความ = 1 ปัญหา/คำถามหลัก
- เปิดด้วยคำตอบที่ชัดในช่วงต้น
- กลางบทความอธิบายวิธีเลือก, ข้อควรระวัง, comparison, checklist
- ปิดด้วยการเชื่อมไปยัง category หรือ product ที่เกี่ยวข้อง

สิ่งที่ควรมี:

- keyword intent ชัดเจน
- heading ที่ตอบ subtopic จริง
- FAQ 2-4 ข้อ
- related product อย่างน้อย 1-3 ตัว

## Prioritization

ลำดับทำงานที่คุ้มสุด:

1. เก็บ `category` ทั้ง 8 หมวดให้ครบ
2. เก็บ `product` ที่เป็น top sellers หรือมี demand สูง 20-30 ตัวแรก
3. เขียน `article` รองรับคำค้นเชิงปัญหา/วิธีเลือก
4. ขยายไปยังสินค้า long-tail ที่เหลือ

## สิ่งที่ไม่ควรทำ

- ไม่ใส่คำว่า `OEM`, `โรงงาน`, `manufacturer` ซ้ำทุกย่อหน้า
- ไม่ใช้ intro เดิมทั้งชุดกับสินค้าต่างรุ่น
- ไม่ปล่อย product page ที่มีแค่รูป + ชื่อ + spec table
- ไม่สร้างบทความที่ซ้ำ intent กันเอง

## Workflow ที่แนะนำ

1. รัน `node scripts/generate-seo-content-workbook.mjs`
2. เปิด CSV แล้ว sort ตาม `priority`
3. เก็บ `fields_to_fill` ให้ครบทีละกลุ่ม
4. เมื่อกรอก WordPress แล้ว ให้เช็กหน้าจริงว่า section long-form และ FAQ แสดงผลถูก
5. ค่อย backfill internal links และ featured products เป็นรอบถัดไป
