# API Contract — Campus Service Request API
**Base URL:** `http://localhost:3001`
**รูปแบบข้อมูล:** JSON (`Content-Type: application/json`)

> **API Contract คืออะไร** — ข้อตกลงระหว่างคนทำ front-end กับคนทำ back-end
> ว่าจะคุยกันด้วย endpoint อะไร ส่งอะไรไป ได้อะไรกลับ
> มีไว้เพื่อให้สองฝั่ง**ทำงานคู่ขนานกันได้** โดยไม่ต้องรอกัน

---

## โครงสร้างข้อมูล Request

| field | ชนิด | คำอธิบาย | ตัวอย่าง |
|---|---|---|---|
| `id` | string | รหัสคำร้อง · ขึ้นต้นด้วย `REQ-` · เซิร์ฟเวอร์สร้างให้ | `"REQ-001"` |
| `requesterName` | string | ชื่อผู้แจ้ง · อย่างน้อย 2 ตัวอักษร | `"สมชาย ใจดี"` |
| `requestType` | string | ประเภท · 1 ใน 4 ค่าที่กำหนด | `"แจ้งซ่อม"` |
| `location` | string | สถานที่ · ห้ามว่าง | `"ห้องปฏิบัติการ 301"` |
| `details` | string | รายละเอียด · อย่างน้อย 10 ตัวอักษร | `"เครื่องปรับอากาศไม่ทำงาน"` |
| `priority` | string | `"normal"` หรือ `"urgent"` | `"urgent"` |
| `status` | string | `"pending"` · `"in-progress"` · `"completed"` | `"pending"` |

**ค่าที่ยอมรับของ `requestType`** — `แจ้งซ่อม` · `บริการบัญชีผู้ใช้` · `ขอใช้อุปกรณ์` · `อื่น ๆ`

---

## Data Model — ฐานข้อมูล SQLite (CP34)

โครงสร้างตาม `api/data/schema.sql` มี 2 ตาราง โดย `api/src/services/requestService.js` เปิดฐานข้อมูลผ่าน `node:sqlite` และเปิด `PRAGMA foreign_keys = ON` ทุกครั้งที่เชื่อมต่อ

### ตาราง users

| คอลัมน์ | ชนิด | Constraint / ค่าเริ่มต้น |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `name` | TEXT | NOT NULL |
| `department` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL, UNIQUE |

### ตาราง requests

| คอลัมน์ | ชนิด | Constraint / ค่าเริ่มต้น |
|---|---|---|
| `id` | TEXT | PRIMARY KEY เช่น `REQ-001` |
| `requester_id` | INTEGER | NOT NULL, FOREIGN KEY → `users(id)` |
| `request_type` | TEXT | NOT NULL, CHECK: `แจ้งซ่อม`, `บริการบัญชีผู้ใช้`, `ขอใช้อุปกรณ์`, `อื่น ๆ` |
| `location` | TEXT | NOT NULL |
| `details` | TEXT | NOT NULL |
| `priority` | TEXT | NOT NULL, DEFAULT `normal`, CHECK: `normal`, `urgent` |
| `status` | TEXT | NOT NULL, DEFAULT `pending`, CHECK: `pending`, `in-progress`, `completed` |
| `created_at` | TEXT | NOT NULL, DEFAULT `datetime('now','localtime')` |

`requests.requester_id` ทำให้ผู้แจ้งหนึ่งคนมีหลายคำร้องได้โดยไม่เก็บชื่อซ้ำทุกแถว การลบ user ที่ยังมีคำร้องอ้างถึงจะถูก foreign key ป้องกันไว้

**Index ของ Challenge:** `idx_requests_status` บน `requests(status)` และ `idx_requests_requester` บน `requests(requester_id)` ทั้ง `schema.sql` และ `loadSeed()` สร้างด้วย `CREATE INDEX IF NOT EXISTS` ดังนั้นการเริ่มระบบเพิ่ม index ที่ขาดให้ฐานข้อมูลเดิมได้โดยไม่ลบข้อมูล

**รูปแบบฐานข้อมูลกับรูปแบบ API ต่างกัน:** ฐานข้อมูลเก็บ `requester_id` เป็นตัวเลขและ `request_type` เป็น snake_case ส่วน API คืน `requesterName` และ `requestType` ให้ frontend ชั้น service ใช้ `JOIN users` และ `AS` แปลงชื่อ field จึงไม่ต้องแก้ controller หรือ frontend และไม่ส่ง `requester_id` หรือ `created_at` ใน response ของคำร้อง

