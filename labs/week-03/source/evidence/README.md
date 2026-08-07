# Week 03 — Evidence & Reflection

**ชื่อ-นามสกุล:** ธนรัก ชุ่มสวัสดิ์ (Thanarak Chumsawat)  
**รหัสนักศึกษา:** 68543210018-6  
**รายวิชา:** ENGSE203 Software Engineering Practice (Week 03)  

---

## 📌 Overview & Environment

- **Lab**: Week 03 — Responsive Web UI & Form Interaction
- **Title**: Campus Service Request
- **URLs**:
  - Development Server: `http://localhost:5173/` (หรือ `http://localhost:5175/`)
  - Vite Preview Server: `http://localhost:4173/`
- **Node Version**: v22.x
- **Browser Tested**: Google Chrome / Playwright Automated Browser

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
engse203-lab03-68543210018-6/
├── index.html              # ไฟล์ HTML หลัก โครงสร้างหน้าเว็บระบบแจ้งซ่อม
├── package.json            # ไฟล์กำหนด Dependencies และ Scripts (dev, build, check)
├── package-lock.json       # ไฟล์ล็อกเวอร์ชันของ Packages
├── README.md               # เอกสารอธิบายโปรเจกต์และสรุปผลการทดสอบหลัก
├── .gitignore              # ไฟล์ยกเว้นการติดตามของ Git
├── src/                    # โฟลเดอร์ซอร์สโค้ดหลัก
│   ├── main.js             # JavaScript logic (Form Validation, Live Preview, DOM Manipulation)
│   └── style.css           # ไฟล์ CSS กำหนด Design System, Variables และ Responsive Grid Layout
└── evidence/               # โฟลเดอร์เก็บหลักฐานการทดสอบและเอกสารสรุปผล
    ├── README.md           # รายงานสรุปผลการทดสอบและ Reflection
    ├── desktop-view.png    # ภาพหลักฐานการแสดงผลบน Desktop (2 Columns)
    ├── mobile-view.png     # ภาพหลักฐานการแสดงผลบน Mobile (375px)
    ├── form-invalid-state.png # ภาพหลักฐานแสดง Form Validation Error
    └── form-valid-state.png   # ภาพหลักฐานแสดงการบันทึกสำเร็จและการแสดงผลพรีวิว
```

---

## 🚀 วิธีการรันโปรแกรม (How to Run)

```bash
# 1. เลือก Node version
nvm use 22

# 2. ติดตั้ง dependencies
npm install

# 3. รัน Development server
npm run dev

# 4. ตรวจสอบการทำงานไวยากรณ์ JS
npm run check

# 5. Build สำหรับ Production
npm run build

# 6. พับลิชสู่ Student Central Repository
npm run import:publish -- week-03 labs/week-03/source/dist
npm run build:pages
```

---

## 🧪 Test Cases & Results

| Test ID | Test Description | Expected Result | Result | Evidence Image |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Desktop Responsive Layout** | Grid layout displays 2 columns (Form on left, Preview on right) smoothly above 768px (`min-width: 48rem`). | **PASS** | ![Desktop View](./desktop-view.png) |
| **TC-02** | **Mobile 375px Responsive Layout** | Grid layout adjusts to single column without horizontal scroll bar (`overflow-x: hidden`). | **PASS** | ![Mobile View](./mobile-view.png) |
| **TC-03** | **Form Validation (Invalid)** | Submitting empty form displays error messages under input fields and moves focus to first invalid element. | **PASS** | ![Form Invalid](./form-invalid-state.png) |
| **TC-04** | **Live Preview & Valid Submission** | Live preview updates real-time while typing. Submitting valid form displays success message, resets form, and appends item to Submitted Requests. | **PASS** | ![Form Valid](./form-valid-state.png) |

---

## 📸 Visual Evidence (Screenshots)

### 1. Desktop View (2 Columns Layout)
![Desktop View](./desktop-view.png)

### 2. Mobile View (375px Viewport)
![Mobile View](./mobile-view.png)

### 3. Form Validation Errors (Invalid Input)
![Form Invalid State](./form-invalid-state.png)

### 4. Valid Submission & List Append
![Form Valid State](./form-valid-state.png)

---

## 💡 Reflection & Technical Learnings

1. **Responsive Web Design**:
   - ได้เรียนรู้การออกแบบด้วยเทคนิค Mobile-first โดยเริ่มต้นด้วย 1 column layout แล้วใช้ CSS Grid (`grid-template-columns: 1fr 1fr`) ร่วมกับ `@media (min-width: 48rem)` สำหรับหน้าจอขนาดใหญ่
   - การกำหนด `overflow-x: hidden` และ `min-width: 375px` ช่วยป้องกันปัญหา Horizontal scrollbar บนอุปกรณ์มือถือ

2. **Form Handling & DOM Manipulation**:
   - การจัดการ Event ใน JavaScript (`input` event สำหรับ Real-time preview และ `submit` event สำหรับ Form processing)
   - การใช้ `aria-describedby`, `aria-live="polite"` ช่วยเพิ่ม Accessibility ให้กับผู้ใช้งาน Screen reader
   - ป้องกันการเกิด XSS โดยใช้ `textContent` แทนการใส่ `innerHTML` ดิบเมื่อนำข้อมูลผู้ใช้ไป Render ใน DOM List (`#request-list`)

3. **Validation & User Experience (UX)**:
   - ปรับปรุง UX ด้วยการย้าย Focus (`firstInvalidElement.focus()`) ไปยัง Input field แรกที่ไม่ผ่าน Validation เพื่อให้ผู้ใช้แก้ไขได้ทันที
   - การล้างฟอร์ม (`form.reset()`) และคืนค่า Preview สู่สถานะเริ่มต้นหลังจากการส่งข้อมูลสำเร็จ

---

## 🤖 AI Disclosure (การเปิดเผยการใช้งาน AI)

- **AI Assistant Used:** Antigravity AI (Google DeepMind - Gemini 3.6 Flash)
- **ขอบเขตการใช้งาน:**
  1. วิเคราะห์โครงสร้าง Layout และปรับระยะห่าง Paddings/Margins ให้สมมาตรและสวยงาม
  2. ตรวจสอบการทำ Form Validation และ XSS Prevention ใน JavaScript DOM Manipulation
  3. ช่วยเรียบเรียงเอกสาร `README.md` และ `evidence/README.md` สรุป Project Structure ขั้นตอนการรัน และผลการทดสอบให้มีข้อมูลครบถ้วนตามหลักเกณฑ์
