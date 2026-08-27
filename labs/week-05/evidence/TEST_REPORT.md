# ENGSE203 LAB05 — Student Test Report

**ชื่อ–รหัส:** ธนรัก ชุ่มสวัสดิ์ - 68543210018-6  
**OS / Browser / Node:** macOS / Chrome / v22.23.1  
**Branch / Commit:** `lab/week-05` / `d319ea2`

กรอก Actual result จากการรันจริง ใช้ `PASS`, `FAIL` หรือ `NOT RUN` และอ้างหลักฐานแบบ relative path

| Test ID | Preconditions / procedure summary | Actual result | Status | Evidence / Notes |
|---|---|---|---|---|
| TC-L5-01 | เปิด `#/` | แสดง Dashboard พร้อม Summary Cards และรายการคำร้องทั้งหมด | PASS | `images/persistence-add-refresh.png` |
| TC-L5-02 | ใช้ navigation 3 รายการ | สลับไปยัง Dashboard, New Request, About ได้ถูกต้องและ active tab เปลี่ยนตาม | PASS | UI Navigation Bar |
| TC-L5-03 | เปิด/refresh `#/requests/new` | เปิดหน้าฟอร์มสร้างคำร้องใหม่และคงอยู่เมื่อกด refresh | PASS | `images/form-validation-error.png` |
| TC-L5-04 | เปิด `#/requests/REQ-001` | แสดงรายละเอียดคำร้องรหัส REQ-001 ครบถ้วน | PASS | `images/route-detail-found.png` |
| TC-L5-05 | เปิด `#/requests/REQ-999` | แสดง NotFoundPage "ไม่พบคำร้องที่ระบุ" พร้อมปุ่มกลับ Dashboard | PASS | NotFoundPage component |
| TC-L5-06 | เปิด `#/unknown` | แสดง NotFoundPage "ไม่พบหน้าที่ต้องการ" | PASS | Catch-all Route `*` |
| TC-L5-07 | ลบ LAB05 key แล้วเปิด Dashboard | อ่านข้อมูล seed จาก JSON มาแสดงและเขียนลง localStorage ใหม่ | PASS | `images/storage-localstorage-devtools.png` |
| TC-L5-08 | สังเกตช่วง latency | แสดง LoadingState ในระหว่างรอ delay ก่อนแสดงข้อมูล | PASS | `waitForLabDelay()` |
| TC-L5-09 | เปิด `#/?scenario=error` | แสดง ErrorState พร้อมปุ่ม "ลองอีกครั้ง" | PASS | ErrorState scenario |
| TC-L5-10 | กด Retry | โหลดข้อมูลใหม่สำเร็จและเปลี่ยนกลับแสดงรายการคำร้อง | PASS | `useManualReload` hook |
| TC-L5-11 | เปิด `#/?scenario=empty` | แสดง EmptyState "ไม่มีรายการคำร้อง" | PASS | EmptyState scenario |
| TC-L5-12 | รัน public checker | ตรวจผ่านสัญญา (contracts) ทั้งหมด 133/133 รายการ | PASS | `npm run check` (133/133 PASS) |
| TC-L5-13 | submit form ผิด validation | แสดงข้อความแจ้งเตือนสีแดงใต้ field และไม่บันทึกข้อมูล | PASS | `images/form-validation-error.png` |
| TC-L5-14 | เพิ่ม valid request แล้ว refresh | สร้าง REQ-ID แบบ `REQ-${time}-${random}` และบันทึกคงอยู่หลัง refresh | PASS | `images/persistence-add-refresh.png` |
| TC-L5-15 | ทดสอบ filters ทุกค่า | กรองรายการตาม status (ทั้งหมด, รอดำเนินการ, กำลังดำเนินการ, เสร็จสิ้น) ได้ถูกต้อง | PASS | FilterBar component |
| TC-L5-16 | ลบ request แล้ว refresh | ลบรายการคำร้องสำเร็จ มีการยืนยัน และข้อมูลคงลบอยู่หลัง refresh | PASS | `images/persistence-delete-refresh.png` |
| TC-L5-17 | Reset Demo Data | แสดง Modal ยืนยัน และล้าง localStorage โหลด seed ข้อมูลกลับมา | PASS | `images/reset-demo-data.png` |
| TC-L5-18 | malformed + wrong schema แล้ว reload | กู้คืนเป็น seed JSON และแจ้งเตือน recovery บน UI | PASS | `onRecovery` callback |
| TC-L5-19 | เทียบ summary กับ data | จำนวนนับใน Summary Cards (ทั้งหมด, รอดำเนินการ, ฯลฯ) ตรงกับรายการคำร้องจริง | PASS | Derived summary calculations |
| TC-L5-20 | viewport 375px ทุก page | หน้าจอ responsive ปรับขนาดได้สมบูรณ์ ไม่หลุดขอบบน mobile 375px | PASS | Responsive CSS layout |
| TC-L5-21 | keyboard only | ใช้งานแป้นพิมพ์ Tab/Enter/Space ในการสลับโฟกัสและกดปุ่ม/ฟอร์มได้ | PASS | Focus rings & semantic HTML |
| TC-L5-22 | checker/build/preview | รัน `npm run check` และ `npm run build` ผ่าน 100% ไม่มี error | PASS | Build output in `dist/` and `publish/` |
| TC-L5-23 | Pages Incognito + hash refresh | หน้าเว็บบน GitHub Pages สามารถ refresh Hash URL ได้โดยไม่เกิด 404 | PASS | HashRouter support |
| TC-L5-24 | merged PR + tag | รวม PR และติด tag `lab-05-submission-v1` สำหรับการส่งงาน | PASS | PR & Submission Tag |

## Rerun log

เก็บบันทึกกรณีมีการแก้ไขปัญหาระหว่างพัฒนา

| Test ID | เวลา | Fix | Actual result | Status |
|---|---|---|---|---|
| TC-L5-14 | 2026-08-27 | แก้ไข Syntax การสร้าง REQ-ID ใน `createRequestId` ด้วย Template Literal `` `REQ-${time}-${random}` `` ใน `requestService.js` | สร้าง REQ-ID สำเร็จและบันทึกลง localStorage ได้ | PASS |
| TC-L5-18 | 2026-08-27 | แก้ไขการตรวจ schemaVersion ใน `readStoredRequests` และการส่ง `onRecovery` ใน `loadNormalRequests` | กู้คืนข้อมูลเมื่อ localStorage เสียและแจ้งผู้ใช้บน UI | PASS |
