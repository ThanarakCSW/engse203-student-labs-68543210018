# TEST_REPORT — LAB 12: Testing and Debugging

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**วันที่ทดสอบ:** 2026-10-21 (Asia/Bangkok)  
**สถานะการทดสอบ:** ผ่านครบถ้วน 100% (22/22 รายการ)

---

## 1. ภาพรวมการทดสอบ (Executive Summary)

การทดสอบในสัปดาห์ที่ 12 ครอบคลุมการตั้งค่าระบบทดสอบอัตโนมัติด้วย Vitest, การออกแบบกรณีทดสอบ (Boundary Value Analysis & Equivalence Partitioning), การเขียน Unit Test, การเขียน Integration Test ที่ทำงานร่วมกับฐานข้อมูล SQLite ในหน่วยความจำ (`:memory:`), การตรวจสอบ Code Coverage ให้ได้ตามเกณฑ์ Challenge (>= 85%), การวิเคราะห์และแก้ไขข้อผิดพลาด (Bug Fixes) จำนวน 4 จุด พร้อมเขียน Regression Tests กำกับ และการสร้าง Continuous Integration (CI) Workflow ผ่าน GitHub Actions

| ส่วนการประเมิน | จำนวนรายการ | ผลการทดสอบ | สถานะ |
|---|---|---|---|
| ในห้องเรียน (CP44–CP47) | 20 รายการ | ผ่าน 20 / 20 | ผ่านสมบูรณ์ |
| Challenge พิเศษ | 2 รายการ | ผ่าน 2 / 2 | ผ่านสมบูรณ์ |
| **รวมการทดสอบทั้งหมด** | **22 รายการ** | **ผ่าน 22 / 22** | **ผ่านสมบูรณ์ 100%** |

---

## 2. ผลการรันสคริปต์ตรวจอัตโนมัติ (Automated Checker: check-week12.mjs)

ผลจากการรันสคริปต์ตรวจสอบ `node check-week12.mjs` แสดงผลดังนี้:

| เกณฑ์ | รายการตรวจ | ผลการตรวจ | สถานะ |
|---|---|---|---|
| CP44 | api ใช้ Vitest (script test = vitest) | ตรวจพบ script test ใน package.json | ผ่าน |
| CP44 | test ใช้ฐานข้อมูลแยก (DB_FILE :memory: ใน vitest.config.js) | ตั้งค่าฐานข้อมูลแยกในหน่วยความจำถูกต้อง | ผ่าน |
| CP44 | TEST_CASES.md มีกรณีทดสอบอย่างน้อย 8 ข้อ | พบกรณีทดสอบ 8 ข้อในตาราง | ผ่าน |
| CP44 | มีกรณีค่าขอบ (boundary) ในตาราง | ระบุกรณีค่าขอบเขตความยาวและข้อมูลครบถ้วน | ผ่าน |
| CP45 | มี unit test อย่างน้อย 10 ข้อ (tests/unit) | พบ Unit Test ทั้งหมด 23 ข้อ | ผ่าน |
| CP45 | BUG #0: รายละเอียด 10 ตัวอักษรพอดี -> ผ่าน | ผ่านเกณฑ์ค่าขอบพอดี | ผ่าน |
| CP45 | รายละเอียด 9 ตัวอักษร -> ยังถูกปฏิเสธ (ไม่แก้เกิน) | ตรวจสอบเงื่อนไข length < 10 ถูกต้อง | ผ่าน |
| CP46 | มี integration test อย่างน้อย 12 ข้อ (tests/integration) | พบ Integration Test ทั้งหมด 19 ข้อ | ผ่าน |
| CP46 | integration test ครอบคลุม PUT และ DELETE | มีการทดสอบทั้ง PUT และ DELETE ครบถ้วน | ผ่าน |
| CP46 | ตั้งค่า coverage แล้ว (script coverage + @vitest/coverage-v8) | กำหนดใน package.json เรียบร้อย | ผ่าน |
| CP46 | npm test ใน api ผ่านทุกข้อ | ผ่านครบ 42/42 ข้อ ไม่มีข้อผิดพลาด | ผ่าน |
| CP47 | BUG #1: ลบรายการกลางแล้วเพิ่มใหม่ -> 201 | คืนสถานะ 201 และรหัสไม่ซ้ำ | ผ่าน |
| CP47 | BUG #3: เปลี่ยนสถานะคำร้องที่ไม่มี -> 404 (ไม่ใช่ 500) | คืน 404 Not Found ตามสัญญา API | ผ่าน |
| CP47 | ไม่ถอยหลัง: /api/health ยังตอบ 200 และต่อฐานข้อมูลได้ | ตอบ 200 พร้อม database.connected: true | ผ่าน |
| CP47 | BUG #2: Dashboard นับ "กำลังดำเนินการ" ถูก | ฟังก์ชันนับได้ 2 รายการถูกต้อง | ผ่าน |
| CP47 | frontend มี test และผ่านทุกข้อ | Vitest ฝั่ง frontend ผ่าน 3/3 ข้อ | ผ่าน |
| CP47 | regression test BUG #1 (ลบแล้วเพิ่มใหม่) | มี test ยืนยันการไม่ชนของ ID | ผ่าน |
| CP47 | regression test BUG #2 (นับ in-progress) | มี test ตรวจสถานะ in-progress | ผ่าน |
| CP47 | regression test BUG #3 (PUT คำร้องที่ไม่มี -> 404) | มี test ยืนยัน 404 บน REQ-999 | ผ่าน |
| CP47 | DEBUG_LOG.md ระบุสาเหตุครบ 4 bug | บันทึกสาเหตุและวิธีแก้ครบทั้ง 4 ข้อ | ผ่าน |
| CHAL | Challenge: coverage ของ api >= 85% (statements) | ได้ Statements Coverage 86.8% | ผ่าน |
| CHAL | Challenge: CI รัน npm test ทุกครั้งที่ push | พบ Workflow ใน .github/workflows/ | ผ่าน |

