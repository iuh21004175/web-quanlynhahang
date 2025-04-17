document.addEventListener('DOMContentLoaded', async function() {
    
    // Khởi tạo tooltips
    const tooltips = document.querySelectorAll('[data-bs-tooltip="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
    // Xử lý tìm kiếm khu vực
    const searchArea = document.getElementById('searchArea');
    searchArea.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        const areaItems = document.querySelectorAll('.list-group-item');
        
        areaItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchText) ? '' : 'none';
        });
    });

    // Xử lý chọn khu vực
    const areaItems = document.querySelectorAll('.list-group-item');
    areaItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Xóa active class từ tất cả items
            areaItems.forEach(i => i.classList.remove('active'));
            // Thêm active class cho item được chọn
            this.classList.add('active');
            
            // TODO: Lọc bàn theo khu vực
            const areaId = this.dataset.areaId;
            console.log('Selected area:', areaId);
        });
    });

    // Xử lý lọc bàn
    const statusFilter = document.getElementById('statusFilter');
    const capacityFilter = document.getElementById('capacityFilter');

    function filterTables() {
        const status = statusFilter.value;
        const capacity = capacityFilter.value;

        // TODO: Thêm logic lọc bàn
        console.log('Filter:', {status, capacity });
    }

    statusFilter.addEventListener('change', filterTables);
    capacityFilter.addEventListener('change', filterTables);

    const addTableForm = document.getElementById('addTableForm');
    const editTableForm = document.getElementById('editTableForm');
    const editTableModal = document.getElementById('editTableModal');

    // Lắng nghe sự kiện click trên nút chỉnh sửa
    document.querySelectorAll('.edit-table-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tableCard = this.closest('.table-card');
            
            // Lấy thông tin từ table card
            const tableName = tableCard.querySelector('.table-name').textContent;
            const capacity = tableCard.querySelector('.table-capacity').textContent.replace(' người', '');
            const area = tableCard.querySelector('.table-area').textContent;
            
            // Điền thông tin vào form chỉnh sửa
            document.getElementById('editTableName').value = tableName;
            document.getElementById('editCapacity').value = capacity;
            
            // Set giá trị cho select khu vực
            const areaSelect = document.getElementById('editAreaId');
            Array.from(areaSelect.options).forEach(option => {
                if (option.text === area) {
                    areaSelect.value = option.value;
                }
            });
        });
    });

    // Xử lý submit form thêm
    addTableForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        // Xử lý thêm bàn
       
    });

    // Xử lý submit form sửa
    editTableForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Xử lý sửa bàn
    });
}); 
