document.addEventListener('DOMContentLoaded', function() {
    // Set ngày mặc định cho form tìm kiếm
    setDefaultDates();

    // Khởi tạo tooltips
    const tooltips = document.querySelectorAll('[data-bs-tooltip="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Xử lý khi mở modal tạo phiếu xuất
    const addExportModal = document.getElementById('addExportModal');
    addExportModal.addEventListener('show.bs.modal', function() {
        // Set ngày giờ hiện tại cho input ngày xuất
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        document.querySelector('input[name="exportDate"]').value = currentDateTime;
    });

    // ... code khác giữ nguyên ...

    // Cập nhật xử lý tìm kiếm
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchData = {
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            exportCode: document.getElementById('searchExportCode').value,
            staff: document.getElementById('searchStaff').value // Đổi từ searchIngredient thành searchStaff
        };

        // TODO: Xử lý tìm kiếm với dữ liệu mới
        console.log('Search data:', searchData);
    });
});

// Hàm set ngày mặc định
function setDefaultDates() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Set giá trị cho input date
    document.getElementById('startDate').value = formatDate(sevenDaysAgo);
    document.getElementById('endDate').value = formatDate(today);

    // Set max date cho cả hai input là ngày hiện tại
    const maxDate = formatDate(today);
    document.getElementById('startDate').setAttribute('max', maxDate);
    document.getElementById('endDate').setAttribute('max', maxDate);

    // Đảm bảo ngày bắt đầu không thể sau ngày kết thúc
    document.getElementById('startDate').addEventListener('change', function() {
        document.getElementById('endDate').setAttribute('min', this.value);
    });

    // Đảm bảo ngày kết thúc không thể trước ngày bắt đầu
    document.getElementById('endDate').addEventListener('change', function() {
        document.getElementById('startDate').setAttribute('max', this.value);
    });
}

// Xử lý reset form tìm kiếm
document.getElementById('searchForm').addEventListener('reset', function() {
    setTimeout(() => {
        setDefaultDates();
    }, 0);
}); 