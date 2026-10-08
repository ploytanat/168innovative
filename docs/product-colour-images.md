# รูปสินค้าแยกสี

ฝั่ง Next.js รองรับแล้ว แต่ยังไม่ได้ติดตั้ง field หรือเพิ่มข้อมูลใน WordPress จริง

1. WordPress → Custom Fields → Tools → Import Field Groups เลือก `docs/acf-import/product-colour-images.json` (ใช้ textarea จึงไม่ต้องใช้ ACF Pro repeater)
2. อัปโหลดรูปสีจริงใน Media Library แล้วคัดลอก File URL
3. เปิดสินค้ารุ่นนั้น ใส่รายการในช่อง Colour images (JSON) ตามตัวอย่างด้านล่าง โดยเปลี่ยน URL เป็นรูปจริง แล้วบันทึก
4. ตรวจ REST API ของสินค้าให้มี `acf.color_variants_json` และรอแคชหน้าเว็บอัปเดตประมาณ 60 วินาที

```json
[
  { "id": "white", "name_th": "ขาว", "name_en": "White", "hex": "#FFFFFF", "image_url": "https://YOUR-WORDPRESS-SITE/wp-content/uploads/REAL-WHITE-PHOTO.jpg" },
  { "id": "black", "name_th": "ดำ", "name_en": "Black", "hex": "#202020", "image_url": "https://YOUR-WORDPRESS-SITE/wp-content/uploads/REAL-BLACK-PHOTO.jpg" }
]
```

ตัวอย่างไม่ใช่ข้อมูลสินค้าจริง ต้องแทนที่ URL และใช้เฉพาะสีที่มีรูปจริง แต่ละ id ต้องไม่ซ้ำกัน

รูปหลักยังเป็นค่าเริ่มต้น กดชื่อสีเพื่อสลับภาพหรือกดรูปหลักเพื่อกลับ ภาพขยายใช้สีที่เลือกด้วย ถ้ารูปโหลดไม่ได้จะแสดงรูปหลักพร้อมข้อความแจ้ง สินค้าที่ไม่ได้เพิ่มข้อมูลสีจะไม่แสดงตัวเลือก ชื่อสี fallback ไปยังภาษาที่มีข้อมูล

ขอบเขตเวอร์ชันนี้เปลี่ยนเฉพาะรูป: ราคา สต็อก แบบสอบถาม และรายการเปรียบเทียบยังอยู่ระดับรุ่นสินค้า ไม่บันทึกสีที่เลือก ไม่มีการสร้างสินค้าใหม่ต่อสี
