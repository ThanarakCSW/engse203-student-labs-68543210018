# หลักฐานการทดสอบระบบ (Evidence) — LAB 11

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**หัวข้อ:** Full-Stack Integration (React, Express, SQLite)  
**สถานะการส่ง:** ผ่านการทดสอบครบถ้วน 41/41 รายการ (100%)

---

## สารบัญเอกสารหลักฐาน

1. [รายงานผลการทดสอบฉบับสมบูรณ์ (TEST_REPORT.md)](./TEST_REPORT.md)
   - สรุปผลการรันสคริปต์ตรวจอัตโนมัติ `check-week11.mjs` (ผ่านครบ 41/41 รายการ)
   - ผลการรันชุดทดสอบ API ผ่าน `npm test` (ผ่านครบ 8/8 ข้อ)
   - ผลการทดสอบ Health Check (`/api/health`) และการเสิร์ฟ Static Production บนพอร์ตเดียว
2. [คู่มือสถาปัตยกรรมและการรันระบบ (README.md)](../source/README.md)
   - อธิบายสถาปัตยกรรม 3 ชั้น (Three-Tier Architecture), คำสั่งรันในโหมด Development และ Production
3. [บันทึกการวิเคราะห์ทางเลือกฐานข้อมูล (DATABASE_CHOICES.md)](../source/DATABASE_CHOICES.md)
   - การเปรียบเทียบ SQLite กับ MongoDB, การวิเคราะห์ผลกระทบเชิงสถาปัตยกรรม และหลักการใช้งาน async/await
4. [รายการการสาธิตระบบครบวงจร (DEMO.md)](../source/DEMO.md)
   - เช็คลิสต์การสาธิตการทำงานของระบบแบบครบวงจรและลิงก์วิดีโอประกอบ
5. [ข้อกำหนดสัญญา API (API_CONTRACT.md)](../source/API_CONTRACT.md)
   - รายละเอียด Endpoint ทั้งหมด, Schema, Request/Response Payload และ Error Codes

---

## สรุปผลการประเมินหลัก (Key Evidence Summary)

- **ในห้องเรียน (CP35–CP39):** ผ่านครบ 17 / 17 รายการ
- **งานที่บ้าน (CP40–CP43):** ผ่านครบ 20 / 20 รายการ
- **Challenge พิเศษ:** ผ่านครบ 4 / 4 รายการ
- **รวมทั้งหมด:** ผ่าน 41 / 41 รายการ (100%)
- **ความปลอดภัยและการป้องกันข้อมูล:** ผ่านการทดสอบป้องกัน SQL Injection และการจัดการข้อผิดพลาดระดับส่วนกลาง (Centralized Error Handler)
