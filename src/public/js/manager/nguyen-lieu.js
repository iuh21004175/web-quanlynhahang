document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Xử lý form thêm nguyên liệu
    const addForm = document.getElementById('addIngredientForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            fetch('/api/ingredients', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    bootstrap.Modal.getInstance(document.getElementById('addIngredientModal')).hide();
                    location.reload();
                } else {
                    alert('Có lỗi xảy ra: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi thêm nguyên liệu');
            });
        });
    }

    // Xử lý form sửa nguyên liệu
    const editForm = document.getElementById('editIngredientForm');
    if (editForm) {
        // Xử lý khi mở modal sửa
        const editModal = document.getElementById('editIngredientModal');
        editModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const id = button.getAttribute('data-id');
            
            fetch(`/api/ingredients/${id}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('editIngredientId').value = data.id;
                    document.getElementById('editIngredientName').value = data.name;
                    document.getElementById('editIngredientCategory').value = data.categoryId;
                    document.getElementById('editIngredientUnit').value = data.unit;
                    document.getElementById('currentIngredientImage').src = data.image;
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Có lỗi xảy ra khi lấy thông tin nguyên liệu');
                });
        });

        // Xử lý khi submit form sửa
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('editIngredientId').value;
            const formData = new FormData(this);

            fetch(`/api/ingredients/${id}`, {
                method: 'PUT',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    bootstrap.Modal.getInstance(document.getElementById('editIngredientModal')).hide();
                    location.reload();
                } else {
                    alert('Có lỗi xảy ra: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi cập nhật nguyên liệu');
            });

            // Cập nhật trạng thái sau khi sửa số lượng
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                updateStatus(row);
            }
        });
    }

    // Xử lý filter danh mục
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const category = this.value;
            window.location.href = `/manager/nguyen-lieu${category !== 'all' ? '?category=' + category : ''}`;
        });
    }

    // Preview ảnh khi chọn file
    const imageInputs = document.querySelectorAll('input[type="file"]');
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                const preview = this.closest('.modal-body').querySelector('img');
                if (preview) {
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            }
        });
    });

    // Thêm xử lý tìm kiếm
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const ingredientName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                if (ingredientName.includes(searchText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

// Thêm hàm xử lý trạng thái
function updateStatus(row) {
    const quantity = parseInt(row.querySelector('td:nth-child(6)').textContent);
    const statusCell = row.querySelector('td:nth-child(7)');
    let badge;

    if (quantity <= 0) {
        badge = '<span class="badge bg-danger">Hết hàng</span>';
    } else if (quantity <= 5) {
        badge = '<span class="badge bg-warning text-dark">Sắp hết</span>';
    } else {
        badge = '<span class="badge bg-success">Còn hàng</span>';
    }

    statusCell.innerHTML = badge;
} 