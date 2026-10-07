import { test, before, beforeEach, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import request from 'supertest';

let app;
let db;
let service;
let startupIndexes;
const previousDbFile = process.env.DB_FILE;
const testDirectory = mkdtempSync(path.join(tmpdir(), 'engse203-lab10-test-'));
const testDbFile = path.join(testDirectory, 'campus.db');
const schemaFile = fileURLToPath(new URL('../data/schema.sql', import.meta.url));
const schema = readFileSync(schemaFile, 'utf8');

/**
 * TODO W10-TEST (🏠 CP33) · เขียน test อย่างน้อย 6 เคส ที่ยิงเข้าฐานข้อมูลจริง
 *   1. GET /api/requests → 200 และได้ array
 *   2. คืน requesterName ไม่ใช่ requester_id
 *   3. GET /:id พบ → 200 · ไม่พบ → 404
 *   4. POST ถูกต้อง → 201
 *   5. POST ไม่ครบ → 400
 *   6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
 */
// กำหนด DB_FILE ก่อน import service เพราะ service อ่าน path ตอนโหลดโมดูล
process.env.DB_FILE = testDbFile;
before(async () => {
  // เตรียมฐานข้อมูลเดิมที่ยังไม่มี index เพื่อทดสอบการเริ่มระบบของ Challenge
  const existing = new DatabaseSync(testDbFile);
  existing.exec(schema);
  existing.exec('DROP INDEX idx_requests_status; DROP INDEX idx_requests_requester;');
  existing.close();
  service = await import('../src/services/requestService.js');
  const { createApp } = await import('../src/app.js');
  await service.loadSeed();
  app = createApp();
  db = new DatabaseSync(testDbFile);
  db.exec('PRAGMA foreign_keys = ON');
  startupIndexes = db.prepare('PRAGMA index_list(requests)').all().map((index) => index.name);
});

// แต่ละเคสเริ่มจาก seed เดิมในฐานข้อมูลชั่วคราวเท่านั้น
beforeEach(() => db.exec(schema));
after(() => {
  db?.close();
  rmSync(testDirectory, { recursive: true, force: true });
  if (previousDbFile === undefined) delete process.env.DB_FILE;
  else process.env.DB_FILE = previousDbFile;
});

const payload = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้องทดสอบ',
  details: 'เครื่องปรับอากาศในห้องทดสอบไม่ทำงาน',
  priority: 'normal',
};

async function assertInjectionBlocked(status) {
  const before = await request(app).get('/api/requests');
  assert.equal(before.status, 200);
  assert.ok(before.body.length > 0);
  const response = await request(app).get('/api/requests').query({ status });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, []);
  const after = await request(app).get('/api/requests');
  assert.equal(after.status, 200);
  assert.deepEqual(after.body, before.body);
  assert.ok(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'requests'").get());
}

describe('GET /api/requests', () => {
  test('คืน array พร้อม 200', async () => {
    const response = await request(app).get('/api/requests');
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
    assert.ok(response.body.length >= 5);
  });

  test('คืน requesterName และชื่อ field ตาม contract ไม่ใช่ requester_id', async () => {
    const response = await request(app).get('/api/requests');
    assert.equal(response.status, 200);
    assert.ok(response.body.length > 0);
    for (const item of response.body) {
      assert.deepEqual(Object.keys(item).sort(),
        ['id', 'requesterName', 'requestType', 'location', 'details', 'priority', 'status'].sort());
      assert.equal(typeof item.requesterName, 'string');
      assert.ok(!('requester_id' in item));
    }
    assert.equal(response.body.find((item) => item.id === 'REQ-001').requesterName, 'สมชาย ใจดี');
  });

  test('กรองสถานะ pending ได้ตรงกับข้อมูลในฐานข้อมูล', async () => {
    const response = await request(app).get('/api/requests').query({ status: 'pending' });
    assert.equal(response.status, 200);
    const expected = db.prepare('SELECT id FROM requests WHERE status = ? ORDER BY id').all('pending');
    assert.ok(expected.length > 0);
    assert.deepEqual(response.body.map((item) => item.id), expected.map((item) => item.id));
    assert.ok(response.body.every((item) => item.status === 'pending'));
  });

  test('GET /:id ที่มีจริงคืน 200', async () => {
    const response = await request(app).get('/api/requests/REQ-001');
    assert.equal(response.status, 200);
    assert.equal(response.body.id, 'REQ-001');
    assert.equal(response.body.requesterName, 'สมชาย ใจดี');
  });

  test('GET /:id ที่ไม่มีคืน 404', async () => {
    const response = await request(app).get('/api/requests/REQ-NOT-FOUND');
    assert.equal(response.status, 404);
    assert.equal(typeof response.body.error, 'string');
  });
});

