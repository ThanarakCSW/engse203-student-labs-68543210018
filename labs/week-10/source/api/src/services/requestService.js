import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Week 10 — เปลี่ยน service จากอ่านไฟล์ JSON เป็นฐานข้อมูล SQLite
 *
 * ตอนนี้ยังเป็นเวอร์ชัน Week 07 (อ่านไฟล์ JSON) อยู่
 * งานของสัปดาห์นี้คือเปลี่ยนให้ใช้ node:sqlite
 *
 * ⚠ กฎเหล็ก: signature ของทุกฟังก์ชันต้องเหมือนเดิมทุกตัว
 *   → controller และ frontend จะได้ไม่ต้องแก้เลย
 */

// ── ของเดิม Week 07 (อ่านไฟล์ JSON) — จะถูกแทนที่ ──
const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');
const SCHEMA_FILE = path.join(API_ROOT, 'data', 'schema.sql');

const SELECT_SHAPE = `
  SELECT r.id,
         u.name          AS requesterName,
         r.request_type  AS requestType,
         r.location,
         r.details,
         r.priority,
         r.status
  FROM requests r
  JOIN users u ON u.id = r.requester_id`;

let db;

export async function loadSeed() {
  db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');   // ⚠ ต้องสั่งทุกครั้ง

  // ถ้ายังไม่มีตาราง (ไฟล์ใหม่) ให้สร้างจาก schema.sql
  const ready = db.prepare(
    "SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='requests'"
  ).get().c;
  if (!ready && existsSync(SCHEMA_FILE)) {
    db.exec(readFileSync(SCHEMA_FILE, 'utf8'));
  }

  // Challenge: เพิ่ม index ได้ทั้งฐานข้อมูลใหม่และฐานข้อมูลที่มีอยู่แล้ว
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
    CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
  `);
}




export function findAll({ status } = {}) {
  return status
    ? db.prepare(`${SELECT_SHAPE} WHERE r.status = ? ORDER BY r.id`).all(status)
    : db.prepare(`${SELECT_SHAPE} ORDER BY r.id`).all();
}

export function findById(id) {
  return db.prepare(`${SELECT_SHAPE} WHERE r.id = ?`).get(id) ?? null;
}

/** Challenge: อ่านผู้ใช้และคำร้องของผู้ใช้ผ่าน connection เดียวกับคำร้อง */
export function findUsers() {
  return db.prepare('SELECT id, name, department, email FROM users ORDER BY id').all();
}

export function findUserById(id) {
  return db.prepare('SELECT id, name, department, email FROM users WHERE id = ?').get(id) ?? null;
}

export function findRequestsByUserId(id) {
  return db.prepare(`${SELECT_SHAPE} WHERE r.requester_id = ? ORDER BY r.id`).all(id);
}

/** แปลงชื่อผู้แจ้งเป็น id — ถ้ายังไม่มีในระบบก็สร้างให้ */
function resolveUserId(name) {
  const found = db.prepare('SELECT id FROM users WHERE name = ?').get(name);
  if (found) return found.id;                  // มีแล้ว — ใช้ id เดิม

  const slug = Date.now().toString(36);
  return db.prepare('INSERT INTO users (name, department, email) VALUES (?, ?, ?)')
           .run(name, 'ไม่ระบุ', `user-${slug}@rmutl.ac.th`).lastInsertRowid;
}

function nextId() {
  const row = db.prepare(
    "SELECT id FROM requests WHERE id LIKE 'REQ-%' ORDER BY id DESC LIMIT 1"
  ).get();
  const n = row ? Number(String(row.id).replace('REQ-', '')) + 1 : 1;
  return `REQ-${String(n).padStart(3, '0')}`;
}

/** CP32: แปล constraint error ให้ผู้ใช้เข้าใจ โดยไม่เปลี่ยน error ของเซิร์ฟเวอร์ */
function toAppError(err) {
  const message = err.message ?? '';
  if (message.includes('FOREIGN KEY constraint failed')) {
    return new AppError('อ้างถึงข้อมูลที่ไม่มีอยู่จริง', 400);
  }
  if (message.includes('CHECK constraint failed')) {
    return new AppError('ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด', 400);
  }
  if (message.includes('UNIQUE constraint failed')) {
    return new AppError('ข้อมูลนี้มีอยู่แล้วในระบบ', 409);
  }
  if (message.includes('NOT NULL constraint failed')) {
    return new AppError('กรุณาระบุข้อมูลที่จำเป็นให้ครบ', 400);
  }
  return err;
}

export function create(input) {
  // Challenge: สร้าง user และคำร้องให้สำเร็จพร้อมกัน หรือย้อนกลับทั้งสองอย่าง
  db.exec('BEGIN IMMEDIATE');
  try {
    const id = nextId();
    db.prepare(
      `INSERT INTO requests (id, requester_id, request_type, location, details, priority)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      resolveUserId(input.requesterName.trim()),   // ← แปลงตรงนี้
      input.requestType,
      input.location.trim(),
      input.details.trim(),
      input.priority ?? 'normal'
    );
    const created = findById(id);   // คืนรูปแบบที่ frontend ต้องการ
    db.exec('COMMIT');
    return created;
  } catch (err) {
    db.exec('ROLLBACK');
    throw toAppError(err);
  }
}

export function updateStatus(id, status) {
  try {
    const result = db.prepare('UPDATE requests SET status = ? WHERE id = ?')
                     .run(status, id);
    return result.changes ? findById(id) : null;
  } catch (err) {
    throw toAppError(err);
  }
}

export function remove(id) {
  try {
    const target = findById(id);      // ① หาก่อน
    if (!target) return null;          // ② ไม่พบ → null
    db.prepare('DELETE FROM requests WHERE id = ?').run(id);
    return target;                     // ③ คืนของที่ลบ
  } catch (err) {
    throw toAppError(err);
  }
}
