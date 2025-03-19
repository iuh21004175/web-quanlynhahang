document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tất cả tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Xử lý lọc theo danh mục
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', function() {
        const selectedCategory = this.value;
        // Thực hiện lọc dữ liệu theo danh mục
        filterFoodsByCategory(selectedCategory);
    });

    // Xử lý form thêm món ăn
    const addFoodForm = document.getElementById('addFoodForm');
    addFoodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Xử lý thêm món ăn ở đây
        const formData = new FormData(this);
        console.log('Thêm món ăn:', Object.fromEntries(formData));
        // Đóng modal sau khi thêm
        bootstrap.Modal.getInstance(document.getElementById('addFoodModal')).hide();
        this.reset();
    });

    // Xử lý form chỉnh sửa món ăn
    const editFoodForm = document.getElementById('editFoodForm');
    editFoodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Xử lý cập nhật món ăn ở đây
        const formData = new FormData(this);
        console.log('Cập nhật món ăn:', Object.fromEntries(formData));
        // Đóng modal sau khi cập nhật
        bootstrap.Modal.getInstance(document.getElementById('editFoodModal')).hide();
    });

    // Xử lý hiển thị dữ liệu khi mở modal chỉnh sửa
    document.querySelectorAll('[data-bs-target="#editFoodModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const data = this.dataset;
            document.getElementById('editFoodId').value = data.id;
            document.getElementById('editFoodName').value = data.name;
            document.getElementById('editFoodCategory').value = data.category;
            document.getElementById('editFoodPrice').value = data.price;
            document.getElementById('currentFoodImage').src = data.image;
        });
    });

    // Xử lý hiển thị chi tiết món ăn
    document.querySelectorAll('[data-bs-target="#viewFoodModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const data = this.dataset;
            document.getElementById('viewFoodImage').src = data.image;
            document.getElementById('viewFoodName').textContent = data.name;
            document.getElementById('viewFoodCategory').textContent = data.category;
            document.getElementById('viewFoodPrice').textContent = parseInt(data.price).toLocaleString('vi-VN') + 'đ';
            document.getElementById('viewFoodDescription').textContent = data.description;

            // Hiển thị danh sách nguyên liệu
            const ingredients = JSON.parse(data.ingredients); // Giả sử data.ingredients là một mảng JSON
            const tbody = document.getElementById('viewFoodIngredients');
            tbody.innerHTML = ''; // Xóa dữ liệu cũ

            ingredients.forEach((item, index) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.amount}</td>
                        <td>${item.unit}</td>
                    </tr>
                `;
            });
        });
    });
});

// Hàm lọc món ăn theo danh mục
function filterFoodsByCategory(categoryId) {
    // Thực hiện AJAX request hoặc lọc dữ liệu trên client
    console.log('Lọc theo danh mục:', categoryId);
} 