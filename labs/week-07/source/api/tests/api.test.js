import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

/**
 * TODO W07-TEST (🏠 CP16) · เขียน test อย่างน้อย 6 เคส
 *
 * ที่ต้องมี
 *   1. GET /api/requests            → 200 และได้ array
 *   2. GET /api/requests/:id พบ      → 200
 *   3. GET /api/requests/:id ไม่พบ   → 404
 *   4. POST ข้อมูลถูกต้อง            → 201 และ status เป็น pending
 *   5. POST ข้อมูลไม่ครบ             → 400
 *   6. CORS header ตอบ origin ที่อนุญาต
 *
 * รันด้วย: npm test
 * ตัวอย่างโครง (ลบคอมเมนต์นี้แล้วเขียนจริง)
 */

describe('Campus Service Request API', () => {
  test('1. GET /api/requests ตอบ 200 และคืน array ของคำร้อง', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length > 0);
  });

  test('2. GET /api/requests/:id พบ ตอบ 200 และคืนข้อมูลคำร้องที่ตรงกัน', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });

  test('3. GET /api/requests/:id ไม่พบ ตอบ 404 พร้อมข้อความ error', async () => {
    const res = await request(app).get('/api/requests/UNKNOWN');
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });

  test('4. POST ข้อมูลถูกต้อง ตอบ 201 และ status เป็น pending', async () => {
    const res = await request(app).post('/api/requests').send(validRequest);
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id);
  });

  test('5. POST ข้อมูลไม่ครบ ตอบ 400 พร้อมข้อความเตือน', async () => {
    const res = await request(app).post('/api/requests').send({ requesterName: 'x' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  test('6. CORS header ตอบ origin ที่อนุญาต', async () => {
    const res = await request(app).get('/api/requests').set('Origin', 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
  });

  test('7. PUT /api/requests/:id เปลี่ยนสถานะคำร้องได้ ตอบ 200', async () => {
    const res = await request(app).put('/api/requests/REQ-001').send({ status: 'in-progress' });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'in-progress');
  });

  test('8. DELETE /api/requests/:id ลบคำร้องได้ ตอบ 204 ไม่มี body', async () => {
    const res = await request(app).delete('/api/requests/REQ-003');
    assert.equal(res.status, 204);
    assert.equal(res.text, '');
  });
});
