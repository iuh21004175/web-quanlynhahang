document.addEventListener('DOMContentLoaded', function() {
    
    // Khởi tạo tất cả tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Xử lý form thêm danh mục
    const addCategoryForm = document.getElementById('addCategoryForm');
    addCategoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Xử lý thêm danh mục ở đây
        const formData = new FormData(this);
        console.log('Thêm danh mục:', formData.get('categoryName'));
        // Đóng modal sau khi thêm
        bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
        this.reset();
    });

    // Xử lý form chỉnh sửa danh mục
    const editCategoryForm = document.getElementById('editCategoryForm');
    editCategoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Xử lý cập nhật danh mục ở đây
        const formData = new FormData(this);
        console.log('Cập nhật danh mục:', {
            id: formData.get('categoryId'),
            name: formData.get('categoryName')
        });
        // Đóng modal sau khi cập nhật
        bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
    });

    // Xử lý nút chỉnh sửa
    document.querySelectorAll('[data-bs-target="#editCategoryModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            document.getElementById('editCategoryId').value = id;
            document.getElementById('editCategoryName').value = name;
        });
    });

    // Xử lý nút xóa
    document.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
                const id = this.dataset.id;
                console.log('Xóa danh mục:', id);
                // Xử lý xóa danh mục ở đây
            }
        });
    });
}); 