document.addEventListener('DOMContentLoaded', function() {
    // Thiết lập ngày mặc định cho bộ lọc
    setDefaultDates();

    // Khởi tạo tooltips
    const tooltips = document.querySelectorAll('[data-bs-tooltip="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Xử lý lọc theo ngày
    document.getElementById('filterDate').addEventListener('click', function() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        // TODO: Thêm logic lọc dữ liệu theo ngày
        console.log('Lọc từ ngày:', startDate, 'đến ngày:', endDate);
    });

    // Xử lý in phiếu
    document.getElementById('printReceipt').addEventListener('click', function() {
        window.print();
    });

    // Xử lý hiển thị chi tiết phiếu nhập
    const viewReceiptModal = document.getElementById('viewReceiptModal');
    viewReceiptModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const receiptId = button.getAttribute('data-receipt-id');
        
        // TODO: Thêm logic lấy dữ liệu chi tiết phiếu nhập
        console.log('Lấy chi tiết phiếu nhập:', receiptId);
    });

    // Xử lý thêm hàng nguyên liệu mới
    document.getElementById('addIngredientRow').addEventListener('click', function() {
        const tbody = document.querySelector('#ingredientTable tbody');
        const newRow = tbody.querySelector('.ingredient-row').cloneNode(true);
        
        // Reset các giá trị
        newRow.querySelectorAll('input, select').forEach(input => {
            input.value = '';
            if (input.classList.contains('unit-input')) {
                input.style.display = 'none';
            }
        });
        
        // Cập nhật STT
        const rowCount = tbody.children.length + 1;
        newRow.querySelector('td').textContent = rowCount;
        
        // Gắn lại các event listeners
        attachRowEventListeners(newRow);
        
        tbody.appendChild(newRow);
    });

    // Xử lý tính toán thành tiền và tổng tiền
    function calculateAmount(row) {
        const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
        const price = parseFloat(row.querySelector('.price-input').value) || 0;
        const amount = quantity * price;
        row.querySelector('.amount-cell').textContent = formatCurrency(amount);
        calculateTotal();
    }

    function calculateTotal() {
        const amounts = Array.from(document.querySelectorAll('.amount-cell'))
            .map(cell => parseFloat(cell.textContent.replace(/[^\d]/g, '')) || 0);
        const total = amounts.reduce((sum, amount) => sum + amount, 0);
        document.getElementById('totalAmount').textContent = formatCurrency(total);
    }

    function attachRowEventListeners(row) {
        // Thêm xử lý đơn vị
        attachUnitEventListener(row);

        // Xử lý xóa hàng
        row.querySelector('.remove-row').addEventListener('click', function() {
            if (document.querySelectorAll('.ingredient-row').length > 1) {
                row.remove();
                updateRowNumbers();
                calculateTotal();
            }
        });

        // Xử lý thay đổi số lượng và đơn giá
        row.querySelector('.quantity-input').addEventListener('input', () => calculateAmount(row));
        row.querySelector('.price-input').addEventListener('input', () => calculateAmount(row));

        // Xử lý thay đổi nguyên liệu
        row.querySelector('.ingredient-select').addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            row.querySelector('.unit-cell').textContent = selectedOption.dataset.unit || '';
        });
    }

    function updateRowNumbers() {
        document.querySelectorAll('.ingredient-row').forEach((row, index) => {
            row.querySelector('td').textContent = index + 1;
        });
    }

    // Xử lý submit form
    document.getElementById('addReceiptForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // TODO: Thêm logic gửi dữ liệu lên server
        console.log('Submit form tạo phiếu nhập');
    });

    // Khởi tạo các event listeners cho hàng đầu tiên
    document.querySelectorAll('.ingredient-row').forEach(row => {
        attachRowEventListeners(row);
    });

    // Xử lý khi mở modal tạo phiếu nhập
    const addReceiptModal = document.getElementById('addReceiptModal');
    addReceiptModal.addEventListener('show.bs.modal', function() {
        // Format ngày giờ hiện tại thành YYYY-MM-DDThh:mm
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        
        // Set giá trị cho input ngày nhập kho
        document.querySelector('input[name="receiptDate"]').value = currentDateTime;
    });

    // Xử lý form tìm kiếm
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchData = {
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            supplier: document.getElementById('searchSupplier').value,
            receiptCode: document.getElementById('searchReceiptCode').value,
            minAmount: document.getElementById('minAmount').value,
            maxAmount: document.getElementById('maxAmount').value
        };

        // TODO: Thực hiện tìm kiếm với dữ liệu
        console.log('Search data:', searchData);
    });

    // Xử lý reset form
    searchForm.addEventListener('reset', function() {
        setTimeout(() => {
            // TODO: Reset kết quả tìm kiếm về mặc định
            console.log('Form has been reset');
        }, 0);
    });
});

// Hàm thiết lập ngày mặc định
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

    // Set values for date inputs
    document.getElementById('startDate').value = formatDate(sevenDaysAgo);
    document.getElementById('endDate').value = formatDate(today);

    // Set max date for both inputs to today
    const maxDate = formatDate(today);
    document.getElementById('startDate').setAttribute('max', maxDate);
    document.getElementById('endDate').setAttribute('max', maxDate);

    // Ensure end date can't be before start date
    document.getElementById('startDate').addEventListener('change', function() {
        document.getElementById('endDate').setAttribute('min', this.value);
    });

    // Ensure start date can't be after end date
    document.getElementById('endDate').addEventListener('change', function() {
        document.getElementById('startDate').setAttribute('max', this.value);
    });
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Thêm xử lý cho đơn vị tính
function attachUnitEventListener(row) {
    const unitSelect = row.querySelector('.unit-select');
    const unitInput = row.querySelector('.unit-input');

    unitSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            unitInput.style.display = 'block';
            unitInput.required = true;
            unitSelect.style.width = '100px';
        } else {
            unitInput.style.display = 'none';
            unitInput.required = false;
            unitInput.value = '';
            unitSelect.style.width = '100%';
        }
    });
} 