describe('POST /api/requests', () => {
  test('สร้างคำร้องคืน 201 และใช้ id ของผู้แจ้งเดิม', async () => {
    const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
    const response = await request(app).post('/api/requests').send(payload);
    assert.equal(response.status, 201);
    assert.match(response.body.id, /^REQ-\d+$/);
    assert.equal(response.body.status, 'pending');
    assert.equal(response.body.requesterName, payload.requesterName);
    const saved = db.prepare('SELECT * FROM requests WHERE id = ?').get(response.body.id);
    assert.equal(saved.requester_id, db.prepare('SELECT id FROM users WHERE name = ?').get(payload.requesterName).id);
    assert.equal(saved.request_type, payload.requestType);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM users').get().count, userCount);
  });

  test('สร้างผู้แจ้งใหม่อัตโนมัติและ trim ข้อความ', async () => {
    const name = 'ผู้แจ้งใหม่ สำหรับทดสอบ';
    const response = await request(app).post('/api/requests').send({
      ...payload, requesterName: `  ${name}  `, location: '  ห้องใหม่  ', details: `  ${payload.details}  `,
    });
    assert.equal(response.status, 201);
    assert.equal(response.body.requesterName, name);
    assert.equal(response.body.location, 'ห้องใหม่');
    assert.equal(response.body.details, payload.details);
    const user = db.prepare('SELECT * FROM users WHERE name = ?').get(name);
    assert.ok(user);
    assert.equal(user.department, 'ไม่ระบุ');
    assert.equal(db.prepare('SELECT requester_id FROM requests WHERE id = ?').get(response.body.id).requester_id, user.id);
    const users = await request(app).get('/api/users');
    assert.equal(users.status, 200);
    assert.ok(users.body.some((item) => item.id === user.id && item.name === name));
    const requests = await request(app).get(`/api/users/${user.id}/requests`);
    assert.equal(requests.status, 200);
    assert.deepEqual(requests.body.map((item) => item.id), [response.body.id]);
  });

  test('ข้อมูลไม่ครบคืน 400 และไม่เพิ่มคำร้อง', async () => {
    const response = await request(app).post('/api/requests').send({ requesterName: 'x' });
    assert.equal(response.status, 400);
    assert.ok(Array.isArray(response.body.details));
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM requests').get().count, 5);
  });

  test('requestType ไม่อยู่ในรายการคืน 400 พร้อมข้อความที่เข้าใจได้', async () => {
    const response = await request(app).post('/api/requests').send({ ...payload, requestType: 'ผิดประเภท' });
    assert.equal(response.status, 400);
    assert.ok(response.body.details.includes('ประเภทคำร้องไม่ถูกต้อง'));
    assert.doesNotMatch(JSON.stringify(response.body), /constraint failed/i);
  });
});

describe('PUT และ DELETE /api/requests/:id', () => {
  test('PUT เปลี่ยนสถานะทั้ง response และฐานข้อมูล', async () => {
    const response = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'completed');
    assert.equal(db.prepare('SELECT status FROM requests WHERE id = ?').get('REQ-001').status, 'completed');
  });

  test('PUT สถานะผิดคืน 400 และไม่เปลี่ยนข้อมูล', async () => {
    const response = await request(app).put('/api/requests/REQ-001').send({ status: 'ผิดสถานะ' });
    assert.equal(response.status, 400);
    assert.equal(db.prepare('SELECT status FROM requests WHERE id = ?').get('REQ-001').status, 'pending');
  });

  test('PUT รหัสที่ไม่มีคืน 404', async () => {
    const response = await request(app).put('/api/requests/REQ-NOT-FOUND').send({ status: 'completed' });
    assert.equal(response.status, 404);
  });

  test('DELETE คืน 204 ไม่มี body และลบข้อมูลจริง', async () => {
    const response = await request(app).delete('/api/requests/REQ-001');
    assert.equal(response.status, 204);
    assert.equal(response.text, '');
    assert.equal(db.prepare('SELECT id FROM requests WHERE id = ?').get('REQ-001'), undefined);
    const missing = await request(app).get('/api/requests/REQ-001');
    assert.equal(missing.status, 404);
  });

  test('DELETE รหัสที่ไม่มีคืน 404', async () => {
    const response = await request(app).delete('/api/requests/REQ-NOT-FOUND');
    assert.equal(response.status, 404);
  });
});

