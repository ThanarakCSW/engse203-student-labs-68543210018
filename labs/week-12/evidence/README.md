# หลักฐานการทดสอบและแก้ไขข้อผิดพลาด (Evidence) — LAB 12

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**หัวข้อ:** Testing and Debugging (Vitest, Integration Tests, Bug Fixes)  
**สถานะการส่ง:** ผ่านการทดสอบครบถ้วน 22/22 รายการ (100%)

---

## ลิงก์วิดีโอสาธิตการทำงานและการทดสอบ
- **วิดีโอสาธิตระบบและการทดสอบ (YouTube):** [https://youtu.be/JMumnHN0OHw](https://youtu.be/JMumnHN0OHw)

---

## สารบัญเอกสารหลักฐาน

1. [รายงานผลการทดสอบฉบับเต็ม (TEST_REPORT.md)](./TEST_REPORT.md)
   - สรุปผลการรันสคริปต์ตรวจอัตโนมัติ `check-week12.mjs` (22/22 รายการ)
   - สรุปผลการรันชุดทดสอบ Vitest ทั้งหมด 45 ข้อ (API 42 ข้อ + Frontend 3 ข้อ)
   - รายงาน Code Coverage ของ Statements 86.8% (เกณฑ์ Challenge >= 85%)
2. [ตารางกรณีทดสอบและการวิเคราะห์ค่าขอบเขต (TEST_CASES.md)](../source/TEST_CASES.md)
   - ตารางกรณีทดสอบ TC-01 ถึง TC-08 พร้อมการวิเคราะห์ Equivalence Partitioning และ Boundary Value Analysis
3. [บันทึกการวิเคราะห์สาเหตุและวิธีแก้บั๊ก (DEBUG_LOG.md)](../source/DEBUG_LOG.md)
   - รายละเอียดการสืบหาสาเหตุและแนวทางการแก้ปัญหาของ BUG #0, BUG #1, BUG #2 และ BUG #3
4. [รายงานปัญหาตั้งต้นจากผู้ใช้งาน (BUG_REPORTS.md)](../source/BUG_REPORTS.md)
   - อาการและขั้นตอนการทำให้เกิดซ้ำ (Reproduction steps) ที่ได้รับรายงานจากผู้ใช้งานจริง

---

## สรุปผลการตรวจสอบหลัก (Key Evidence Summary)

### 1. ผลการตรวจเช็คอัตโนมัติ (check-week12.mjs)
- **ในห้องเรียน (CP44–CP47):** ผ่านครบ 20 / 20 รายการ
- **Challenge พิเศษ:** ผ่านครบ 2 / 2 รายการ
- **รวมทั้งหมด:** ผ่าน 22 / 22 รายการ (100%)

### 2. ผลการรันชุดทดสอบ (Vitest)
- **API Unit Tests (`tests/unit`):** ผ่าน 23 / 23 ข้อ
- **API Integration Tests (`tests/integration`):** ผ่าน 19 / 19 ข้อ
- **Frontend Unit Tests (`frontend/src/utils`):** ผ่าน 3 / 3 ข้อ
- **รวมทั้งหมด:** ผ่าน 45 / 45 ข้อ (100%)

### 3. ผลการวัดความครอบคลุมของโค้ด (Coverage)
- **Statements Coverage:** 86.80% (เกณฑ์ Challenge กำหนด >= 85.00%)
- **Branches Coverage:** 84.37%
- **Functions Coverage:** 100.00%
- **Lines Coverage:** 86.80%

### 4. Continuous Integration (CI Workflow)
- มีไฟล์ Workflow ที่ `source/.github/workflows/check.yml` รองรับการรัน `npm test` อัตโนมัติทุกครั้งที่มีการ push หรือ pull request
