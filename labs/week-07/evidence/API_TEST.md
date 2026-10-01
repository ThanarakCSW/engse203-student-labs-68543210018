# API_TEST — LAB 07

**ชื่อ–รหัส:** ธนรัก ชุ่มสวัสดิ์ 68543210018-6  
**วันที่ทดสอบ:** 2026-10-01 (Asia/Bangkok)

## วิธีและขอบเขตการทดสอบ

ทดสอบการทำงานของระบบด้วย Node.js, Supertest, HTTP จริง และการทดสอบผ่านเบราว์เซอร์ โดยตรวจสอบทั้งกรณีสำเร็จและกรณีข้อผิดพลาด

- ทดสอบระบบที่ API `http://localhost:3001` และ frontend `http://localhost:5173`: API ตอบ 200, CORS ถูกต้อง และ Dashboard แสดงรายการคำร้อง
- ทดสอบการแก้ไขข้อมูล การเปลี่ยนสถานะคำร้อง และการปิด–เปิดเซิร์ฟเวอร์
- ตรวจสอบสถานะการเชื่อมต่อ และการจัดการข้อผิดพลาดเมื่อไม่สามารถติดต่อ API ได้
- ตรวจสอบสถานะกำลังโหลด (loading state) และการกดปุ่มซ้ำขณะรอดำเนินการ

## 1. ผล HTTP จริง

Base URL สำหรับตารางนี้: `http://localhost:3001`

| # | Method | Path | ส่งอะไร | คาดหวัง | ได้จริง | ผล |
|---|---|---|---|---|---|---|
| 1 | GET | `/api/requests` | — | 200 | 200 | ผ่าน |
| 2 | GET | `/api/requests/REQ-001` | — | 200 | 200 | ผ่าน |
| 3 | GET | `/api/requests/REQ-999` | — | 404 | 404 | ผ่าน |
| 4 | POST | `/api/requests` | `{"requesterName": "ทดสอบ ระบบ", "requestType": "แจ้งซ่อม", "location": "C3-401", "details": "เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า", "priority": "normal"}` | 201 | 201 | ผ่าน |
| 5 | POST | `/api/requests` | `{"requesterName": "x"}` | 400 | 400 | ผ่าน |
| 6 | PUT | `/api/requests/REQ-001` | `{"status": "in-progress"}` | 200 | 200 | ผ่าน |
| 7 | PUT | `/api/requests/REQ-001` | `{"status": "มั่ว"}` | 400 | 400 | ผ่าน |
| 8 | PUT | `/api/requests/REQ-999` | `{"status": "completed"}` | 404 | 404 | ผ่าน |
| 9 | DELETE | `/api/requests/REQ-MUP32XR6-PFKV` | — | 204 | 204 | ผ่าน |
| 10 | DELETE | `/api/requests/REQ-999` | — | 404 | 404 | ผ่าน |
| 11 | OPTIONS | `/api/requests/REQ-001` | — | 204 | 204 | ผ่าน |

**ผลเพิ่มเติมจาก response:** GET รายการคืน array 3 รายการ; POST สำเร็จคืนรหัสใหม่และ `pending`; POST ชื่อ `x` คืน details 5 ข้อ; PUT สำเร็จคืน `in-progress`; DELETE สำเร็จไม่มี body; OPTIONS อนุญาต PUT และ Content-Type

## 2. CORS และการเชื่อมต่อ Frontend

| ทดสอบ | ผลจริง | สถานะ |
|---|---|---|
| Dashboard บนพอร์ต 5173 | แสดงคำร้อง 3 รายการจาก API | ผ่าน |
| GET API พอร์ต 3001 พร้อม Origin 5173 | HTTP 200, `Access-Control-Allow-Origin: http://localhost:5173` | ผ่าน |
| Dashboard เชื่อมต่อ API 5173 → 3001 | โหลดข้อมูลได้ ไม่มี CORS error ขวางการแสดงข้อมูล | ผ่าน |
| Preflight OPTIONS | 204, origin 5173, methods มี PUT, allow-headers มี content-type | ผ่าน |
| ปิด API แล้วเข้าหน้า Dashboard | แสดง “โหลดข้อมูลไม่สำเร็จ” พร้อมข้อความติดต่อเซิร์ฟเวอร์ไม่ได้และปุ่มลองอีกครั้ง | ผ่าน |
| เปิด API แล้วกดปุ่มลองอีกครั้ง | Dashboard กลับมาแสดงคำร้อง 3 รายการตามปกติ | ผ่าน |
| ดู response header ใน DevTools Network | แสดง Access-Control-Allow-Origin ครบถ้วน | ผ่าน |


## 3. CP13 — เปลี่ยนสถานะผ่านหน้าเว็บ

| ขั้น | ผลจริง | ผล |
|---|---|---|
| กดเปลี่ยนสถานะบนการ์ดคำร้อง | นำทางไปหน้ารายละเอียด REQ-001 ได้ | ผ่าน |
| เลือก in-progress ขณะรอการตอบสนอง | แสดง “กำลังบันทึกสถานะ…” ปุ่มทั้งสาม disabled และสถานะเดิมยังเป็น pending | ผ่าน |
| เมื่อบันทึกสำเร็จ | log มี PUT 200 และหน้าเว็บเปลี่ยนสถานะเป็น in-progress | ผ่าน |
| รีเฟรชหน้าเว็บ | รายละเอียดยังคงแสดงสถานะ in-progress | ผ่าน |
| ปิด API แล้วเลือก completed | แสดง error สถานะยังคงเป็น in-progress และปุ่มสถานะกลับมาใช้งานได้ | ผ่าน |

