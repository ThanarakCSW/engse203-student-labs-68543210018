-- Campus Service Request — LAB09 / CP23
-- สร้าง users 5 คน และ requests 8 รายการ พร้อม constraint และ index
-- REQ-001 ถึง REQ-005 รักษาค่าจาก campus.db ที่ทำในห้อง
-- ผู้ใช้คนที่ 5 และ REQ-006 ถึง REQ-008 เป็นข้อมูลสมมติสำหรับทดสอบ
-- รันไฟล์นี้แล้วจะลบตารางเดิมและสร้างข้อมูลตั้งต้นใหม่
-- ให้ทดลองกับฐานข้อมูลใหม่หรือสำรอง campus.db ก่อนรัน

PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

-- ลบตารางลูกก่อนตารางแม่ เพื่อไม่ให้ขัดกับ Foreign Key
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  department  TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE
);

CREATE TABLE requests (
  -- SQLite ยอมให้ TEXT PRIMARY KEY เป็น NULL ได้ จึงระบุ NOT NULL เพิ่ม
  id            TEXT PRIMARY KEY NOT NULL,
  requester_id  INTEGER NOT NULL,
  request_type  TEXT NOT NULL
                CHECK (request_type IN ('แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ')),
  location      TEXT NOT NULL,
  details       TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('normal', 'urgent')),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- ใส่ผู้ใช้ก่อน เพราะคำร้องต้องอ้างถึง users.id ที่มีอยู่แล้ว
INSERT INTO users (id, name, department, email) VALUES
  (1, 'สมชาย ใจดี', 'วิศวกรรมซอฟต์แวร์', 'somchai@rmutl.ac.th'),
  (2, 'สุภาวดี รักเรียน', 'วิศวกรรมซอฟต์แวร์', 'supawadee@rmutl.ac.th'),
  (3, 'ธนกฤต ตั้งใจ', 'วิศวกรรมไฟฟ้า', 'thanakrit@rmutl.ac.th'),
  (4, 'ปรียา ขยันยิ่ง', 'สำนักวิทยบริการ', 'preeya@rmutl.ac.th'),
  (5, 'วิภา เรียนดี', 'วิศวกรรมเครื่องกล', 'wipa@rmutl.ac.th');

-- ระบุเวลาในข้อมูลสมมติให้แน่นอน เพื่อสร้างใหม่แล้วได้ผล query เหมือนกัน
-- created_at ยังมี DEFAULT สำหรับคำร้องใหม่ที่ไม่ได้ระบุเวลา
INSERT INTO requests
  (id, requester_id, request_type, location, details, priority, status, created_at)
VALUES
  ('REQ-001', 1, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 301', 'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า', 'urgent', 'pending', '2026-09-24 16:41:29'),
  ('REQ-002', 2, 'บริการบัญชีผู้ใช้', 'อาคารวิศวกรรมซอฟต์แวร์', 'เข้าสู่ระบบห้องปฏิบัติการไม่ได้', 'normal', 'in-progress', '2026-09-24 16:41:29'),
  ('REQ-003', 3, 'ขอใช้อุปกรณ์', 'ห้องประชุม 2', 'ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน', 'normal', 'completed', '2026-09-24 16:41:29'),
  ('REQ-004', 1, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 302', 'คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด', 'urgent', 'pending', '2026-09-24 16:41:29'),
  ('REQ-005', 4, 'อื่น ๆ', 'ห้องสมุด ชั้น 2', 'ขอเพิ่มปลั๊กไฟบริเวณโต๊ะอ่านหนังสือ', 'normal', 'pending', '2026-09-24 16:41:29'),
  ('REQ-006', 2, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 401', 'ไฟในห้องกะพริบตลอดเวลา', 'normal', 'pending', '2026-10-07 09:00:00'),
  ('REQ-007', 3, 'แจ้งซ่อม', 'ห้องปฏิบัติการไฟฟ้า 101', 'เครื่องวัดแรงดันไม่ทำงาน', 'urgent', 'in-progress', '2026-10-07 09:15:00'),
  ('REQ-008', 4, 'ขอใช้อุปกรณ์', 'ห้องสมุด ชั้น 1', 'ขอยืมโปรเจกเตอร์สำหรับกิจกรรมแนะนำห้องสมุด', 'normal', 'completed', '2026-10-07 09:30:00');

-- Challenge: คอลัมน์ที่ใช้กรองและเชื่อมตารางบ่อย
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
COMMIT;
