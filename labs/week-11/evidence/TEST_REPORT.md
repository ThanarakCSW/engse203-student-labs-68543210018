# TEST_REPORT — LAB 11: Full-Stack Integration (React, Express, SQLite)

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**วันที่ทดสอบ:** 2026-10-21 (Asia/Bangkok)  
**สถานะการทดสอบ:** ผ่านครบถ้วน 100% (41/41 รายการ)

---

## 1. ภาพรวมการทดสอบ (Executive Summary)

การทดสอบในสัปดาห์ที่ 11 มุ่งเน้นการบูรณาการระบบ Full-Stack 3 ชั้น (Three-Tier Architecture) ที่ทำงานประสานกันอย่างสมบูรณ์ ประกอบด้วย **React 18 (Frontend)**, **Express.js (API Layer)** และ **SQLite (Database Layer: campus.db)** โดยพัฒนาต่อยอดให้ระบบมีความพร้อมสำหรับการนำไปใช้งานจริง (Production-ready) ผ่านการรวมศูนย์การตั้งค่า (Centralized Configuration), การเพิ่มระบบตรวจสุขภาพ (Health Check Endpoint), การจัดการข้อผิดพลาดและบันทึกประวัติ (Centralized Error Handling & Morgan Logging), การเตรียมการสร้าง Bundle สำหรับ Production บนพอร์ตเดียว (Single Port Serving) และการตั้งค่า CI Workflow

| ส่วนการประเมิน | จำนวนรายการ | ผลการทดสอบ | สถานะ |
|---|---|---|---|
| ในห้องเรียน (CP35–CP39) | 17 รายการ | ผ่าน 17 / 17 | ผ่านสมบูรณ์ |
| งานที่บ้าน (CP40–CP43) | 20 รายการ | ผ่าน 20 / 20 | ผ่านสมบูรณ์ |
| Challenge พิเศษ | 4 รายการ | ผ่าน 4 / 4 | ผ่านสมบูรณ์ |
| **รวมการทดสอบทั้งหมด** | **41 รายการ** | **ผ่าน 41 / 41** | **ผ่านสมบูรณ์ 100%** |

---

## 2. ผลการรันสคริปต์ตรวจอัตโนมัติ (Automated Checker: check-week11.mjs)

ผลจากการรันสคริปต์ตรวจสอบ `node check-week11.mjs` แสดงผลดังนี้:

| เกณฑ์ | รายการตรวจ | ผลการตรวจ | สถานะ |
|---|---|---|---|
| CP35 | มีชั้น API (api/src/app.js) | ตรวจพบไฟล์ app.js | ผ่าน |
| CP35 | มีชั้น frontend (frontend/src) | ตรวจพบโฟลเดอร์ frontend/src | ผ่าน |
| CP35 | มีชั้นฐานข้อมูล (api/data/schema.sql) | ตรวจพบ schema.sql | ผ่าน |
| CP36 | มี config.js รวม env ไว้ที่เดียว | รวมศูนย์การตั้งค่าใน api/src/config.js | ผ่าน |
| CP36 | config อ่าน NODE_ENV | มีการอ่าน process.env.NODE_ENV | ผ่าน |
| CP36 | config อ่าน PORT จาก env | มีการอ่าน process.env.PORT | ผ่าน |
| CP36 | config มี isProd แยก dev/production | มี flag isProd สำหรับตรวจสอบโหมด | ผ่าน |
| CP36 | app.js ใช้ config ไม่ hardcode | เรียกใช้ config.corsOrigin และ config.port | ผ่าน |
| CP37 | มี healthRoutes.js | ตรวจพบไฟล์ route ตรวจสุขภาพ | ผ่าน |
| CP37 | app.js ผูก /api/health | เชื่อมโยง route เข้ากับ Express app | ผ่าน |
| CP37 | health คืนสถานะฐานข้อมูล | รายงานสถานะ database.connected | ผ่าน |
| CP37 | service มี getDbStatus() | มีฟังก์ชันตรวจสอบการเชื่อมต่อฐานข้อมูล | ผ่าน |
| CP38 | มี errorHandler รวมศูนย์ | ตรวจพบ middleware errorHandler ใน middleware/ | ผ่าน |
| CP38 | มี notFound handler | ตรวจพบ middleware notFound จัดการ 404 | ผ่าน |
| CP38 | ใช้ morgan logging | มีการเรียกใช้ morgan สำหรับ HTTP log | ผ่าน |
| CP38 | logging แยก dev/production | สลับระหว่าง dev format และ combined format | ผ่าน |
| CP39 | app.js เสิร์ฟ static ตอน production | เสิร์ฟ frontend/dist ผ่าน express.static | ผ่าน |
| CP39 | config มี staticDir | กำหนดตำแหน่ง staticDir ใน config.js | ผ่าน |
| CP39 | production: เปิด / แล้วได้หน้าเว็บ (ไม่ใช่ JSON) | ส่งคืน index.html เมื่อเป็นโหมด production | ผ่าน |
| CP39 | bundle production ไม่ฝัง localhost:3001 (ใช้ path สัมพัทธ์) | ตรวจสอบไฟล์ assets ไม่พบ hardcoded localhost | ผ่าน |
| CP39 | frontend มี build script | มีคำสั่ง vite build ใน package.json | ผ่าน |
| CP39 | frontend build แล้ว (มี dist/) | ตรวจพบ frontend/dist/index.html | ผ่าน |
| CP37 | GET /api/health ตอบ 200 + status ok | HTTP 200 พร้อม status: 'ok' | ผ่าน |
| CP37 | health บอก env และ database | แสดงค่า env, uptime, database | ผ่าน |
| CP35 | ระบบยังคืนข้อมูลได้ (integration ไม่พัง) | GET /api/requests ตอบ 200 พร้อมข้อมูล | ผ่าน |
| CP38 | route ที่ไม่มี -> 404 (notFound ทำงาน) | GET /api/nope ตอบ 404 เป็น JSON | ผ่าน |
| CP40 | มี README.md | ตรวจพบไฟล์ README.md | ผ่าน |
| CP40 | README อธิบายสถาปัตยกรรม 3 ชั้น | มีเนื้อหาอธิบาย 3-tier ละเอียด > 600 ตัวอักษร | ผ่าน |
| CP40 | README มีวิธีรัน (npm) | ระบุวิธีรันทั้ง dev และ production ด้วย npm | ผ่าน |
| CP41 | มีบันทึกคำตอบ DATABASE_CHOICES.md | ตรวจพบไฟล์ DATABASE_CHOICES.md | ผ่าน |
| CP41 | ตอบเรื่อง SQLite/NoSQL/async | อธิบาย SQLite, NoSQL/MongoDB และ async > 400 ตัวอักษร | ผ่าน |
| CP42 | มีหลักฐานสาธิต (DEMO.md หรือลิงก์วิดีโอ) | ตรวจพบ DEMO.md พร้อมรายการสาธิต | ผ่าน |
| CP43 | frontend build แล้ว (จำลอง production ได้) | มีไฟล์ dist/ พร้อมจำลองรันจริง | ผ่าน |
| CP43 | app.js เสิร์ฟ static ตอน production (พอร์ตเดียว) | express.static ทำงานร่วมกับ SPA fallback | ผ่าน |
| CP43 | มี frontend/.env.production (VITE_API_BASE_URL ว่าง) | กำหนด VITE_API_BASE_URL= ว่าง | ผ่าน |
| CP43 | root package.json มี script build + start (build ใช้ --include=dev) | มีสคริปต์ build/start ถูกต้อง | ผ่าน |
| CP43 | มีไฟล์เตรียม deploy จริง (render.yaml — สำหรับ Challenge) | ตรวจพบ render.yaml | ผ่าน |
| CHAL | Challenge: มี deploy config จริง (render.yaml/Procfile/Dockerfile) | ตรวจพบ render.yaml สำหรับ Cloud | ผ่าน |
| CHAL | Challenge: render.yaml ตามสเปกปัจจุบัน | กำหนด runtime, rootDir, healthCheckPath, NODE_VERSION | ผ่าน |
| CHAL | Challenge: health check บอก uptime | Response มีฟิลด์ uptime จาก process.uptime() | ผ่าน |
| CHAL | Challenge: มี CI (.github/workflows) | ตรวจพบ workflow check.yml | ผ่าน |

