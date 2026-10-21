# TEST_REPORT — LAB 13: Authentication, Authorization & Security Hardening

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**วันที่ทดสอบ:** 2026-10-22 (Asia/Bangkok)  
**สถานะการทดสอบ:** ผ่านครบถ้วน 100% (27/27 รายการ)

---

## 1. ภาพรวมการทดสอบ (Executive Summary)

การทดสอบในสัปดาห์ที่ 13 มุ่งเน้นการเสริมความมั่นคงปลอดภัยให้กับระบบ Campus Service (Security Hardening) ครอบคลุมการจำกัดขนาดข้อมูลนำเข้าเพื่อป้องกัน Denial of Service (DoS), การแฮชรหัสผ่านด้วย `node:crypto` อัลกอริทึม scrypt พร้อม Salt แบบสุ่ม, การพิสูจน์ตัวตนผ่าน JSON Web Token (JWT Authentication), การควบคุมสิทธิ์ตามบทบาท (Role-Based Access Control: RBAC) ระหว่างผู้ใช้ทั่วไปและเจ้าหน้าที่ (Staff), การป้องกันการโจมตีแบบ Brute-Force ด้วย Rate Limiting, การจัดการข้อผิดพลาดและปิดการแสดงผล Stack Trace ในโหมด Production

| ส่วนการประเมิน | จำนวนรายการ | ผลการทดสอบ | สถานะ |
|---|---|---|---|
| ในห้องเรียน (CP48–CP52) | 23 รายการ | ผ่าน 23 / 23 | ผ่านสมบูรณ์ |
| Challenge พิเศษ | 4 รายการ | ผ่าน 4 / 4 | ผ่านสมบูรณ์ |
| **รวมการทดสอบทั้งหมด** | **27 รายการ** | **ผ่าน 27 / 27** | **ผ่านสมบูรณ์ 100%** |

---

## 2. ผลการรันสคริปต์ตรวจอัตโนมัติ (Automated Checker: check-week13.mjs)

ผลจากการรันสคริปต์ตรวจสอบ `node check-week13.mjs` แสดงผลดังนี้:

