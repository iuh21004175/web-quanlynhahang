document.addEventListener('DOMContentLoaded', function() {
    // Ẩn các nguyên liệu hết hàng ngay khi trang load
    hideOutOfStockItems();

    // Xử lý tìm kiếm
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase().trim();
            const rows = document.querySelectorAll('tbody tr:not(.table-light)');
            
            rows.forEach(row => {
                // Bỏ qua các dòng hết hàng
                if (row.querySelector('.badge.bg-danger')) {
                    row.style.display = 'none';
                    return;
                }

                const code = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                if (code.includes(searchText) || name.includes(searchText)) {
                    row.style.display = '';
                    showCategoryHeader(row);
                } else {
                    row.style.display = 'none';
                }
            });

            updateCategoryHeaders();
        });
    }

    // Xử lý filter danh mục
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const rows = document.querySelectorAll('tbody tr');

            rows.forEach(row => {
                // Bỏ qua các dòng hết hàng
                if (!row.classList.contains('table-light') && row.querySelector('.badge.bg-danger')) {
                    row.style.display = 'none';
                    return;
                }

                if (row.classList.contains('table-light')) {
                    // Xử lý header danh mục
                    const categoryName = row.querySelector('td').textContent.trim();
                    row.style.display = selectedCategory === 'all' || categoryName.includes(selectedCategory) ? '' : 'none';
                } else {
                    // Xử lý dòng dữ liệu
                    const category = row.querySelector('td:nth-child(3)').textContent;
                    row.style.display = selectedCategory === 'all' || category.includes(selectedCategory) ? '' : 'none';
                }
            });

            updateCategoryHeaders();
        });
    }

    // Hàm ẩn các nguyên liệu hết hàng
    function hideOutOfStockItems() {
        const rows = document.querySelectorAll('tbody tr:not(.table-light)');
        rows.forEach(row => {
            if (row.querySelector('.badge.bg-danger')) {
                row.style.display = 'none';
            }
        });
        updateCategoryHeaders();
    }

    // Hàm hiển thị header danh mục
    function showCategoryHeader(row) {
        const prevHeader = row.previousElementSibling;
        if (prevHeader && prevHeader.classList.contains('table-light')) {
            prevHeader.style.display = '';
        }
    }

    // Hàm cập nhật hiển thị của các header danh mục
    function updateCategoryHeaders() {
        document.querySelectorAll('.category-header').forEach(header => {
            let nextRow = header.nextElementSibling;
            let hasVisibleItems = false;
            while (nextRow && !nextRow.classList.contains('table-light')) {
                if (nextRow.style.display !== 'none') {
                    hasVisibleItems = true;
                    break;
                }
                nextRow = nextRow.nextElementSibling;
            }
            header.style.display = hasVisibleItems ? '' : 'none';
        });
    }
}); 