---

## 3. สรุปผลการรันชุดทดสอบ API (Node.js Test Runner)

การทดสอบผ่าน `npm test` ใน `labs/week-11/source/api` ผลการทดสอบผ่านครบ 8/8 ข้อ:

| ชุดการทดสอบ | รายการทดสอบ | สถานะ |
|---|---|---|
| GET `/api/requests` | คืน array จากฐานข้อมูล พร้อมสถานะ 200 OK | ผ่าน |
| GET `/api/requests` | คืน requesterName ไม่ใช่ requester_id (Mapping ข้อมูลถูกต้อง) | ผ่าน |
| GET `/api/requests?status=pending` | กรองข้อมูลตามสถานะคำร้องได้ถูกต้อง | ผ่าน |
| GET `/api/requests/:id` | กรณีพบคำร้อง ส่งคืนข้อมูลพร้อม 200 OK | ผ่าน |
| GET `/api/requests/REQ-999` | กรณีไม่พบคำร้อง ส่งคืน 404 Not Found | ผ่าน |
| POST `/api/requests` | ข้อมูลครบถ้วน ถูกต้อง ส่งคืน 201 Created พร้อมแปลงชื่อผู้ใช้เป็น ID | ผ่าน |
| POST `/api/requests` | ข้อมูลไม่ครบถ้วน ส่งคืน 400 Bad Request | ผ่าน |
| ความปลอดภัย (Security) | ป้องกัน SQL Injection ผ่านพารามิเตอร์ `?status=` ข้อมูลไม่รั่วไหล | ผ่าน |

---

## 4. ผลการตรวจสอบการทำงานของระบบ (Runtime Verification)

### 4.1 การทดสอบ GET `/api/health`
- **Method:** GET
- **URL:** `http://localhost:3001/api/health`
- **Status Code:** `200 OK`
- **Response Payload:**
  ```json
  {
    "status": "ok",
    "env": "development",
    "uptime": 124,
    "database": {
      "connected": true,
      "file": "api/data/campus.db",
      "tables": ["users", "requests"]
    },
    "time": "2026-10-21T16:00:00.000Z"
  }
  ```

### 4.2 การทดสอบ Static Serving ในโหมด Production (Single Port)
- รันด้วยคำสั่ง: `NODE_ENV=production PORT=10000 npm start`
- เมื่อทดสอบเข้าหน้าแรก `http://localhost:10000/`: เซิร์ฟเวอร์ส่งคืนไฟล์ `frontend/dist/index.html` (พบ `<div id="root">`)
- เมื่อเรียก API `http://localhost:10000/api/requests`: เซิร์ฟเวอร์ส่งคืนข้อมูลคำร้องเป็น JSON จากฐานข้อมูล SQLite บนพอร์ตเดียวกัน

---

## 5. การวิเคราะห์ทางเลือกฐานข้อมูล (Database Choices Summary)

สรุปสาระสำคัญจากเอกสาร [DATABASE_CHOICES.md](../source/DATABASE_CHOICES.md):
1. **เหตุผลที่เลือก SQLite แทน MongoDB:** ข้อมูลคำร้องและผู้ใช้งานมีโครงสร้างและ Schema ที่ตายตัว มีความสัมพันธ์แบบ Foreign Key ชัดเจน และต้องการความถูกต้องสมบูรณ์ของข้อมูลระดับ ACID ซึ่ง SQL Database เหมาะสมกว่า Document-based NoSQL
2. **ผลกระทบหากเปลี่ยนไปใช้ MongoDB:** ไม่กระทบ Frontend แต่กระทบ Service Layer อย่างมากเนื่องจากต้องเปลี่ยนจาก Synchronous I/O ของ better-sqlite3 เป็น Asynchronous I/O ของ MongoDB Driver ซึ่งส่งผลกระทบต่อเนื่องไปยัง Controller Layer ที่ต้องปรับเป็น `async/await` ทั้งหมด
3. **หลักการใช้งาน async:** ใช้เมื่อการประมวลผลเป็น I/O-bound (เช่น การรอเครือข่าย หรือการเชื่อมต่อฐานข้อมูลภายนอกเครื่อง) เพื่อไม่ให้กระทบ Main Thread ของ Node.js
