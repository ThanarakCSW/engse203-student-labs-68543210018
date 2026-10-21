# หลักฐานการทดสอบระบบ (Evidence) — LAB 13

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**หัวข้อ:** Authentication, Authorization & Security Hardening  
**สถานะการส่ง:** ผ่านการทดสอบครบถ้วน 27/27 รายการ (100%)

---

## สารบัญเอกสารหลักฐาน

1. [รายงานผลการทดสอบฉบับเต็ม (TEST_REPORT.md)](./TEST_REPORT.md)
   - ผลการรันสคริปต์ตรวจอัตโนมัติ `check-week13.mjs` (ผ่าน 27/27 รายการ)
   - ผลการรันชุดทดสอบ Vitest ทั้งหมด 70 ข้อ (API 67 ข้อ + Frontend 3 ข้อ ผ่าน 100%)
   - รายละเอียดมาตรการความมั่นคงปลอดภัย: scrypt Password Hashing, JWT Login, RBAC (401/403), DoS Body Limitation (413), Rate Limiting (429) และ Fail-fast Secret
2. [คู่มือสถาปัตยกรรมความปลอดภัยและการรันระบบ (README.md)](../source/README.md)
   - คำอธิบายแนวคิดเรื่อง Authentication, RBAC, สถาปัตยกรรมระบบ และคำแนะนำการรัน
3. [เอกสารการออกแบบและผลการทดสอบ (TEST_CASES.md)](../source/TEST_CASES.md)
   - กรณีทดสอบด้านความปลอดภัยและการตรวจสอบค่าขอบเขตความยาว
4. [ข้อกำหนดสัญญา API (API_CONTRACT.md)](../source/API_CONTRACT.md)
   - ข้อมูล Endpoint `/api/auth/login`, ข้อกำหนด Header Authorization Bearer Token และ Error Statuses

---

## สรุปผลการประเมินหลัก (Key Evidence Summary)

- **ในห้องเรียน (CP48–CP52):** ผ่านครบ 23 / 23 รายการ
- **Challenge พิเศษ:** ผ่านครบ 4 / 4 รายการ (Security Headers, Rate Limiting 429, Bearer Token Support, Render JWT Secret Auto-generation)
- **รวมทั้งหมด:** ผ่าน 27 / 27 รายการ (100%)
