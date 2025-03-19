document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Xử lý form thêm nhân viên
    const addStaffForm = document.getElementById('addStaffForm');
    addStaffForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Xử lý thêm nhân viên ở đây
        const formData = new FormData(this);
        console.log('Thêm nhân viên:', Object.fromEntries(formData));
        // Đóng modal sau khi thêm
        bootstrap.Modal.getInstance(document.getElementById('addStaffModal')).hide();
        this.reset();
    });

    // Xử lý form chỉnh sửa nhân viên
    const editStaffForm = document.getElementById('editStaffForm');
    editStaffForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Xử lý cập nhật nhân viên ở đây
        const formData = new FormData(this);
        console.log('Cập nhật nhân viên:', Object.fromEntries(formData));
        // Đóng modal sau khi cập nhật
        bootstrap.Modal.getInstance(document.getElementById('editStaffModal')).hide();
    });

    // Xử lý hiển thị dữ liệu khi mở modal chỉnh sửa
    document.querySelectorAll('[data-bs-target="#editStaffModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const data = this.dataset;
            document.getElementById('editStaffId').value = data.id;
            document.getElementById('editStaffName').value = data.name;
            document.getElementById('editStaffPhone').value = data.phone;
            document.getElementById('editStaffEmail').value = data.email;
            document.getElementById('editStaffPosition').value = data.position;
            document.getElementById('editStaffStatus').value = data.status;
        });
    });
}); 