describe('CP31: SQL injection', () => {
  test('เงื่อนไขจริงเสมอคืน 0 รายการ', async () => {
    await assertInjectionBlocked("x' OR '1'='1");
  });

  test('DROP TABLE คืน 0 รายการและตาราง requests ยังอยู่', async () => {
    await assertInjectionBlocked("'; DROP TABLE requests; --");
  });

  test('ต่อเงื่อนไขสถานะคืน 0 รายการ', async () => {
    await assertInjectionBlocked("pending' OR status='completed");
  });
});

describe('CP32: error จากฐานข้อมูลจริง', () => {
  // Trigger ทำให้ query ที่รับข้อมูลถูกต้องเจอ constraint จริงในฐานข้อมูลทดสอบ
  // เพื่อพิสูจน์ว่า error ถูกแปลงใน service ไม่ใช่ถูก validation กันไว้ก่อน
  test('CHECK คืน 400 และข้อความภาษาไทย', async () => {
    db.exec(`CREATE TRIGGER test_check AFTER INSERT ON requests BEGIN
      UPDATE requests SET status = 'invalid' WHERE id = NEW.id;
    END;`);
    const name = 'ผู้แจ้งใหม่ ที่ต้องย้อนกลับ';
    const response = await request(app).post('/api/requests').send({ ...payload, requesterName: name });
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด');
    assert.doesNotMatch(JSON.stringify(response.body), /constraint failed/i);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM requests').get().count, 5);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM users').get().count, 4);
    assert.equal(db.prepare('SELECT id FROM users WHERE name = ?').get(name), undefined);
  });

  test('FOREIGN KEY คืน 400', async () => {
    db.exec(`CREATE TRIGGER test_foreign_key AFTER INSERT ON requests BEGIN
      UPDATE requests SET requester_id = -1 WHERE id = NEW.id;
    END;`);
    const response = await request(app).post('/api/requests').send(payload);
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'อ้างถึงข้อมูลที่ไม่มีอยู่จริง');
  });

  test('UNIQUE คืน 409 เมื่อข้อมูลซ้ำ', async () => {
    db.exec(`CREATE TRIGGER test_unique BEFORE INSERT ON requests BEGIN
      UPDATE users SET email = (SELECT email FROM users WHERE id = 2) WHERE id = 1;
    END;`);
    const response = await request(app).post('/api/requests').send(payload);
    assert.equal(response.status, 409);
    assert.equal(response.body.error, 'ข้อมูลนี้มีอยู่แล้วในระบบ');
  });

  test('NOT NULL คืน 400 เมื่อข้อมูลจำเป็นหายไป', async () => {
    db.exec(`CREATE TRIGGER test_not_null BEFORE INSERT ON requests BEGIN
      UPDATE users SET department = NULL WHERE id = 1;
    END;`);
    const response = await request(app).post('/api/requests').send(payload);
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'กรุณาระบุข้อมูลที่จำเป็นให้ครบ');
  });

  test('constraint ระหว่าง UPDATE ถูกแปลงเป็น 400', async () => {
    db.exec(`CREATE TRIGGER test_update AFTER UPDATE OF status ON requests
      WHEN NEW.status = 'completed' BEGIN
      UPDATE requests SET priority = 'invalid' WHERE id = NEW.id;
    END;`);
    const response = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด');
    assert.equal(db.prepare('SELECT status FROM requests WHERE id = ?').get('REQ-001').status, 'pending');
  });

  test('constraint ระหว่าง DELETE ถูกแปลงเป็น 400', async () => {
    db.exec(`CREATE TRIGGER test_delete BEFORE DELETE ON requests BEGIN
      DELETE FROM users WHERE id = OLD.requester_id;
    END;`);
    const response = await request(app).delete('/api/requests/REQ-001');
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'อ้างถึงข้อมูลที่ไม่มีอยู่จริง');
    assert.ok(db.prepare('SELECT id FROM requests WHERE id = ?').get('REQ-001'));
  });

  test('ตารางหายเป็นปัญหาเซิร์ฟเวอร์ จึงยังคืน 500', async () => {
    db.exec('DROP TABLE requests');
    const response = await request(app).post('/api/requests').send(payload);
    assert.equal(response.status, 500);
    assert.equal(response.body.error, 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์');
  });
});