**การเก็บข้อมูล:** เมื่อ restart API ข้อมูล REQ-001 กลับเป็น pending ตาม seed แสดงว่าข้อมูลถูกเก็บใน memory ไม่คงอยู่ข้าม restart แต่คงอยู่ระหว่างการ refresh หน้าเว็บ

## 4. CP14 — Logging และ Error Handling

ทดสอบรูปแบบ log และการจัดการ error ตามแต่ละค่า NODE_ENV:

| กรณี | ผลจริง | ผล |
|---|---|---|
| NODE_ENV=development | log แสดงรูปแบบ dev: `PUT /api/requests/REQ-001 400 ...` | ผ่าน |
| NODE_ENV=production | log แสดงรูปแบบ combined มี IP, วันเวลา, HTTP method | ผ่าน |
| PUT สถานะผิดใน production | 400 พร้อม error message และไม่มี stack | ผ่าน |
| 500 ใน production | ตอบ `{"error":"เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์"}` ซ่อน stack และรายละเอียดภายใน | ผ่าน |
| log ของ 500 | แสดงรายละเอียดข้อผิดพลาดในฝั่ง console เซิร์ฟเวอร์ | ผ่าน |
| development error | มี stack ไม่เกินสามบรรทัด เพื่อความสะดวกในการ debug | ผ่าน |
| ค่า .env หลังทดสอบ | คงค่า NODE_ENV=development ตามเดิม | ผ่าน |

## 5. CP15 — ตรวจ API Contract

**ผล: ผ่าน ครบถ้วนสมบูรณ์ตามข้อกำหนด**

- [x] มีไฟล์ `API_CONTRACT.md` และตารางรายการ method/path ครบทั้ง 5 endpoint พร้อม query parameter สำหรับกรองสถานะ
- [x] มีตาราง field ข้อกำหนดข้อมูล, status codes, CORS, environment variables และคำสั่งรันทั้งสองฝั่งครบถ้วน
- [x] ทุก endpoint มีตัวอย่าง request และ response จริง
- [x] ระบุกรณีผิดพลาด (400, 404, 500) และรูปแบบ error พร้อม details ชัดเจน
- [x] ระบุความแตกต่างของ error response ระหว่าง development และ production
- [x] กรอกข้อมูลระบบ ผู้จัดทำ และประวัติการเปลี่ยนแปลงครบถ้วน ลบ placeholder ออกทั้งหมด

## 6. CP16 — Automated Tests และทดสอบการตรวจจับข้อผิดพลาด

| การทดสอบ | ผลจริง |
|---|---|
| npm test บนโค้ดปัจจุบัน | 8 tests, pass 8, fail 0 |
| สำเนาโค้ดทดสอบ: เปลี่ยน POST จาก 201 เป็น 200 | 8 tests, pass 7, fail 1 (เคส POST ตรวจจับได้ว่า 200 !== 201) |
| คืนค่าเป็น 201 แล้วรันทดสอบซ้ำ | 8 tests, pass 8, fail 0 |

ทดสอบ mutation ในสำเนาแยก โค้ดส่งงานจริงคงความถูกต้องและผ่านการทดสอบทุกเคส

## 7. Challenge

| รายการ | ผล |
|---|---|
| AppError กำหนด status และ default 500 | ผ่าน automated test |
| asyncHandler ส่ง rejected Promise และ synchronous error ไป next | ผ่าน automated test |
| asyncHandler + AppError + errorHandler ตอบ HTTP 404 จริง | ผ่าน automated test |
| production ไม่ส่ง stack trace | ผ่าน |

## 8. Checker

รัน `node check-week07.mjs` จากโฟลเดอร์ week-07:

- In-Class: **25/25**
- Take-Home: **8/8**
- Challenge ใน checker: **3/3**
- รวม: **36/36**

## 9. ภาพหลักฐาน

ภาพบันทึกหลักฐานการทดสอบระบบ:

- [x] [error-state.png](images/error-state.png) — Dashboard เมื่อ API ปิดจริง แสดง ErrorState และปุ่มลองใหม่
- [x] [app-with-api.png](images/app-with-api.png) — Dashboard ทำงานร่วมกับ API แสดงข้อมูลคำร้อง
- [x] [network-cors-ok.png](images/network-cors-ok.png) — แสดงการเชื่อมต่อและ CORS Headers ใน Network tab

## 10. สรุปผลจริง

- HTTP ทดสอบ: **ผ่าน 11/11**
- Automated tests (`npm test`): **ผ่าน 8/8**
- Checker (`node check-week07.mjs`): **ผ่าน 36/36**
- Mutation test: **ตรวจจับข้อผิดพลาดได้** และกลับมาผ่านเมื่อคืนค่า
- เบราว์เซอร์: การโหลดข้อมูล, การเปลี่ยนสถานะ, การปิดปุ่มระหว่างรอ, refresh, error และลองใหม่ ผ่านครบถ้วน
- เอกสารและสัญญา: **API_CONTRACT.md ครบถ้วนสมบูรณ์**
