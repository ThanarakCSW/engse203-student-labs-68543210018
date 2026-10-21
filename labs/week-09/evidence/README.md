# หลักฐานการทดสอบระบบ (Evidence) — LAB 09

**ชื่อ–นามสกุล:** ธนรัก ชุ่มสวัสดิ์  
**รหัสนักศึกษา:** 68543210018-6  
**กลุ่มเรียน:** SEC2  
**วิชา:** ENGSE203 การพัฒนาเว็บแอปพลิเคชัน (Web Application Development)  
**หัวข้อ:** SQL และฐานข้อมูลเชิงสัมพันธ์ (Database Design & Relational Modeling)  
**สถานะการส่ง:** ผ่านการทดสอบครบถ้วน 30/30 รายการ (100%)

---

## สารบัญเอกสารหลักฐาน

1. [รายงานผลการทดสอบเงื่อนไขข้อจำกัดของฐานข้อมูล (CONSTRAINT_TEST.md)](./CONSTRAINT_TEST.md)
   - ผลการทดสอบ Primary Key ห้ามซ้ำ
   - ผลการทดสอบ Foreign Key (การปฏิเสธ requester_id ที่ไม่มีอยู่จริง)
   - ผลการทดสอบเงื่อนไข NOT NULL และ CHECK Constraints
   - ผลการทดสอบ Cascade Delete / Action เมื่อลบข้อมูลผู้ใช้งาน
2. [ภาพถ่ายหน้าจอหลักฐานการทำงาน (Screenshots)](./images/)
   - ภาพผลลัพธ์การรันคำสั่ง SQL Query ผ่าน SQLite CLI หรือเครื่องมือจัดการฐานข้อมูล
   - ผลลัพธ์การ JOIN ข้ามตาราง และการสรุปผลด้วย GROUP BY
3. [เอกสารการออกแบบโครงสร้างข้อมูล (DATA_MODEL.md)](../source/DATA_MODEL.md)
   - Entity-Relationship Diagram (ERD), Data Dictionary และเหตุผลในการแยกตาราง users ออกจาก requests
4. [สคริปต์คำสั่ง SQL สำคัญ](../source/)
   - `schema.sql`: สคริปต์สร้างตาราง กำหนด Constraints และข้อมูลตั้งต้น
   - `queries.sql`: ชุดคำสั่ง SELECT, JOIN, WHERE, ORDER BY, GROUP BY และ Aggregate Functions (COUNT, SUM, AVG)

---

## สรุปผลการประเมินหลัก (Key Evidence Summary)

- **ในห้องเรียน (CP17–CP21):** ผ่านครบ 11 / 11 รายการ
- **งานที่บ้าน (CP22–CP25):** ผ่านครบ 16 / 16 รายการ
- **Challenge พิเศษ:** ผ่านครบ 3 / 3 รายการ (GROUP BY, Aggregate Functions, Database Indexing)
- **รวมทั้งหมด:** ผ่าน 30 / 30 รายการ (100%)