---

## 3. สรุปผลการรันชุดทดสอบ Vitest (Test Suites)

### 3.1 API Test Suites (`labs/week-12/source/api`)
- **Unit Tests (`api/tests/unit/requestValidator.test.js`):** 23 passed
  - ตรวจสอบชื่อผู้ร้องขอ (requesterName): การเว้นว่าง, ความยาวขั้นต่ำ 2 ตัวอักษร
  - ตรวจสอบประเภทคำร้อง (requestType): ตรงตามรายการที่กำหนด (แจ้งซ่อม, ร้องเรียน, เสนอแนะ, อื่นๆ)
  - ตรวจสอบสถานที่ (location): ค่าว่าง, ความยาว
  - ตรวจสอบรายละเอียด (details): กรณีขอบเขต 10 ตัวอักษรพอดี (ผ่าน), 9 ตัวอักษร (ปฏิเสธ), ค่าว่าง
  - ตรวจสอบระดับความเร่งด่วน (priority): low, normal, urgent
- **Integration Tests (`api/tests/integration/requests.api.test.js`):** 19 passed
  - GET `/api/requests`: คืนรายการคำร้องครบถ้วน, ตรวจสอบ mapping requesterName แทน requester_id, การกรองตามสถานะ (`?status=`), ป้องกัน SQL Injection
  - GET `/api/requests/:id`: กรณีพบคำร้อง (200 OK), กรณีไม่พบคำร้อง (404 Not Found)
  - POST `/api/requests`: ข้อมูลครบถ้วน (201 Created พร้อมรหัส REQ-XXX ถัดไป), ข้อมูลไม่ครบ (400 Bad Request พร้อมรายการ error), การลบรายการกลางแล้วสร้างใหม่ไม่เกิด ID ชน (BUG #1 Regression Test)
  - PUT `/api/requests/:id`: เปลี่ยนสถานะสำเร็จ (200 OK), สถานะนอกเหนือที่กำหนด (400 Bad Request), อัปเดตคำร้องที่ไม่มีอยู่ (404 Not Found - BUG #3 Regression Test)
  - DELETE `/api/requests/:id`: ลบคำร้องสำเร็จ (204 No Content แล้ว GET ซ้ำได้ 404), ลบคำร้องที่ไม่มีอยู่ (404 Not Found)
  - Health & Users: `/api/health` รายงานสถานะการต่อฐานข้อมูล (200 OK), `/api/users` ใช้งานฐานข้อมูลชุดเดียวกับ service, `/api/users/:id/requests` คืนคำร้องตามผู้ใช้
  - Error Handling: เส้นทางที่ไม่มีอยู่ตอบ 404 เป็น JSON, การส่ง payload JSON เสียหายตอบ 400 ไม่เกิด unhandled 500
- **รวม API Tests:** 42 passed, 0 failed (100%)

### 3.2 Frontend Test Suites (`labs/week-12/source/frontend`)
- **Unit Tests (`frontend/src/utils/requestSummary.test.js`):** 3 passed
  - นับคำร้องรวมและคำร้องแต่ละสถานะ (pending, in-progress, completed) ได้ถูกต้อง
  - การนับสถานะ in-progress เมื่อมีหลายรายการในระบบ (BUG #2 Regression Test)
  - การจัดการกรณีรายการว่าง (empty array) คืนค่าผลรวม 0 ทุกสถานะอย่างถูกต้อง
- **รวม Frontend Tests:** 3 passed, 0 failed (100%)

**ยอดรวมชุดทดสอบทั้งหมดในระบบ:** 45 passed (100%)

---

## 4. รายงาน Code Coverage (Challenge)

การรันคำสั่ง `npm run coverage` ใน `labs/week-12/source/api` วัดผลการทำงานครอบคลุมของโค้ด (Statement Coverage) ได้ผลลัพธ์ดังนี้:

| File | % Statements | % Branch | % Functions | % Lines | เกณฑ์กำหนด | ผลประเมิน |
|---|---|---|---|---|---|---|
| `src/controllers/requestController.js` | 85.71% | 81.25% | 100% | 85.71% | >= 85% | ผ่าน |
| `src/services/requestService.js` | 88.88% | 75.00% | 100% | 88.88% | >= 85% | ผ่าน |
| `src/validators/requestValidator.js` | 100.00% | 100.00% | 100% | 100.00% | >= 85% | ผ่าน |
| **All Files (API Source)** | **86.80%** | **84.37%** | **100%** | **86.80%** | **>= 85.00%** | **ผ่าน (Challenge)** |

---

## 5. สรุปการวิเคราะห์และแก้ไขข้อผิดพลาด (Bug Analysis & Fixes)

รายละเอียดฉบับเต็มบันทึกไว้ใน `labs/week-12/source/DEBUG_LOG.md`:

### BUG #0: ข้อความรายละเอียด 10 ตัวอักษรพอดีถูกระบบปฏิเสธ
- **อาการ:** ผู้ใช้กรอกรายละเอียด 10 ตัวอักษรพอดีแต่ระบบฟ้องว่าสั้นเกินไป
- **สาเหตุ:** ใน `requestValidator.js` ใช้เงื่อนไข `details.length <= 10` ซึ่งปฏิเสธข้อความที่มีความยาว 10 ตัวอักษรพอดี
- **การแก้ไข:** ปรับแก้เงื่อนไขเป็น `details.length < 10` เพื่อยอมรับความยาวตั้งแต่ 10 ตัวอักษรขึ้นไป
- **Regression Test:** ทดสอบความยาว 10 ตัวอักษร (ผ่าน) และความยาว 9 ตัวอักษร (ปฏิเสธ)

### BUG #1: ลบรายการกลางแล้วเพิ่มรายการใหม่ ส่งผลให้รหัสคำร้องซ้ำ (ID Collision)
- **อาการ:** เมื่อลบ REQ-002 ออก แล้วสร้างคำร้องใหม่ ระบบสร้างรหัสเป็น REQ-003 ซึ่งไปซ้ำกับรายการเดิมที่มีอยู่แล้ว ทำให้เกิด Error รหัสซ้ำ
- **สาเหตุ:** ใน `requestService.js` คำนวณรหัสถัดไปจาก `requests.length + 1` ซึ่งใช้ไม่ได้เมื่อมีรายการถูกลบออกไป
- **การแก้ไข:** ปรับเปลี่ยนมาใช้การสืบค้นค่ารหัสสูงสุดจากฐานข้อมูลด้วย SQL `SELECT id FROM requests ORDER BY id DESC LIMIT 1` แล้วนำตัวเลขลำดับมาบวก 1
- **Regression Test:** สร้าง test ทำการลบ REQ-002 แล้วสร้างใหม่ ยืนยันว่าได้สถานะ 201 และได้รหัสใหม่ที่ไม่ซ้ำ

### BUG #2: แดชบอร์ดนับจำนวนคำร้อง "กำลังดำเนินการ" เป็น 0 เสมอ
- **อาการ:** บนหน้าเว็บมีคำร้องสถานะ in-progress แต่ตัวเลขสรุปบน Dashboard ไม่เพิ่มขึ้น
- **สาเหตุ:** ฟังก์ชัน `summarizeRequests` ใน `frontend/src/utils/requestSummary.js` นำค่า `status === 'in_progress'` มานับ แต่สถานะจริงในฐานข้อมูลและ API คือ `'in-progress'` (เครื่องหมายขีดกลาง)
- **การแก้ไข:** แก้ไขเงื่อนไขการเปรียบเทียบในฟังก์ชันให้ตรงกับ `'in-progress'`
- **Regression Test:** เขียน unit test ใน `requestSummary.test.js` ส่งข้อมูลจำลองที่มี `in-progress` 2 รายการ และยืนยันผลลัพธ์เป็น 2

### BUG #3: อัปเดตสถานะคำร้องที่ไม่มีอยู่ส่งกลับ 500 Internal Server Error
- **อาการ:** เมื่อยิง `PUT /api/requests/REQ-999` ระบบตอบกลับ 500 แทนที่จะเป็น 404
- **สาเหตุ:** ใน `requestController.js` มีการเรียกใช้งาน property ของคำร้องก่อนการตรวจสอบว่าคำร้องมีอยู่จริงหรือไม่ ทำให้เกิด uncaught TypeError
- **การแก้ไข:** เพิ่มการตรวจสอบ null check ก่อนดำเนินการ: `if (!existing) { return res.status(404).json({ error: 'ไม่พบคำร้องที่ระบุ' }); }`
- **Regression Test:** เขียน integration test ยิง PUT ไปยัง `REQ-999` และตรวจสอบว่าต้องได้รับ 404 Not Found เสมอ

---

## 6. กรณีทดสอบและการวิเคราะห์ค่าขอบเขต (Test Cases & Boundary Analysis)

รายละเอียดฉบับเต็มบันทึกไว้ใน `labs/week-12/source/TEST_CASES.md`:

| รหัสทดสอบ | โมดูล/ฟังก์ชัน | เงื่อนไขการทดสอบ | ประเภทค่า | ค่าที่ส่ง | ผลลัพธ์ที่คาดหวัง | ผลจริง |
|---|---|---|---|---|---|---|
| TC-01 | requestValidator | ข้อมูลครบถ้วนถูกต้อง | Normal | ข้อมูลครบ รายละเอียด > 10 | errors = [] | ผ่าน |
| TC-02 | requestValidator | ชื่อผู้ร้องขอเป็นค่าว่าง | Boundary | requesterName: "" | มี error ของ requesterName | ผ่าน |
| TC-03 | requestValidator | รายละเอียด 10 ตัวพอดี | Boundary (BUG #0) | details: "1234567890" | errors = [] (ผ่าน) | ผ่าน |
| TC-04 | requestValidator | รายละเอียด 9 ตัว | Boundary | details: "123456789" | มี error เรื่องความยาว | ผ่าน |
| TC-05 | requestService | ค้นหาคำร้องที่ไม่มีอยู่ | Boundary | id: "REQ-999" | คืน null / 404 | ผ่าน |
| TC-06 | requestService | ลบรายการกลางแล้วสร้างใหม่ | Functional (BUG #1) | ลบ REQ-002 แล้วสร้าง | รหัสไม่ซ้ำ คืน 201 | ผ่าน |
| TC-07 | requestService | เปลี่ยนสถานะที่ถูกต้อง | Normal | status: "completed" | อัปเดตสำเร็จ คืน 200 | ผ่าน |
| TC-08 | requestController | เปลี่ยนสถานะคำร้องไม่มีอยู่ | Negative (BUG #3) | PUT REQ-999 | คืน 404 Not Found | ผ่าน |

---

## 7. การตั้งค่าระบบ CI (Continuous Integration)

- **ไฟล์คอนฟิก:** `labs/week-12/source/.github/workflows/check.yml`
- **เงื่อนไขการทำงาน:** ทำงานอัตโนมัติเมื่อเกิด Event `push` หรือ `pull_request` เข้าสู่ repository
- **ขั้นตอนการทำงาน:**
  1. Checkout repository code
  2. Setup Node.js environment (v22 / v25)
  3. ติดตั้ง dependencies ทั้งในโฟลเดอร์ `api` และ `frontend`
  4. รัน `npm test` สำหรับ API และ Frontend
  5. ตรวจสอบสถานะการทำงานว่าทุก test suite ผ่าน 100% จึงอนุญาตให้ Merge
