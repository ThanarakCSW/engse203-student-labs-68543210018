# หลักฐานการทดสอบระบบ (Evidence) — LAB 07

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**หัวข้อ:** REST API Integration and Validation  
**สถานะการส่ง:** ผ่านการทดสอบครบถ้วน 36/36 รายการ (100%)

---

## สารบัญเอกสารหลักฐาน

1. [รายงานผลการทดสอบ API และ CORS ฉบับเต็ม (API_TEST.md)](./API_TEST.md)
   - ผลการทดสอบ HTTP Endpoints ด้วย Supertest และการยิงจริง (11/11 รายการ)
   - ผลการทดสอบ CORS และการเชื่อมต่อระหว่าง React (5173) กับ Express API (3001)
   - ผลการทดสอบการเปลี่ยนสถานะคำร้องผ่านหน้าเว็บ (CP13)
   - ผลการตรวจสอบ Logging (Morgan) และ Error Handling ตาม NODE_ENV (CP14)
   - ผลการทดสอบ Automated Unit & Integration Tests 8 เคส (CP16)
   - ผลการทดสอบ Challenge: AppError, asyncHandler และการซ่อน stack trace ใน production
2. [ภาพถ่ายหน้าจอหลักฐานการทำงาน (Screenshots)](./images/)
   - `images/app-with-api.png`: หน้าจอ React Dashboard ดึงข้อมูลคำร้องจาก Express API สำเร็จ
   - `images/network-cors-ok.png`: แผง Network ใน DevTools ยืนยัน Header `Access-Control-Allow-Origin`
   - `images/error-state.png`: หน้าจอแสดง Error State และปุ่มลองใหม่เมื่อ API ไม่พร้อมใช้งาน
3. [ข้อกำหนดสัญญา API (API_CONTRACT.md)](../source/API_CONTRACT.md)
   - รายละเอียด Method, Path, Schema, Status Codes และตัวอย่าง Payload

---

## สรุปผลการประเมินหลัก (Key Evidence Summary)

- **ในห้องเรียน (CP09–CP12):** ผ่านครบ 25 / 25 รายการ
- **งานที่บ้าน (CP13–CP16):** ผ่านครบ 8 / 8 รายการ
- **Challenge พิเศษ:** ผ่านครบ 3 / 3 รายการ
- **รวมทั้งหมด:** ผ่าน 36 / 36 รายการ (100%)
