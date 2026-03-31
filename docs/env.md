# Environment Variables

ใช้ไฟล์ `.env.local` สำหรับค่าจริงในเครื่องหรือบน server  
ใช้ไฟล์ `.env.example` เป็นตัวอย่างสำหรับตั้งโปรเจคใหม่

## Required

### `WP_API_URL`

- ใช้สำหรับดึงข้อมูลจาก WordPress headless API
- ถูกใช้ใน data layer หลักของเว็บ เช่น product, category, article, company, about, hero
- ต้องเป็น base URL ของ WordPress backend

ตัวอย่าง:

```env
WP_API_URL=https://your-wordpress-domain.example
```

## Optional But Recommended

### `REVALIDATE_SECRET`

- ใช้ป้องกัน route revalidate ที่ [route.ts](C:/Users/User/Desktop/168innovative/app/lib/api/revalidate/route.ts)
- ต้องตั้งค่าทั้งฝั่ง Next.js และฝั่ง WordPress webhook ให้ตรงกัน
- ควรเป็น string สุ่มยาว

ตัวอย่าง:

```env
REVALIDATE_SECRET=replace-with-a-long-random-string
```

## Server-Only Write Credentials

### `WP_USERNAME`

- ใช้เฉพาะ server routes ที่เขียนกลับ WordPress
- พบใน:
  - [route.ts](C:/Users/User/Desktop/168innovative/app/api/test-wp-post/route.ts)
  - [route.ts](C:/Users/User/Desktop/168innovative/app/lib/api/wp/create-post/route.ts)

### `WP_APP_PASSWORD`

- ใช้คู่กับ `WP_USERNAME`
- ต้องเป็น WordPress Application Password
- ห้าม expose ไปฝั่ง client

ตัวอย่าง:

```env
WP_USERNAME=your-wordpress-username
WP_APP_PASSWORD=your-wordpress-application-password
```

## Legacy / Optional

### `NEXT_PUBLIC_USE_MOCK`

- มีอยู่ใน `.env.local` เดิม
- ตอนนี้ยังไม่พบการใช้งานใน runtime code
- ถ้าทีมยังไม่ได้ใช้ mock mode สามารถคงไว้เป็น `false` ได้

ตัวอย่าง:

```env
NEXT_PUBLIC_USE_MOCK=false
```

### `PRERENDER_DYNAMIC_ROUTES`

- controls `generateStaticParams()` for dynamic article, category, and product routes
- default `false` skips DB reads during `next build`
- set to `true` only when build-time slug pre-rendering should query the database
- when `NEXT_PUBLIC_USE_MOCK=true`, static params still generate from mock data

Example:

```env
PRERENDER_DYNAMIC_ROUTES=false
```

## Recommended Setup

สำหรับ development ขั้นต่ำ:

```env
WP_API_URL=https://your-wordpress-domain.example
NEXT_PUBLIC_USE_MOCK=false
PRERENDER_DYNAMIC_ROUTES=false
```

ถ้าต้องใช้ webhook revalidate:

```env
WP_API_URL=https://your-wordpress-domain.example
REVALIDATE_SECRET=replace-with-a-long-random-string
NEXT_PUBLIC_USE_MOCK=false
PRERENDER_DYNAMIC_ROUTES=false
```

ถ้าต้องใช้ server route ที่เขียนโพสต์กลับ WordPress:

```env
WP_API_URL=https://your-wordpress-domain.example
WP_USERNAME=your-wordpress-username
WP_APP_PASSWORD=your-wordpress-application-password
REVALIDATE_SECRET=replace-with-a-long-random-string
NEXT_PUBLIC_USE_MOCK=false
PRERENDER_DYNAMIC_ROUTES=false
```

## Notes

- `.env.local` ถูก ignore อยู่แล้วใน [.gitignore](C:/Users/User/Desktop/168innovative/.gitignore)
- อย่า commit ค่า secret จริง
- ถ้าเปลี่ยนค่า env บน Vercel หรือ server ให้ redeploy หรือ restart process หลังแก้
