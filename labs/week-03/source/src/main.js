document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("request-form");
  const nameInput = document.getElementById("requester-name");
  const typeSelect = document.getElementById("request-type");
  const detailsTextarea = document.getElementById("request-details");

  const previewName = document.getElementById("preview-name");
  const previewType = document.getElementById("preview-type");
  const previewDetails = document.getElementById("preview-details");

  const requestList = document.getElementById("request-list");
  const formStatus = document.getElementById("form-status");

  const nameError = document.getElementById("name-error");
  const typeError = document.getElementById("type-error");
  const detailsError = document.getElementById("details-error");

  // Live Preview Event
  const updatePreview = () => {
    previewName.textContent = nameInput.value.trim() || "ยังไม่ระบุชื่อ";
    previewType.textContent = typeSelect.value || "ยังไม่เลือกประเภท";
    previewDetails.textContent = detailsTextarea.value.trim() || "ยังไม่มีรายละเอียด";
  };

  nameInput.addEventListener("input", updatePreview);
  typeSelect.addEventListener("input", updatePreview);
  detailsTextarea.addEventListener("input", updatePreview);

  // Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Reset error messages and success status
    nameError.textContent = "";
    typeError.textContent = "";
    detailsError.textContent = "";
    formStatus.textContent = "";
    
    let isValid = true;
    let firstInvalidElement = null;

    // Basic Validation
    if (!nameInput.value.trim()) {
      nameError.textContent = "กรุณาระบุชื่อผู้แจ้ง";
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = nameInput;
    }

    if (!typeSelect.value) {
      typeError.textContent = "กรุณาเลือกประเภทการแจ้ง";
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = typeSelect;
    }

    if (!detailsTextarea.value.trim()) {
      detailsError.textContent = "กรุณาระบุรายละเอียดเพิ่มเติม";
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = detailsTextarea;
    }

    // กรณีที่ Invalid: ไม่เพิ่มรายการ, ไม่ Reset Form และนำ Focus ไปยัง Input ที่ผิดพลาดจุดแรก
    if (!isValid) {
      firstInvalidElement.focus();
      return; 
    }

    // กรณีที่ Valid: เพิ่มรายการเข้า DOM ด้วย textContent ป้องกัน XSS
    const listItem = document.createElement("li");
    
    const titleStrong = document.createElement("strong");
    titleStrong.textContent = `${nameInput.value.trim()} - ${typeSelect.value}`;
    
    const descP = document.createElement("p");
    descP.textContent = detailsTextarea.value.trim();
    
    listItem.appendChild(titleStrong);
    listItem.appendChild(descP);
    requestList.appendChild(listItem);

    // แสดงข้อความสำเร็จ
    formStatus.textContent = "บันทึกข้อมูลสำเร็จ!";

    // Reset ฟอร์มและพรีวิว
    form.reset();
    updatePreview();
  });
});