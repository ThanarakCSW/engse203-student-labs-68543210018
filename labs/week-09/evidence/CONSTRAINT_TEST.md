# ผลการทดสอบ Constraint — LAB09 / CP25

วันที่ทดสอบ: 7 ตุลาคม 2026

ทดสอบบนฐานข้อมูลสำเนาที่สร้างจาก schema.sql มีข้อมูลตรงกับ campus.db เปิด `PRAGMA foreign_keys = ON` ก่อนทดสอบ โดยตรวจว่าค่า pragma เป็น 1 แต่ละกรณีใช้ SAVEPOINT และ ROLLBACK จึงไม่เหลือข้อมูลทดสอบในฐานข้อมูลที่เตรียมส่ง

## ① Foreign Key: ผู้แจ้งไม่มีจริง

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-TEST-FK', 99999, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
```

**error ที่ได้จริง**

```text
FOREIGN KEY constraint failed
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## ② CHECK: สถานะไม่อยู่ในรายการ

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details, status)
VALUES ('REQ-TEST-STATUS', 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ', 'ยกเลิก');
```

**error ที่ได้จริง**

```text
CHECK constraint failed: status IN ('pending', 'in-progress', 'completed')
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## ③ UNIQUE: อีเมลซ้ำ

**คำสั่งที่ลอง**

```sql
INSERT INTO users (name, department, email)
VALUES ('ผู้ใช้ทดสอบ', 'วิศวกรรมซอฟต์แวร์', 'somchai@rmutl.ac.th');
```

**error ที่ได้จริง**

```text
UNIQUE constraint failed: users.email
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## ④ PRIMARY KEY: รหัสคำร้องซ้ำ

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-001', 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
```

**error ที่ได้จริง**

```text
UNIQUE constraint failed: requests.id
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## ⑤ NOT NULL: ไม่ระบุ location

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, details)
VALUES ('REQ-TEST-LOCATION', 1, 'แจ้งซ่อม', 'ทดสอบระบบ');
```

**error ที่ได้จริง**

```text
NOT NULL constraint failed: requests.location
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## เพิ่มเติม: ประเภทคำร้องผิด

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES ('REQ-TEST-TYPE', 1, 'ประเภทที่ไม่มี', 'ห้องทดสอบ', 'ทดสอบระบบ');
```

**error ที่ได้จริง**

```text
CHECK constraint failed: request_type IN ('แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ')
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## เพิ่มเติม: ความเร่งด่วนผิด

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details, priority)
VALUES ('REQ-TEST-PRIORITY', 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ', 'high');
```

**error ที่ได้จริง**

```text
CHECK constraint failed: priority IN ('normal', 'urgent')
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## เพิ่มเติม: รหัสคำร้องเป็น NULL

**คำสั่งที่ลอง**

```sql
INSERT INTO requests (id, requester_id, request_type, location, details)
VALUES (NULL, 1, 'แจ้งซ่อม', 'ห้องทดสอบ', 'ทดสอบระบบ');
```

**error ที่ได้จริง**

```text
NOT NULL constraint failed: requests.id
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## CP20: แก้สถานะเป็นค่าที่ไม่รองรับ

**คำสั่งที่ลอง**

```sql
UPDATE requests SET status = 'ยกเลิก' WHERE id = 'REQ-001';
```

**error ที่ได้จริง**

```text
CHECK constraint failed: status IN ('pending', 'in-progress', 'completed')
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## CP20: ลบผู้ใช้ที่ยังมีคำร้อง

**คำสั่งที่ลอง**

```sql
DELETE FROM users WHERE id = 1;
```

**error ที่ได้จริง**

```text
FOREIGN KEY constraint failed
```

ผล: ผ่าน — ถูกปฏิเสธ และข้อมูลก่อน/หลังทดสอบเหมือนเดิม

## สรุป

การทดสอบหลัก CP25 ผ่าน 5/5 แบบ การตรวจเพิ่มเติมผ่าน 5/5 แบบ ทั้งหมดถูกปฏิเสธจริง

## CP20: CRUD และ DEFAULT

- INSERT REQ-PRACTICE-CRUD โดยไม่ส่ง priority, status และ created_at สำเร็จ
- DEFAULT ที่อ่านได้: priority = `normal`, status = `pending`, created_at = `2026-10-07 14:45:30`
- UPDATE พร้อม WHERE เปลี่ยนสถานะเป็น in-progress ได้ 1 แถว
- DELETE พร้อม WHERE ลบได้ 1 แถว และ COUNT ของรหัสนั้นเป็น 0
- ROLLBACK แล้วข้อมูลกลับตรงกับก่อนทดลอง ไม่มีรหัสทดสอบหลงเหลือ
