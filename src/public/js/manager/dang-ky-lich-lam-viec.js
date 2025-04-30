document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('shiftTableBody');
  const form = document.getElementById('shiftRegistrationForm');
  const submitButton = form.querySelector('button[type="submit"]');

  // Hàm lấy thứ Hai của tuần mới (luôn lấy tuần kế tiếp sau Chủ Nhật tuần này)
  // Hàm tính ngày thứ 2 tiếp theo
const getNextMonday = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = (day === 0) ? 1 : (8 - day); // Nếu Chủ Nhật thì diff=1, còn lại 8 - day
  today.setDate(today.getDate() + diff);
  today.setHours(0, 0, 0, 0);
  return today;
};

// Hàm tính số tuần trong năm (tuần bắt đầu từ thứ 2 đầu tiên của năm)
function getCustomWeekNumber(date) {
  const year = date.getFullYear();
  const firstMonday = getFirstMondayOfYear(year);
  const diffTime = date.getTime() - firstMonday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

// Hàm lấy ngày thứ 2 đầu tiên của năm
function getFirstMondayOfYear(year) {
  const jan1 = new Date(year, 0, 1);
  const day = jan1.getDay();
  const diff = (day === 0 ? 1 : 8 - day);
  jan1.setDate(jan1.getDate() + diff);
  return jan1;
}


  // Tính ngày Chủ Nhật tuần hiện tại
  const now = new Date();
  const daysToSunday = (7 - now.getDay()) % 7;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysToSunday);
  sunday.setHours(23, 59, 59, 999); // Chủ Nhật 23h59p59s

  // Tạo thông báo hạn đăng ký
  const deadlineNotice = document.createElement('div');
  deadlineNotice.style.background = '#e0f7fa';
  deadlineNotice.style.border = '1px solid #b2ebf2';
  deadlineNotice.style.padding = '6px 12px';
  deadlineNotice.style.borderRadius = '4px';
  deadlineNotice.style.fontSize = '14px';
  deadlineNotice.style.color = '#004d40';
  deadlineNotice.style.marginBottom = '10px';
  deadlineNotice.style.textAlign = 'center';

  if (now > sunday) {
    deadlineNotice.innerHTML = `❌ Đã quá hạn đăng ký (Chủ Nhật, ${sunday.toLocaleDateString('vi-VN')})`;
    submitButton.disabled = true;
  } else {
    deadlineNotice.innerHTML = `📅 Hạn đăng ký là Chủ Nhật, ${sunday.toLocaleDateString('vi-VN')}`;
  }

  form.insertBefore(deadlineNotice, form.firstChild);

  // Render bảng trống tuần mới
  const renderTable = () => {
    const startDate = getNextMonday();
    tbody.innerHTML = '';
    const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const formattedDate = date.toLocaleDateString('vi-VN');
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><strong>${daysOfWeek[i]}</strong><br><small>${formattedDate}</small></td>
        <td><input type="checkbox" name="shifts[${i}][morning]" value="1" data-shift="0"></td>
        <td><input type="checkbox" name="shifts[${i}][afternoon]" value="2" data-shift="1"></td>
      `;
      tbody.appendChild(tr);
    }
  };

  // Render bảng lịch đã đăng ký
  const renderLichLamViec = (data) => {
    const startDate = getNextMonday();
    const daysOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    const formatDate = date => date.toLocaleDateString('sv-SE');

    tbody.innerHTML = '';

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const ngayStr = formatDate(date);
      const formattedDate = date.toLocaleDateString('vi-VN');

      const hasMorning = data.some(item => item.ngay === ngayStr && item.caLamViec === 0);
      const hasAfternoon = data.some(item => item.ngay === ngayStr && item.caLamViec === 1);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${daysOfWeek[i]}</strong><br><small>${formattedDate}</small></td>
        <td><input type="checkbox" name="shifts[${i}][morning]" value="1" data-shift="0" ${hasMorning ? 'checked' : ''}></td>
        <td><input type="checkbox" name="shifts[${i}][afternoon]" value="2" data-shift="1" ${hasAfternoon ? 'checked' : ''}></td>
      `;
      tbody.appendChild(tr);
    }
  };

  // Lấy lịch làm việc từ server và lọc tuần hiện tại
  async function getAPILichLamViec() {
    const response = await fetch('/api/lich-lam-viec');
    try {
      const data = await response.json();
      if (data.status) {
        const startDate = getNextMonday(); 
        const currentWeek = getCustomWeekNumber(startDate); 
        const filteredList = data.list.filter(item => item.tuan === currentWeek);
        return filteredList;
      } else {
        console.error('Lỗi server:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Load dữ liệu khi vào trang
  getAPILichLamViec().then(data => {
    if (data && data.length > 0) {
      renderLichLamViec(data);
    } else {
      renderTable();
    }
  });

  // Xử lý submit đăng ký
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const shifts = [];
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
      alert('Vui lòng chọn ít nhất một ca làm việc!');
      return;
    }

    checkboxes.forEach(checkbox => {
      const nameParts = checkbox.name.match(/\[(\d)\]\[(\w+)\]/);
      if (nameParts) {
        const dayIndex = parseInt(nameParts[1]);
        const shiftType = nameParts[2];
        const shiftValue = shiftType === 'morning' ? 0 : 1;

        const date = new Date(getNextMonday());
        date.setDate(date.getDate() + dayIndex);

        const formattedDate = date.toLocaleDateString('sv-SE');

        shifts.push({
          ngay: formattedDate,
          tuan: getCustomWeekNumber(date),
          caLamViec: shiftValue,
          trangThai: 0
        });
      }
    });

    try {
      const response = await fetch('/api/them-lich-lam-viec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shifts })
      });

      const result = await response.json();
      console.log("Kết quả phản hồi từ server: ", result);

      if (result.status === false) {
        alert(`Đăng ký thất bại: ${result.error || 'Lỗi không xác định'}`);
      } else {
        alert('Đăng ký thành công!');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu.');
    }
  });

});
