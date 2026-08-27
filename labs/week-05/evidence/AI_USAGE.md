# ENGSE203 LAB05 — AI / Resource Usage

| Tool / Resource | Purpose | Used portion | How I verified | My final decision |
|---|---|---|---|---|
| Gemini AI Assistant | ตรวจสอบ Error ในฟังก์ชัน `createRequestId` ใน `requestService.js` ที่ไม่ยอมสร้าง REQ-ID | คำแนะนำและ Syntax Template Literal `id = \`REQ-${time}-${random}\`;` | ตรวจสอบ Source Code | ยอมรับและนำ Syntax โค้ดที่แก้ไขแล้วมาใช้งาน |

คำรับรอง:

- [x] ไม่ส่ง token, password, secret หรือข้อมูลส่วนบุคคลจริงให้เครื่องมือ
- [x] ตรวจ source และรัน test ด้วยตนเอง
- [x] อธิบาย Route, Effect, Service Layer และ persistence ของ final code ได้
