# TEST_REPORT — LAB 10: เชื่อม Node เข้ากับฐานข้อมูล (SQLite)

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**วันที่ทดสอบ:** 2026-10-22 (Asia/Bangkok)  
**สถานะการทดสอบ:** ผ่านครบถ้วน 100% (31/31 รายการ)

---

## 1. ภาพรวมการทดสอบ (Executive Summary)

การทดสอบในสัปดาห์ที่ 10 ครอบคลุมการเชื่อมต่อ Express API เข้ากับฐานข้อมูล SQLite (`node:sqlite` / `campus.db`) แทนการเก็บข้อมูลแบบไฟล์ JSON ชั่วคราว โดยทำการปรับแก้ Service Layer ให้ดำเนินการผ่านคำสั่ง SQL ทั้งหมด, การเปิดใช้งาน Foreign Key Constraints (`PRAGMA foreign_keys = ON`), การป้องกัน SQL Injection ด้วย Prepared Statements และ Parameterized Queries (`?`), การดึงข้อมูลแบบ JOIN ข้ามตาราง `requests` และ `users` เพื่อแปลงรหัสผู้แจ้งเป็นชื่อ, การจัดการ Database Constraints Error ในระดับ Centralized Error Handler และการทำ Challenge: Endpoints สำหรับ Users, Database Transactions และ Indexing

| ส่วนการประเมิน | จำนวนรายการ | ผลการทดสอบ | สถานะ |
|---|---|---|---|
| ในห้องเรียน (CP26–CP30) | 20 รายการ | ผ่าน 20 / 20 | ผ่านสมบูรณ์ |
| งานที่บ้าน (CP31–CP34) | 8 รายการ | ผ่าน 8 / 8 | ผ่านสมบูรณ์ |
| Challenge พิเศษ | 3 รายการ | ผ่าน 3 / 3 | ผ่านสมบูรณ์ |
| **รวมการทดสอบทั้งหมด** | **31 รายการ** | **ผ่าน 31 / 31** | **ผ่านสมบูรณ์ 100%** |

---

## 2. ผลการรันสคริปต์ตรวจอัตโนมัติ (Automated Checker: check-week10.mjs)

ผลจากการรันสคริปต์ตรวจสอบ `node check-week10.mjs` แสดงผลดังนี้:

| เกณฑ์ | รายการตรวจ | ผลการตรวจ | สถานะ |
|---|---|---|---|
| STRUCT | มีไฟล์ api/data/schema.sql | ตรวจพบ schema.sql | ผ่าน |
| STRUCT | มี service ที่ api/src/services/requestService.js | ตรวจพบ requestService.js | ผ่าน |
| CP26 | service เรียกใช้ node:sqlite | ใช้งานไลบรารี SQLite ของ Node.js | ผ่าน |
| CP26 | เปิด PRAGMA foreign_keys = ON | เปิดใช้งานการตรวจสอบ Foreign Key | ผ่าน |
| CP26 | ไม่อ่านไฟล์ JSON แบบเดิมแล้ว | ยกเลิกการอ่าน/เขียน initialRequests.json | ผ่าน |
| CP27 | ใช้ fileURLToPath / import.meta.url | ระบุตำแหน่งไฟล์แบบสัมพัทธ์ถูกต้อง | ผ่าน |
| CP28 | findAll ใช้ JOIN กับตาราง users | ดึงข้อมูลคำร้องพร้อมชื่อผู้ใช้งาน | ผ่าน |
| CP28 | คืน requesterName ด้วย AS (ไม่ใช่ requester_id) | Alias ชื่อคอลัมน์ตรงตาม API Contract | ผ่าน |
| CP29 | create แปลงชื่อผู้แจ้งเป็น id | แปลงชื่อเป็น requester_id ในฐานข้อมูล | ผ่าน |
| CP31 | ใช้ prepare() กับ placeholder ? | ป้องกัน SQL Injection ทุกคำสั่ง | ผ่าน |
| CP31 | ไม่ต่อค่าจากผู้ใช้เข้า SQL โดยตรง | ตรวจสอบไม่พบการ Concatenate string เข้า SQL | ผ่าน |
| CP28 | GET /api/requests คืนข้อมูลจากฐานข้อมูล | ดึงข้อมูลจริงจาก campus.db สำเร็จ | ผ่าน |
| CP28 | ข้อมูลที่คืนมีรูปแบบ requesterName | คืนฟิลด์ requesterName ถูกต้อง | ผ่าน |
| CP28 | กรอง ?status= ทำงาน (WHERE ในฐานข้อมูล) | กรองข้อมูลด้วย SQL WHERE สำเร็จ | ผ่าน |
| CP28 | GET /:id ที่มีจริง -> 200 | คืนข้อมูลคำร้องพร้อม HTTP 200 | ผ่าน |
| CP28 | GET /:id ที่ไม่มี -> 404 | คืน HTTP 404 Not Found | ผ่าน |
| CP29 | POST สร้างคำร้อง -> 201 · แปลงชื่อเป็น id ให้เอง | บันทึกลงตาราง requests คืน 201 | ผ่าน |
| CP29 | POST ข้อมูลไม่ครบ -> 400 | ตัวตรวจสอบ Validation ทำงานสมบูรณ์ | ผ่าน |
| CP30 | PUT เปลี่ยนสถานะ -> 200 | อัปเดตสถานะในฐานข้อมูลสำเร็จ คืน 200 | ผ่าน |
| CP30 | PUT status ไม่ถูกต้อง -> 400 | ปฏิเสธสถานะนอกรายการที่กำหนด | ผ่าน |
| CP30 | DELETE -> 204 | ลบคำร้องออกจากฐานข้อมูลสำเร็จ คืน 204 | ผ่าน |
| CP31 | ยิง SQL injection แล้วไม่หลุด | ป้องกันการโจมตีผ่าน status คืน 0 รายการ | ผ่าน |
| CP30 | CORS ยังทำงาน | รองรับการเรียกจากพอร์ต Frontend 5173 | ผ่าน |
| CP32 | มี errorHandler รวมศูนย์ | จัดการ Error จากฐานข้อมูลเป็น HTTP code | ผ่าน |
| CP33 | มี test อย่างน้อย 6 เคส | มีชุดทดสอบครอบคลุมทุก Endpoint | ผ่าน |
| CP33 | test ยิง request จริงด้วย supertest | รันเทสต์จริงผ่านระบบเครือข่ายจำลอง | ผ่าน |
| CP34 | มี API_CONTRACT.md ที่อัปเดต | มีเอกสารสัญญา API ฉบับสมบูรณ์ | ผ่าน |
| CP34 | contract มีหัวข้อ data model / ฐานข้อมูล | ระบุโครงสร้างความสัมพันธ์และ Schema | ผ่าน |
| CHAL | Challenge: มี endpoint สำหรับ users | รองรับ GET /api/users และ /api/users/:id/requests | ผ่าน |
| CHAL | Challenge: ใช้ transaction | มีการใช้ db.transaction() บันทึกข้อมูลแบบ atomic | ผ่าน |
| CHAL | Challenge: สร้าง INDEX | มีการสร้าง Index บนฟิลด์ status และ requester_id | ผ่าน |

---

## 3. สรุปผลการรันชุดทดสอบ API (Automated Test Suites: 33/33 Tests)

รันคำสั่ง `npm test` ใน `labs/week-10/source/api` ผ่านครบทุกชุดทดสอบ:
- **Suite 1: GET /api/requests** (5 tests) — คืน array 200, คืน requesterName, กรอง ?status=, GET /:id 200/404 ผ่านทั้งหมด
- **Suite 2: POST /api/requests** (4 tests) — บันทึกคำร้อง 201, สร้างผู้ใช้ใหม่อัตโนมัติ, ข้อมูลไม่ครบ 400, ประเภทคำร้องไม่ถูกต้อง 400 ผ่านทั้งหมด
- **Suite 3: PUT & DELETE /api/requests/:id** (5 tests) — เปลี่ยนสถานะ 200, สถานะผิด 400, ไม่พบ 404, ลบ 204, ลบไม่พบ 404 ผ่านทั้งหมด
- **Suite 4: CP31 SQL Injection** (3 tests) — ทดสอบ boolean-based, DROP TABLE injection, chained injection ข้อมูลไม่รั่วไหล
- **Suite 5: CP32 Error Handling** (7 tests) — ดักจับ CHECK, FOREIGN KEY, UNIQUE, NOT NULL constraints คืน 400/409 อย่างถูกต้อง
- **Suite 6: Challenge Users Endpoints** (5 tests) — GET /api/users, GET /api/users/:id/requests, ตรวจสอบ validation ของ ID
- **Suite 7: Challenge Transactions** (1 test) — ยืนยันว่าการ rollback ทำงานเมื่อขั้นตอนการสร้างคำร้องล้มเหลว
- **Suite 8: Challenge Indexing & EXPLAIN QUERY PLAN** (3 tests) — ยืนยันการใช้งาน Index (SEARCH TABLE USING INDEX แทน SCAN TABLE)
- **รวมทั้งหมด:** 33 passed, 0 failed (100%)