**การเปลี่ยน schema:** การแก้ `schema.sql` ไม่เปลี่ยนตารางใน `campus.db` ที่มีอยู่แล้ว `loadSeed()` ใช้ schema เฉพาะเมื่อยังไม่มีตาราง `requests` ดังนั้นฐานข้อมูลเดิมที่ขาด CHECK ต้องปรับโครงสร้างหรือสร้างใหม่หลังสำรองข้อมูลก่อนนำไปใช้งาน

**สถานะฐานข้อมูลที่ส่งตรวจ:** ปรับ `campus.db` เดิมให้มี CHECK ทั้ง 3 ตัวและ index แล้วเมื่อ 7 ตุลาคม 2026 โดยย้ายข้อมูลภายใน transaction และเก็บ users เดิม 5 คน / requests เดิม 5 รายการ รวมถึง `created_at` ไว้ครบ ตรวจ FOREIGN KEY และ `PRAGMA integrity_check` ผ่าน

---

## Endpoints

| Method | Endpoint | คำอธิบาย | Request body | สำเร็จ | ผิดพลาด |
|---|---|---|---|---|---|
| `GET` | `/api/requests` | ดูคำร้องทั้งหมด | — | `200` + array | — |
| `GET` | `/api/requests?status=` | กรองตามสถานะ | — | `200` + array | — |
| `GET` | `/api/requests/:id` | ดูคำร้องใบเดียว | — | `200` + object | `404` ไม่พบ |
| `POST` | `/api/requests` | สร้างคำร้องใหม่ | Request (ไม่ต้องมี `id`, `status`) | `201` + object ที่สร้าง | `400` ข้อมูลไม่ถูกต้อง · `409` ข้อมูลซ้ำ |
| `PUT` | `/api/requests/:id` | เปลี่ยนสถานะ | `{ "status": "..." }` | `200` + object ที่แก้แล้ว | `400` สถานะผิด · `404` ไม่พบ |
| `DELETE` | `/api/requests/:id` | ลบคำร้อง | — | `204` ไม่มี body | `404` ไม่พบ |
| `GET` | `/api/users` | รายชื่อผู้ใช้ทั้งหมด เรียงตาม id | — | `200` + array ของ user | — |
| `GET` | `/api/users/:id/requests` | คำร้องของผู้ใช้คนนั้น เรียงตามรหัสคำร้อง | — | `200` + array ของ Request | `400` รหัสผิดรูปแบบ · `404` ไม่พบผู้ใช้ |

---

## ตัวอย่างการเรียกใช้

### GET /api/requests

```http
GET /api/requests HTTP/1.1
Host: localhost:3001
```

```json
[
  {
    "id": "REQ-001",
    "requesterName": "สมชาย ใจดี",
    "requestType": "แจ้งซ่อม",
    "location": "ห้องปฏิบัติการ 301",
    "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า",
    "priority": "urgent",
    "status": "pending"
  }
]
```

### POST /api/requests

```http
POST /api/requests HTTP/1.1
Content-Type: application/json

{
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal"
}
```

**201 Created**

```json
{
  "id": "REQ-006",
  "requesterName": "สุภาวดี รักเรียน",
  "requestType": "ขอใช้อุปกรณ์",
  "location": "ห้องประชุม 2",
  "details": "ขอยืมโปรเจกเตอร์สำหรับนำเสนอ",
  "priority": "normal",
  "status": "pending"
}
```

**400 Bad Request** — เมื่อข้อมูลไม่ถูกต้อง

```json
{
  "error": "ข้อมูลคำร้องไม่ถูกต้อง",
  "details": [
    "ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร",
    "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร"
  ]
}
```

### PUT /api/requests/:id

```http
PUT /api/requests/REQ-001 HTTP/1.1
Content-Type: application/json

{ "status": "in-progress" }
```

**200 OK** — คืนคำร้องที่อัปเดตแล้ว

### DELETE /api/requests/:id

**204 No Content** — ไม่มี body ส่งกลับ

---

## พฤติกรรมของ POST ที่เกี่ยวกับผู้แจ้ง (CP34)

Frontend ส่ง `requesterName` มาเป็นชื่อ โดยไม่ต้องส่ง `requester_id` ชั้น service จะ trim ชื่อแล้วค้นหาในตาราง `users` ด้วย parameterized query

