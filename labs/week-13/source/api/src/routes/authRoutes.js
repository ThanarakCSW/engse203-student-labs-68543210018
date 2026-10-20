import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

const router = Router();

const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function resetLoginLimiter() {
  loginAttempts.clear();
}

router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }

  const email = (req.body?.email || '').toLowerCase().trim();
  const now = Date.now();
  const record = loginAttempts.get(email);
  if (record && record.count >= MAX_ATTEMPTS && (now - record.firstAttempt) < WINDOW_MS) {
    return res.status(429).json({ error: 'พยายามเข้าสู่ระบบผิดพลาดเกินกำหนด กรุณารอสักครู่' });
  }

  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    const current = loginAttempts.get(email);
    if (!current || (now - current.firstAttempt) >= WINDOW_MS) {
      loginAttempts.set(email, { count: 1, firstAttempt: now });
    } else {
      current.count += 1;
    }
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  loginAttempts.delete(email);
  res.status(200).json(result);
});

export default router;
