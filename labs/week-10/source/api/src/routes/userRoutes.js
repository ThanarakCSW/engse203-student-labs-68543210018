import { Router } from 'express';
import * as service from '../services/requestService.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json(service.findUsers());
});

router.get('/:id/requests', (req, res) => {
  const id = Number(req.params.id);
  if (!/^[1-9]\d*$/.test(req.params.id) || !Number.isSafeInteger(id)) {
    return res.status(400).json({ error: 'รหัสผู้ใช้ต้องเป็นจำนวนเต็มบวก' });
  }
  if (!service.findUserById(id)) {
    return res.status(404).json({ error: `ไม่พบผู้ใช้รหัส ${id}` });
  }
  res.status(200).json(service.findRequestsByUserId(id));
});

export default router;