| เกณฑ์ | รายการตรวจ | ผลการตรวจ | สถานะ |
|---|---|---|---|
| CP48 | ชื่อผู้แจ้ง 100 ตัวผ่าน · 101 ตัวถูกปฏิเสธ | ตรวจสอบ Boundary ความยาว 100 ตัวอักษร | ผ่าน |
| CP48 | รายละเอียด 1000 ตัวผ่าน · 1001 ตัวถูกปฏิเสธ | ตรวจสอบ Boundary ความยาว 1000 ตัวอักษร | ผ่าน |
| CP48 | สถานที่ยาวเกิน 100 ตัวถูกปฏิเสธ | ตรวจสอบความยาวสถานที่ | ผ่าน |
| CP49 | hashPassword คืนรูปแบบ scrypt$salt$hash | โครงสร้าง Hash ถูกต้องตามมาตรฐาน | ผ่าน |
| CP49 | รหัสผ่านเดียวกันได้ hash ต่างกัน (salt สุ่ม) | Salt สุ่มใหม่ทุกครั้ง ไม่มีรหัสจริงปน | ผ่าน |
| CP49 | verifyPassword: ถูก -> true · ผิด -> false | ฟังก์ชันตรวจสอบรหัสผ่านถูกต้อง | ผ่าน |
| CP49 | ตรวจ hash บัญชีเจ้าหน้าที่ใน schema.sql ได้ | รองรับบัญชีเจ้าหน้าที่เริ่มต้นในระบบ | ผ่าน |
| CP49 | ตาราง users มีคอลัมน์ role และ password_hash | โครงสร้างตารางรองรับ RBAC และ Auth | ผ่าน |
| CP48 | body ใหญ่เกิน 10kb -> 413 เป็น JSON | Express body-parser ปฏิเสธ payload ขนาดใหญ่ | ผ่าน |
| CP50 | POST /api/auth/login ถูกต้อง -> 200 พร้อม token | สร้าง JWT Token (3 ส่วน Header.Payload.Signature) | ผ่าน |
| CP50 | payload ของ token มี role=staff และ exp | ข้อมูลใน Token ครบถ้วนและไม่มี password หลุด | ผ่าน |
| CP50 | รหัสผ่านผิด กับ อีเมลที่ไม่มี -> 401 ข้อความเดียวกัน | ป้องกันการคาดเดาผู้ใช้ (Account Enumeration) | ผ่าน |
| CP50 | ผู้แจ้งทั่วไป (ไม่มีรหัสผ่าน) เข้าสู่ระบบไม่ได้ | ปฏิเสธผู้ใช้งานที่ไม่มี password_hash | ผ่าน |
| CP51 | PUT ไม่มี token -> 401 | ปฏิเสธคำขอที่ไม่มี Authorization Header | ผ่าน |
| CP51 | PUT ด้วย token ปลอม (secret อื่น) -> 401 | ปฏิเสธ Token ที่ Signature ไม่ถูกต้อง | ผ่าน |
| CP51 | PUT ด้วย token ที่ไม่ใช่เจ้าหน้าที่ -> 403 | คืน 403 Forbidden สำหรับสิทธิ์ไม่เพียงพอ | ผ่าน |
| CP51 | เจ้าหน้าที่: PUT -> 200 และ DELETE -> 204 | อนุญาตให้เจ้าหน้าที่ดำเนินการสำเร็จ | ผ่าน |
| CP51 | GET และ POST ยังไม่ต้องเข้าสู่ระบบ | ผู้ใช้งานทั่วไปยังคงส่งคำร้องและดูรายการได้ | ผ่าน |
| CP51 | ไม่ถอยหลัง · BUG #1 ของสัปดาห์ 12 ยังแก้อยู่ | ลบคำร้องแล้วเพิ่มใหม่ได้ 201 รหัสไม่ซ้ำ | ผ่าน |
| CP52 | production ไม่ตั้ง JWT_SECRET -> ระบบไม่ยอม start | Fail-fast mechanism ป้องกันการใช้ default secret | ผ่าน |
| CP52 | production: error ไม่ส่ง stack trace ให้ผู้ใช้ | ซ่อน Stack Trace เมื่อ NODE_ENV=production | ผ่าน |
| CP52 | .env.example มี JWT_SECRET ค่าว่าง และ .gitignore มี .env | มี Template ค่าลับ และไม่ commit ไฟล์ .env | ผ่าน |
| CP52 | npm test ใน api ผ่านทุกข้อ และมี test ของ 401 กับ 403 | ชุดทดสอบใน api ผ่านครบถ้วน | ผ่าน |
| CHAL | Challenge: มี security header (X-Content-Type-Options: nosniff) | ป้องกัน MIME-type Sniffing | ผ่าน |
| CHAL | Challenge: ผิดเกิน 5 ครั้ง -> 429 (จำกัดการเดารหัสผ่าน) | ป้องกัน Brute-force Login ด้วย Rate Limiting | ผ่าน |
| CHAL | Challenge: frontend แนบ Authorization: Bearer ทุกคำขอ | apiClient รองรับ Bearer Token | ผ่าน |
| CHAL | Challenge: render.yaml ให้ Render สร้าง JWT_SECRET | กำหนด generateValue ใน render.yaml | ผ่าน |

---

## 3. สรุปผลการรันชุดทดสอบ Vitest (Test Suites: 70/70 Tests Passed)

### 3.1 API Test Suites (67 passed, 0 failed)
- **`tests/unit/password.test.js` (10 passed):**
  - แฮชรหัสผ่านด้วย scrypt สำเร็จตามรูปแบบ `scrypt$salt$hash`
  - ยืนยันว่า Salt ถูกสุ่มใหม่ทุกครั้ง แม้รหัสผ่านเดียวกันจะได้ hash ต่างกัน
  - ตรวจสอบ `verifyPassword` ถูกต้องคืน true, ผิดคืน false
  - ตรวจสอบ hash ของบัญชีเจ้าหน้าที่ใน `schema.sql` ถูกต้อง