- ถ้ามีชื่อนั้นแล้ว จะใช้ `users.id` เดิมโดยไม่สร้าง user ซ้ำ
- ถ้ายังไม่มีชื่อนั้น จะสร้าง user ใหม่อัตโนมัติ โดยใช้ department `ไม่ระบุ` และ email รูปแบบ `user-<ค่าที่สร้างจากเวลา>@rmutl.ac.th` จากนั้นนำ id ที่ได้ไปบันทึกคำร้อง
- คำร้องใหม่มีสถานะเริ่มต้น `pending` และ response `201` คืน `requesterName` ตามรูปแบบ API
- `requesterName`, `location`, `details` ถูก trim ก่อนบันทึก แต่ body ยังต้องผ่าน validation ซึ่งกำหนดให้ส่ง `priority` เป็น `normal` หรือ `urgent`
- การสร้าง user และคำร้องอยู่ใน transaction เดียวกันด้วย `BEGIN IMMEDIATE` หากสำเร็จจะ `COMMIT` หาก query ล้มเหลวจะ `ROLLBACK` ก่อนแปลง error จึงไม่ทิ้ง user ที่ถูกสร้างในครั้งนั้นค้างไว้
- การลบคำร้องไม่ลบ user อัตโนมัติ

---

## Users Endpoints (Challenge)

`GET /api/users` คืนข้อมูลผู้ใช้รูปแบบนี้ โดยยังคืนผู้ใช้ที่ไม่มีคำร้องด้วย

```json
[
  {
    "id": 1,
    "name": "สมชาย ใจดี",
    "department": "วิศวกรรมซอฟต์แวร์",
    "email": "somchai@rmutl.ac.th"
  }
]
```

`GET /api/users/1/requests` คืนเฉพาะคำร้องของผู้ใช้ id 1 ในรูปแบบ Request เดิม เช่น `REQ-001` และ `REQ-004` จาก seed โดยมี `requesterName` และไม่มี `requester_id`

- ผู้ใช้มีจริงแต่ไม่มีคำร้อง: `200` พร้อม `[]`
- รหัสเป็นจำนวนเต็มบวกแต่ไม่พบผู้ใช้: `404`
- รหัสผิดรูปแบบ เช่น `0`, `-1`, `1.5`, ข้อความ หรือเกินจำนวนเต็มที่ JavaScript เก็บได้อย่างปลอดภัย: `400` พร้อม `รหัสผู้ใช้ต้องเป็นจำนวนเต็มบวก`

Queries ที่รับ id ยังใช้ placeholder `?` และ service เป็นผู้ query ฐานข้อมูล route รับผิดชอบการตรวจรหัสและตอบ HTTP

---

## รูปแบบ Error

ทุก error ตอบเป็น JSON ที่มี field `error` เสมอ

```json
{ "error": "ข้อความที่ผู้ใช้ทั่วไปอ่านเข้าใจ" }
```

กรณี validation จะมี `details` เพิ่มมาเป็น array บอกว่าผิดตรงไหนบ้าง

| Status | เมื่อไหร่ | ฝั่งไหนผิด |
|---|---|---|
| `400` | ข้อมูลที่ส่งมาไม่ถูกต้อง | ผู้ใช้ |
| `404` | ไม่พบทรัพยากรที่ขอ | ผู้ใช้ |
| `409` | ข้อมูลซ้ำกับค่าที่มีอยู่แล้วและติด UNIQUE | ผู้ใช้ |
| `500` | โค้ดเซิร์ฟเวอร์ผิดพลาด | เซิร์ฟเวอร์ |

### การแปลง error จากฐานข้อมูล (CP32)

Service ห่อ query ที่สร้าง แก้ไข และลบข้อมูล แล้วใช้ `AppError` กำหนด HTTP status ให้ errorHandler เดิม

| Error จาก SQLite | HTTP status | ข้อความใน field `error` |
|---|---|---|
| FOREIGN KEY constraint failed | `400` | อ้างถึงข้อมูลที่ไม่มีอยู่จริง |
| CHECK constraint failed | `400` | ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด |
| NOT NULL constraint failed | `400` | กรุณาระบุข้อมูลที่จำเป็นให้ครบ |
| UNIQUE constraint failed | `409` | ข้อมูลนี้มีอยู่แล้วในระบบ |
| no such table / error ภายในอื่น | `500` | เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ |

ข้อมูลผิดตาม validation เช่น `requestType` ที่ไม่อยู่ในรายการ จะถูกตอบ `400` ก่อนถึงฐานข้อมูล ส่วน constraint error ที่เกิดจาก query จริงจะถูกแปลงใน service ข้อความ `error` จึงไม่ส่งรายละเอียด constraint ของ SQLite ให้ผู้ใช้

> **ตอน production จะไม่ส่ง stack trace กลับไป** — เปิดเผยโครงสร้างภายในให้คนภายนอกเห็นไม่ได้

---

## CORS

API อนุญาตให้เรียกจาก origin ที่กำหนดใน `CORS_ORIGIN` เท่านั้น

```
Access-Control-Allow-Origin: http://localhost:5173
```

**ถ้าเรียกจาก origin อื่น** เบราว์เซอร์จะบล็อกก่อนที่โค้ดจะได้เห็น response — จะเห็น error ใน Console ว่าถูกบล็อกโดย CORS policy

> ⚠ CORS เป็นกลไกของ **เบราว์เซอร์** เท่านั้น · Postman และ curl ไม่ถูกบล็อก เพราะไม่ใช่เบราว์เซอร์

---

## Environment Variables

### ฝั่ง API (`api/.env`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `PORT` | `3001` | พอร์ตที่ API รับคำขอ |
| `CORS_ORIGIN` | `http://localhost:5173` | origin ที่อนุญาตให้เรียก |
| `NODE_ENV` | `development` | `production` จะเปลี่ยนรูปแบบ log และซ่อน stack trace |
| `DB_FILE` | `api/data/campus.db` โดยอ้างจากตำแหน่ง service | ระบุไฟล์ SQLite อื่นได้ ถ้าเป็น path สัมพัทธ์จะอ้างจากโฟลเดอร์ที่รันคำสั่ง |

### ฝั่ง Frontend (`frontend/.env.local`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | ที่อยู่ของ API |

> **ต้องขึ้นต้นด้วย `VITE_`** ไม่งั้น Vite จะไม่ส่งค่าไปให้โค้ดฝั่งเบราว์เซอร์
> และ**ห้าม commit ไฟล์ `.env`** — ใช้ `.env.example` เป็นตัวอย่างแทน

---

## การรันทั้งระบบ

ต้องเปิด **2 terminal** พร้อมกัน

```bash
# Terminal 1 — API
cd api && npm run dev          # http://localhost:3001

# Terminal 2 — Frontend
cd frontend && npm run dev     # http://localhost:5173
```

**ลำดับสำคัญ** — เปิด API ก่อนเสมอ ไม่งั้น frontend จะขึ้นข้อความว่าติดต่อเซิร์ฟเวอร์ไม่ได้

---

## ผลการทดสอบ SQL Injection (CP31)

ทดสอบวันที่ **7 ตุลาคม 2026** ผ่าน `supertest` โดยเรียก Express app จริงและฐานข้อมูล SQLite ชั่วคราวที่สร้างจาก `schema.sql` ใช้ `GET /api/requests?status=` โดย URL-encode ค่า status ก่อนส่ง

| รูปแบบ | ค่า status ที่ส่ง | ผลที่ได้ |
|---|---|---|
| ① เงื่อนไขจริงเสมอ | `x' OR '1'='1` | HTTP `200`, `[]` (0 รายการ) |
| ② พยายามลบตาราง | `'; DROP TABLE requests; --` | HTTP `200`, `[]` (0 รายการ) |
| ③ ต่อเงื่อนไขสถานะ | `pending' OR status='completed` | HTTP `200`, `[]` (0 รายการ) |

หลังส่งแต่ละแบบ `GET /api/requests` ยังตอบ `200` พร้อมข้อมูลตั้งต้น 5 รายการเหมือนก่อนทดสอบ และตรวจ `sqlite_master` ยืนยันว่าตาราง `requests` ยังอยู่ รวมถึงหลังแบบ DROP TABLE

**เหตุผลที่กันได้:** `findAll()` ใช้ `WHERE r.status = ?` และ `.all(status)` ค่าจากผู้ใช้ถูกผูกเป็นข้อความทั้งหมด จึงไม่ถูกตีความเป็นคำสั่ง SQL การต่อ `${SELECT_SHAPE}` ปลอดภัยเพราะเป็น SQL คงที่ใน service การค้นหาด้วย id การค้นหาชื่อผู้แจ้ง และ query ที่เขียนข้อมูลก็ใช้ placeholder `?` กับค่าจากผู้ใช้เช่นกัน

