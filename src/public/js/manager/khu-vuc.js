document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tooltips
    const tooltips = document.querySelectorAll('[data-bs-tooltip="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Xử lý form thêm khu vực
    document.getElementById('addAreaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // TODO: Xử lý thêm khu vực
        console.log('Submit form thêm khu vực');
    });

    // Xử lý form chỉnh sửa khu vực
    document.getElementById('editAreaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // TODO: Xử lý chỉnh sửa khu vực
        console.log('Submit form chỉnh sửa khu vực');
    });

    // Xử lý nút xóa
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn xóa khu vực này?')) {
                // TODO: Xử lý xóa khu vực
                console.log('Xóa khu vực');
            }
        });
    });

    // Xử lý khi mở modal chỉnh sửa
    const editAreaModal = document.getElementById('editAreaModal');
    editAreaModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        // TODO: Lấy thông tin khu vực và điền vào form
        console.log('Mở modal chỉnh sửa');
    });
}); 