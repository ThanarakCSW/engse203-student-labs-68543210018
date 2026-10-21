-- LAB09 / CP22 — รันกับ campus.db

-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT id, requester_id, request_type, location, details, priority, status, created_at
FROM requests
ORDER BY id ASC;

-- ② คำร้องที่ยังไม่ได้ดำเนินการ
SELECT id, location, details, priority, status
FROM requests
WHERE status = 'pending'
ORDER BY id ASC;

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ ต้องตรงทั้งสองเงื่อนไข
SELECT id, location, details, priority, status
FROM requests
WHERE priority = 'urgent' AND status <> 'completed'
ORDER BY id ASC;

-- ④ ค้นรายละเอียดที่มีคำว่า "ไม่ทำงาน" อยู่ส่วนใดก็ได้
SELECT id, location, details
FROM requests
WHERE details LIKE '%ไม่ทำงาน%'
ORDER BY id ASC;

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง ตั้งชื่อคอลัมน์ให้ใช้กับ API ใน Week 07 ได้
SELECT r.id,
       u.name AS requesterName,
       r.request_type AS requestType,
       r.location,
       r.details,
       r.priority,
       r.status
FROM requests AS r
JOIN users AS u ON u.id = r.requester_id
ORDER BY r.id ASC;

-- ⑥ คำร้องเฉพาะภาควิชาวิศวกรรมซอฟต์แวร์
SELECT r.id, u.name AS requesterName, u.department, r.details, r.status
FROM requests AS r
JOIN users AS u ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id ASC;

-- ⑦ ผู้ที่เคยแจ้งคำร้อง แสดงคนละหนึ่งแถว ใช้ id แยกคนที่ชื่อเหมือนกัน
SELECT DISTINCT u.id, u.name AS requesterName, u.department
FROM requests AS r
JOIN users AS u ON u.id = r.requester_id
ORDER BY u.id ASC;

-- ⑧ คำร้อง 3 รายการล่าสุด ถ้าเวลาเท่ากันใช้รหัสเรียงเพื่อให้ผลแน่นอน
SELECT id, location, details, status, created_at
FROM requests
ORDER BY created_at DESC, id DESC
LIMIT 3;

-- ⑨ Challenge: นับจำนวนคำร้องแยกตามสถานะ
SELECT status, COUNT(*) AS total
FROM requests
GROUP BY status
ORDER BY total DESC, status ASC;

-- ⑩ Challenge: จัดอันดับผู้แจ้ง รวมคนที่ยังไม่เคยแจ้งด้วย LEFT JOIN
-- COUNT(r.id) ทำให้ผู้ใช้ที่ไม่มีคำร้องได้ 0; COUNT(*) จะนับเป็น 1
SELECT u.id, u.name AS requesterName, u.department, COUNT(r.id) AS total
FROM users AS u
LEFT JOIN requests AS r ON r.requester_id = u.id
GROUP BY u.id, u.name, u.department
ORDER BY total DESC, u.id ASC;

-- ⑪ Challenge: สร้าง index และรันซ้ำได้โดยไม่ error
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
