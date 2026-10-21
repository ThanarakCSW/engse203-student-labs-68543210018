# หลักฐานการทดสอบระบบ (Evidence) — LAB 10

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**หัวข้อ:** เชื่อม Node เข้ากับฐานข้อมูล (SQLite Integration)  
**สถานะการส่ง:** ผ่านการทดสอบครบถ้วน 31/31 รายการ (100%)

---

## สารบัญเอกสารหลักฐาน

1. [รายงานผลการทดสอบฉบับเต็ม (TEST_REPORT.md)](./TEST_REPORT.md)
   - ผลการรันสคริปต์ตรวจอัตโนมัติ `check-week10.mjs` (ผ่าน 31/31 รายการ)
   - ผลการรันชุดทดสอบ API ผ่าน `npm test` ทั้ง 8 Suites (ผ่านครบ 33/33 ข้อ)
   - ผลการป้องกัน SQL Injection และการดักจับ Database Constraints ใน Error Handler
   - ผลการทดสอบ Challenge: Transactions, Indexing และ Users Endpoints
2. [ภาพถ่ายหน้าจอหลักฐานการทำงาน (Screenshots)](./images/)
   - `images/app-from-database.png`: หน้าจอ React Dashboard แสดงข้อมูลคำร้องที่ดึงมาจากฐานข้อมูล SQLite
   - `images/checker-week07.png`: ผลการตรวจความเข้ากันได้ย้อนหลังกับระบบ Week 07
3. [ข้อกำหนดสัญญา API (API_CONTRACT.md)](../source/API_CONTRACT.md)
   - สัญญา API ฉบับสมบูรณ์ที่อัปเดต Data Model, ฐานข้อมูล และ Users Endpoints

---

## สรุปผลการประเมินหลัก (Key Evidence Summary)

- **ในห้องเรียน (CP26–CP30):** ผ่านครบ 20 / 20 รายการ
- **งานที่บ้าน (CP31–CP34):** ผ่านครบ 8 / 8 รายการ
- **Challenge พิเศษ:** ผ่านครบ 3 / 3 รายการ
- **รวมทั้งหมด:** ผ่าน 31 / 31 รายการ (100%)
