# AI_USAGE — LAB 10

บันทึกการใช้ AI ระหว่างทำงาน · **ใช้ AI ได้ แต่ต้องเป็นเจ้าของโค้ดที่ส่ง**

> ผู้สอนจะสุ่มถามจากโค้ดที่ส่ง — ถ้าอธิบายไม่ได้ คะแนนส่วนนั้นจะถูกทบทวน

---

## ครั้งที่ 1

**ถามอะไร**  
“ทำไมรันคำสั่ง node check-week10.mjs แล้วฟ้องว่า no such table: requests ทั้งๆ ที่มีไฟล์ campus.db อยู่ใน data”

**AI ตอบว่าอย่างไร (สรุปสั้น)**  
อธิบายว่าเกิดจากปัญหากับดัก path สัมพัทธ์ (Relative Path Trap) เมื่อรันคำสั่งจากคนละ working directory ทำให้ SQLite มองหาไฟล์คนละที่ แนะนำให้ใช้ `fileURLToPath(import.meta.url)` ร่วมกับ `path.dirname` และ `path.resolve` เพื่ออ้างอิงตำแหน่งไฟล์ฐานข้อมูลจากตำแหน่งของโมดูล service แทน

**ใช้ส่วนไหน / แก้เองตรงไหน**  
นำแนวคิดการทำ absolute path ด้วย `fileURLToPath(import.meta.url)` มาประกาศตัวแปร `DB_FILE` และ `SCHEMA_FILE` ใน `requestService.js` ด้วยตนเอง พร้อมทั้งเขียนคำสั่งเปิด `PRAGMA foreign_keys = ON;` ทุกครั้งที่เชื่อมต่อฐานข้อมูล

**เข้าใจโค้ดที่ได้มาไหม** [x] เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2

**ถามอะไร**  
“ตาราง requests ในฐานข้อมูลเก็บ requester_id แต่หน้า frontend และ contract ต้องการ requesterName ต้องเขียน query แบบไหนไม่ให้กระทบ controller เดิม”

**AI ตอบว่าอย่างไร (สรุปสั้น)**  
แนะนำให้ใช้ `JOIN users u ON u.id = r.requester_id` ใน SQL statement และใช้ `AS` เพื่อ alias ชื่อฟิลด์ เช่น `u.name AS requesterName` และ `r.request_type AS requestType` ทำให้ผลลัพธ์ที่ได้จาก `.all()` มีโครงสร้างตรงกับที่ controller และ frontend คาดหวังทันทีโดยไม่ต้องแก้โค้ดฝั่งอื่น

**ใช้ส่วนไหน / แก้เองตรงไหน**  
เขียนคำสั่ง `SELECT_SHAPE` ร่วมกับการ `JOIN` และ `AS` ใน `requestService.js` รวมถึงเขียนฟังก์ชัน `findAll()` และ `findById()` ด้วยตนเอง โดยใช้ parameterized query `?` เพื่อป้องกัน SQL Injection

**เข้าใจโค้ดที่ได้มาไหม** [x] เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 3

**ถามอะไร**  
“เวลาใส่ข้อมูลผิด constraint เช่น CHECK หรือ FOREIGN KEY ใน SQLite มัน throw error ออกมาทำให้เซิร์ฟเวอร์ตอบ 500 จะดัก error ให้กลายเป็น HTTP 400 ได้ยังไง”

**AI ตอบว่าอย่างไร (สรุปสั้น)**  
แนะนำให้ใช้บล็อก `try...catch` ครอบการ execute query แล้วตรวจดูข้อความใน `err.message` (เช่น มีคำว่า `CHECK constraint failed` หรือ `FOREIGN KEY constraint failed`) จากนั้นแปลงให้เป็น `AppError` พร้อมกำหนด status code 400 หรือ 409 เพื่อส่งต่อไปยัง `errorHandler` รวมศูนย์

**ใช้ส่วนไหน / แก้เองตรงไหน**  
สร้างฟังก์ชัน `toAppError(err)` ใน `requestService.js` เพื่อตรวจสอบและแปลง error ของ SQLite ให้ส่ง status code ที่เหมาะสม (400 สำหรับ CHECK/FK/NOT NULL และ 409 สำหรับ UNIQUE) พร้อมเขียนชุดทดสอบตรวจสอบใน `tests/api.test.js` ด้วยตนเอง

**เข้าใจโค้ดที่ได้มาไหม** [x] เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## สรุป

- **ส่วนที่เขียนเองทั้งหมด:**
  - แก้ไขฟังก์ชันใน `requestService.js` ทั้งหมด (`findAll`, `findById`, `create`, `updateStatus`, `remove`) ให้เปลี่ยนจากไฟล์ JSON มาเชื่อมต่อและจัดการ SQLite (`node:sqlite`) อย่างสมบูรณ์
  - กำหนดให้ทุก query ใช้ Parameterized Query (`?`) เพื่อป้องกัน SQL Injection
  - พัฒนาส่วน Challenge: สร้าง endpoint ของ `users` (`GET /api/users`, `GET /api/users/:id/requests`), การใช้ Transaction (`BEGIN IMMEDIATE`/`COMMIT`/`ROLLBACK`) และการสร้าง Index
- **ส่วนที่ AI ช่วย:**
  - ให้คำแนะนำเรื่องการคำนวณ Path สำหรับ SQLite ด้วย `fileURLToPath`
  - ให้แนวทางคำสั่ง SQL JOIN / AS เพื่อจับคู่ชื่อคอลัมน์ให้ตรง API Contract
  - แนะนำแนวคิดการดักจับข้อความจาก SQLite constraint error เพื่อ map เป็น `AppError`
- **ส่วนที่ยังไม่มั่นใจ:**
  - ไม่มีส่วนที่ไม่มั่นใจ สามารถอธิบายการทำงานของ query, การแปลง id เป็นชื่อ, constraint handling และ transaction ได้อย่างครบถ้วน
