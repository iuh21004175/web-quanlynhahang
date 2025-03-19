document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Xử lý form thêm danh mục
    const addForm = document.getElementById('addCategoryForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Xử lý thêm danh mục
        });
    }

    // Xử lý form sửa danh mục
    const editForm = document.getElementById('editCategoryForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Xử lý sửa danh mục
        });
    }

    // Xử lý nút xóa
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
                // Xử lý xóa danh mục
            }
        });
    });
}); 