- **`tests/unit/requestValidator.test.js` (31 passed):**
  - ตรวจสอบความถูกต้องของชื่อผู้แจ้ง, ประเภทคำร้อง, สถานที่, รายละเอียด และความเร่งด่วน
  - ตรวจสอบค่าขอบเขตความยาวสูงสุด (Boundary Lengths: name <= 100, details <= 1000, location <= 100)
- **`tests/integration/auth.api.test.js` (7 passed):**
  - POST `/api/auth/login` กรณีข้อมูลถูกต้องคืน 200 พร้อม Token
  - รหัสผ่านผิดคืน 401 พร้อมข้อความทั่วไป
  - อีเมลไม่มีในระบบคืน 401 พร้อมข้อความเดียวกันเพื่อความปลอดภัย
  - การเรียก PUT/DELETE โดยไม่มี Token ตอบกลับ 401
  - การเรียก PUT ด้วย Token ที่ไม่ใช่ role staff ตอบกลับ 403
  - เจ้าหน้าที่ที่มี Token ถูกต้อง สามารถ PUT ได้ 200 และ DELETE ได้ 204
- **`tests/integration/requests.api.test.js` (19 passed):**
  - CRUD operations ของคำร้อง, การป้องกัน SQL Injection, การคืน JSON เมื่อเกิด 404
- **รวม API Tests:** 67 passed (100%)

### 3.2 Frontend Test Suites (3 passed, 0 failed)
- **`src/utils/requestSummary.test.js` (3 passed):**
  - การสรุปยอดคำร้องรวมและยอดตามสถานะ (pending, in-progress, completed)
  - การจัดการรายการว่าง (empty array)
- **รวม Frontend Tests:** 3 passed (100%)

**ยอดรวมชุดทดสอบทั้งหมดในระบบ:** 70 passed (100%)

---

## 4. มาตรการความมั่นคงปลอดภัยที่ติดตั้ง (Security Architecture)

1. **การเข้ารหัสรหัสผ่าน (Password Security):**
   - ใช้อัลกอริทึม **scrypt** ผ่านโมดูลมาตรฐาน `node:crypto`
   - กำหนดพารามิเตอร์ `N=16384, r=8, p=1, keyLen=64` พร้อมสุ่ม Salt ขนาด 16 ไบต์ในทุกๆ รหัสผ่าน
2. **การป้องกัน Denial of Service (DoS):**
   - กำหนดขนาด Payload สูงสุดของ Express JSON Parser ไว้ที่ `10kb` หากเกินจะตัดการเชื่อมต่อและตอบกลับ `413 Payload Too Large` ทันที
   - กำหนดความยาวสูงสุดของฟิลด์ String ทุกตัวใน Validator
3. **การป้องกัน Brute-Force Password Guessing:**
   - ติดตั้ง In-memory Rate Limiting สำหรับ `/api/auth/login`
   - เมื่อมีการล็อกอินผิดพลาดติดต่อกันเกิน 5 ครั้งต่อ IP ระบบจะบล็อกคำขอและตอบกลับ `429 Too Many Requests`
4. **การควบคุมการเข้าถึงตามบทบาท (RBAC & JWT):**
   - ออก JWT Token ที่มีอายุใช้งานจำกัด (`exp`) พร้อมระบุ `role`
   - ใช้ Middleware `authenticateToken` ตรวจสอบความถูกต้องของ Token ก่อนอนุญาตให้เข้าถึง Endpoint สำคัญ
   - ใช้ Middleware `requireRole('staff')` ป้องกันไม่ให้ผู้ใช้ทั่วไปเปลี่ยนแปลงสถานะหรือลบคำร้อง
5. **Fail-Fast Configuration:**
   - ในสภาพแวดล้อม Production ระบบจะตรวจสอบ `process.env.JWT_SECRET` หากไม่มีการกำหนดหรือเป็นค่าเริ่มต้นที่ไม่ปลอดภัย เซิร์ฟเวอร์จะปฏิเสธการเริ่มทำงานทันที (`process.exit(1)`)