describe('Challenge: users endpoints', () => {
  test('GET /api/users คืนรายชื่อและข้อมูลผู้ใช้ทั้งหมด', async () => {
    const response = await request(app).get('/api/users');
    assert.equal(response.status, 200);
    assert.equal(response.body.length, 4);
    assert.deepEqual(response.body.map((user) => user.id), [1, 2, 3, 4]);
    for (const user of response.body) {
      assert.deepEqual(Object.keys(user).sort(), ['id', 'name', 'department', 'email'].sort());
    }
  });

  test('GET /api/users/:id/requests คืนเฉพาะคำร้องของผู้ใช้คนนั้น', async () => {
    const response = await request(app).get('/api/users/1/requests');
    assert.equal(response.status, 200);
    assert.deepEqual(response.body.map((item) => item.id), ['REQ-001', 'REQ-004']);
    assert.ok(response.body.every((item) => item.requesterName === 'สมชาย ใจดี'));
    assert.ok(response.body.every((item) => !('requester_id' in item)));
  });

  test('ผู้ใช้ที่มีจริงแต่ไม่มีคำร้องคืน 200 พร้อม array ว่าง', async () => {
    const user = db.prepare('INSERT INTO users (name, department, email) VALUES (?, ?, ?)')
      .run('ผู้ใช้ไม่มีคำร้อง', 'แผนกทดสอบ', 'empty@example.test');
    const response = await request(app).get(`/api/users/${user.lastInsertRowid}/requests`);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  test('รหัสผู้ใช้ที่ไม่มีจริงคืน 404', async () => {
    const response = await request(app).get('/api/users/999999/requests');
    assert.equal(response.status, 404);
    assert.equal(typeof response.body.error, 'string');
  });

  test('รหัสไม่ใช่จำนวนเต็มบวก รวมถึง SQL injection คืน 400', async () => {
    for (const id of ['0', '-1', '1.5', 'abc', '9007199254740992', "1 OR '1'='1"]) {
      const response = await request(app).get(`/api/users/${encodeURIComponent(id)}/requests`);
      assert.equal(response.status, 400, id);
      assert.equal(response.body.error, 'รหัสผู้ใช้ต้องเป็นจำนวนเต็มบวก');
    }
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM users').get().count, 4);
  });
});

describe('Challenge: transaction', () => {
  test('ชื่อใหม่พร้อมประเภทผิด CHECK ไม่ทิ้ง user ค้าง และสร้างใหม่ภายหลังได้', async () => {
    const name = 'ผู้แจ้งใหม่ ทดสอบ Transaction';
    assert.throws(() => service.create({ ...payload, requesterName: name, requestType: 'ผิดประเภท' }),
      (err) => err.status === 400 && err.message === 'ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด');
    assert.equal(db.prepare('SELECT id FROM users WHERE name = ?').get(name), undefined);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM users').get().count, 4);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM requests').get().count, 5);

    // ยืนยันว่า ROLLBACK จบ transaction แล้ว การสร้างครั้งถัดไป COMMIT ได้ตามปกติ
    const response = await request(app).post('/api/requests').send({ ...payload, requesterName: name });
    assert.equal(response.status, 201);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM users').get().count, 5);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM requests').get().count, 6);
  });
});

describe('Challenge: indexes และ EXPLAIN QUERY PLAN', () => {
  test('เริ่มระบบกับฐานข้อมูลที่มีอยู่แล้วก็สร้าง index ที่ขาดได้', () => {
    assert.ok(startupIndexes.includes('idx_requests_status'));
    assert.ok(startupIndexes.includes('idx_requests_requester'));
  });

  test('ค้นหาตาม status เปลี่ยนจาก SCAN เป็น SEARCH USING INDEX', () => {
    const sql = 'EXPLAIN QUERY PLAN SELECT * FROM requests WHERE status = ?';
    const after = db.prepare(sql).all('pending').map((row) => row.detail).join('\n');
    db.exec('DROP INDEX idx_requests_status');
    const before = db.prepare(sql).all('pending').map((row) => row.detail).join('\n');
    assert.match(before, /SCAN requests/);
    assert.match(after, /SEARCH requests USING INDEX idx_requests_status/);
  });

  test('ค้นหาตาม requester_id เปลี่ยนจาก SCAN เป็น SEARCH USING INDEX', () => {
    const sql = 'EXPLAIN QUERY PLAN SELECT * FROM requests WHERE requester_id = ?';
    const after = db.prepare(sql).all(1).map((row) => row.detail).join('\n');
    db.exec('DROP INDEX idx_requests_requester');
    const before = db.prepare(sql).all(1).map((row) => row.detail).join('\n');
    assert.match(before, /SCAN requests/);
    assert.match(after, /SEARCH requests USING INDEX idx_requests_requester/);
  });
});