Placeholder ใช้แทนค่าข้อมูล ไม่ใช่ชื่อคอลัมน์หรือชื่อตาราง หากเพิ่มตัวเลือกเรียงลำดับต้องเลือกชื่อคอลัมน์จาก allowlist ก่อนใช้ใน SQL

## Automated Tests (CP33)

รัน `npm test` จาก `api/` ชุดทดสอบมี **33 เคส** ครอบคลุมการอ่านและกรองคำร้อง รูปแบบ field การสร้างคำร้องและผู้แจ้งใหม่ validation การแก้สถานะ การลบ SQL injection ทั้ง 3 แบบ และการแปลง FOREIGN KEY / CHECK / UNIQUE / NOT NULL เป็น status ที่เหมาะสม รวมถึง error จากตารางหายที่ยังตอบ `500` เพิ่มเคสสำหรับ users endpoints, rollback และการใช้ index

ชุดทดสอบกำหนด `DB_FILE` เป็นไฟล์ใหม่ในโฟลเดอร์ชั่วคราวก่อน import service และสร้าง seed ใหม่ก่อนแต่ละเคส เคส CP32 ใช้ trigger ในฐานข้อมูลทดสอบให้ query ของ API เจอ constraint จริง เพื่อแยกจากกรณีที่ validation ตอบ `400` ก่อนถึง service เมื่อจบจะลบฐานข้อมูลชั่วคราว จึงไม่เขียนทับ `campus.db` หรือไฟล์ฐานข้อมูลที่ผู้ใช้กำหนดไว้

## ผลการทดสอบ Challenge

**Transaction:** เมื่อเรียก `service.create()` ด้วยชื่อใหม่และ `requestType` ที่ผิด CHECK จำนวน users ยังคง 4 และ requests ยังคง 5 ไม่พบ user ใหม่นั้น จากนั้น POST ข้อมูลที่ถูกต้องด้วยชื่อเดิมสำเร็จเป็น `201` และจำนวนเพิ่มเป็น 5 users / 6 requests พิสูจน์ว่า rollback ไม่ทิ้งข้อมูลค้างและ transaction ครั้งถัดไปยังทำงานได้ เคส HTTP ที่ใช้ trigger ให้คำร้องผิด CHECK ก็ยืนยันว่าไม่เหลือ user ใหม่เช่นกัน

**Index:** วัดด้วย `EXPLAIN QUERY PLAN` บนฐานข้อมูลชั่วคราวที่สร้างจาก schema วันที่ 7 ตุลาคม 2026

| Query | ก่อนมี index | หลังมี index |
|---|---|---|
| `SELECT * FROM requests WHERE status = ?` | `SCAN requests` | `SEARCH requests USING INDEX idx_requests_status (status=?)` |
| `SELECT * FROM requests WHERE requester_id = ?` | `SCAN requests` | `SEARCH requests USING INDEX idx_requests_requester (requester_id=?)` |

ผลนี้ยืนยันว่า SQLite เลือกใช้ index สำหรับ query ตัวอย่าง ยังไม่ได้วัดเวลาหรืออ้างว่าข้อมูลขนาดเล็กเร็วขึ้นกี่เท่า ชุดทดสอบยังตรวจว่า `loadSeed()` เพิ่ม index ให้ฐานข้อมูลเดิมที่ยังไม่มี index ได้

## ประวัติการเปลี่ยนแปลง

| เวอร์ชันเอกสาร | วันที่ | การเปลี่ยนแปลง |
|---|---|---|
| 2.2.0 | 7 ตุลาคม 2026 | เพิ่ม users endpoints, transaction, index และผล EXPLAIN QUERY PLAN ขยายชุดทดสอบเป็น 33 เคส |
| 2.1.0 | 7 ตุลาคม 2026 | ใช้ SQLite แทน JSON เพิ่ม Data Model การแปลง JOIN/AS พฤติกรรมสร้าง user อัตโนมัติ DB_FILE การแปลง constraint error ผล SQL injection และชุดทดสอบ CP31–CP34 |
| 2.0.0 | ก่อน Week 10 | API และ frontend ของ Week 07 พร้อม GET / POST / PUT / DELETE, validation, CORS และ environment variables |
