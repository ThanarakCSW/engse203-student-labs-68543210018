# Campus Service — ระบบ Full-Stack (ENGSE203 Week 11)

ระบบรับคำร้องขอใช้บริการภายในมหาวิทยาลัย · **React + Express API + SQLite** ทำงานครบวงจร พร้อมโครงสร้างรองรับการใช้งานจริง (Production-ready)

---

## สถาปัตยกรรม 3 ชั้น (Three-Tier Architecture)

ระบบถูกออกแบบแยกชั้นความรับผิดชอบอย่างชัดเจน (Separation of Concerns) ทำให้สามารถบำรุงรักษา ทดสอบ และปรับเปลี่ยนเทคโนโลยีในแต่ละชั้นได้โดยไม่ส่งผลกระทบข้ามชั้น:

```
┌─────────────────────────┐          HTTP / JSON          ┌─────────────────────────┐          SQL Queries          ┌─────────────────────────┐
│        Frontend         │ ────────────────────────────► │       Express API       │ ────────────────────────────► │        Database         │
│         (React)         │ ◄──────────────────────────── │      (Node.js API)      │ ◄──────────────────────────── │        (SQLite)         │
└─────────────────────────┘                               └─────────────────────────┘                               └─────────────────────────┘
        พอร์ต 5173                                                 พอร์ต 3001                                                campus.db
 (Single Page Application)                                    (RESTful API Service)                                     (Relational Storage)
```

| ชั้น (Tier) | เทคโนโลยีหลัก | บทบาทหน้าที่ | โฟลเดอร์ในโปรเจกต์ |
|---|---|---|---|
| **Presentation Tier (Frontend)** | React 18, Vite | แสดงผลหน้าจอผู้ใช้ (Dashboard, ฟอร์มยื่นคำร้อง, หน้ารายละเอียด), จัดการ UI state, เรียกใช้งาน API ผ่าน Fetch | `frontend/` |
| **Application Tier (API)** | Node.js, Express | จัดการเส้นทาง (Routing), ตัวควบคุม (Controllers), ตรวจสอบความถูกต้องของข้อมูล (Validation), จัดการ Error และ Log รวมศูนย์ | `api/src/` |
| **Data Tier (Database)** | SQLite, better-sqlite3 | จัดเก็บข้อมูลแบบสัมพันธ์ (Relational Data), บังคับใช้ Schema, Constraints (Foreign Keys, NOT NULL, AUTOINCREMENT) | `api/data/campus.db` |

---

## วิธีการติดตั้งและรันระบบในเครื่อง (Development Mode)

### 1. ชั้นฐานข้อมูลและ API
```bash
cd api
npm install
npm run db:setup      # สร้างและเตรียมโครงสร้าง campus.db จาก schema.sql
npm run dev           # เปิดเซิร์ฟเวอร์ Express API ที่ http://localhost:3001
```

### 2. ชั้น Frontend (เปิดอีก Terminal หนึ่ง)
```bash
cd frontend
npm install
npm run dev           # เปิดเซิร์ฟเวอร์ React ด้วย Vite ที่ http://localhost:5173
```

---

## วิธีการสร้างและรันระบบแบบจำลอง Production (Single Port)

ในสภาพแวดล้อม Production ระบบจะรวมการทำงานทั้งฝั่งเว็บและ API ให้รันผ่านพอร์ตเดียวกัน โดย Express API จะทำหน้าที่เสิร์ฟไฟล์ Static ของ Frontend จากโฟลเดอร์ `frontend/dist`:

```bash
# ติดตั้ง dependencies และ build ทั้งระบบจาก root
NODE_ENV=production npm install --include=dev
npm run build         # สั่ง build frontend และ compile bundle

# เริ่มต้นระบบ Production บนพอร์ตที่กำหนด
NODE_ENV=production PORT=10000 npm start
# เปิดทดสอบผ่านเบราว์เซอร์ที่ http://localhost:10000
```

| การกำหนดค่า | รายละเอียดการทำงานใน Production |
|---|---|
| `frontend/.env.production` | กำหนด `VITE_API_BASE_URL=` เป็นค่าว่าง เพื่อให้ Frontend เรียก API ผ่าน Path สัมพัทธ์ (`/api/...`) บนโดเมนเดียวกัน ป้องกันปัญหา Cross-Origin |
| `api/src/app.js` | เมื่อ `config.isProd` เป็นจริง จะเปิดใช้ `express.static(config.staticDir)` และส่งคืน `index.html` สำหรับเส้นทางที่ไม่ใช่ `/api` |
| `package.json` | ใช้ `--include=dev` ในขั้นตอน Build เพื่อให้ Cloud Provider เช่น Render สามารถเรียกใช้งาน Vite ได้ในขณะสร้าง Bundle |

---

## การตรวจสอบสถานะระบบ (Health Check API)

ระบบมี Endpoint สำหรับให้ Load Balancer หรือ Monitoring Service ตรวจสอบสุขภาพของแอปพลิเคชัน:

```bash
curl http://localhost:3001/api/health
```

ตัวอย่าง Response ที่ได้รับ:
```json
{
  "status": "ok",
  "env": "development",
  "uptime": 124,
  "database": {
    "connected": true,
    "file": "api/data/campus.db",
    "tables": ["users", "requests"]
  },
  "time": "2026-10-21T16:00:00.000Z"
}
```

---

## การตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)

| ตัวแปร | ค่าเริ่มต้น (Default) | คำอธิบายความหมาย |
|---|---|---|
| `NODE_ENV` | `development` | สภาพแวดล้อมการทำงาน (`development` หรือ `production`) |
| `PORT` | `3001` | พอร์ตของ Express API Server |
| `CORS_ORIGIN` | `http://localhost:5173` | ต้นทาง Frontend ที่ได้รับอนุญาตให้เรียกใช้งาน API ข้ามพอร์ต |
| `DB_FILE` | `api/data/campus.db` | ที่ตั้งของไฟล์ฐานข้อมูล SQLite |
| `STATIC_DIR` | `../frontend/dist` | ตำแหน่งโฟลเดอร์ไฟล์ Static สำหรับโหมด Production |

---

## การตัดสินใจเชิงสถาปัตยกรรม (Architectural Decisions)

1. **การแยกความรับผิดชอบ 3 ชั้นอย่างสมบูรณ์:** ไม่เขียน SQL queries หรือ business logic ไว้ใน Controller หรือ Frontend ทำให้หากในอนาคตต้องการเปลี่ยนระบบฐานข้อมูล จะปรับแก้เฉพาะใน Service layer เท่านั้น
2. **การเลือกใช้ SQLite:** ข้อมูลคำร้องและผู้ใช้งานมีโครงสร้างที่ชัดเจนและมีความสัมพันธ์แบบ 1-to-Many จึงเหมาะสมกับ Relational Database ที่รองรับ ACID transactions และไม่ต้องพึ่งพาเซิร์ฟเวอร์ฐานข้อมูลภายนอก (อ่านเพิ่มเติมใน [DATABASE_CHOICES.md](./DATABASE_CHOICES.md))
3. **การรวมศูนย์การตั้งค่า (Centralized Configuration):** รวมการอ่าน `process.env` ไว้ที่ `api/src/config.js` เพียงจุดเดียว ป้องกันการ hardcode ค่าใน controller หรือ routes ต่างๆ
