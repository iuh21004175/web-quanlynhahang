// Hiển thị/ẩn nút Xem chi tiết tùy thuộc vào trạng thái bàn
function updateTableActionButtons() {
    // Lấy tất cả các card bàn
    document.querySelectorAll('.table-card').forEach(tableCard => {
        const statusElement = tableCard.querySelector('.table-status');
        const viewOrderBtn = tableCard.querySelector('.view-order-btn');
        
        // Kiểm tra xem bàn có đang sử dụng không
        const isOccupied = statusElement.classList.contains('occupied');
        
        // Hiển thị nút xem chi tiết nếu bàn đang sử dụng
        if (viewOrderBtn) {
            viewOrderBtn.style.display = isOccupied ? 'inline-block' : 'none';
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo ứng dụng
    initializeApp();
    const viewOrderModal = document.getElementById('viewOrderModal');
    if (viewOrderModal) {
        viewOrderModal.addEventListener('show.bs.modal', function(event) {
            // Lấy nút đã kích hoạt modal
            const button = event.relatedTarget;
            
            // Lấy thông tin bàn từ thuộc tính data
            const tableId = button.getAttribute('data-table-id');
            
            // Lấy tên bàn từ card bàn
            const tableCard = button.closest('.table-card');
            const tableName = tableCard.querySelector('.table-name').textContent;
            
            // Cập nhật tiêu đề modal
            document.getElementById('orderTableName').textContent = tableName;
            
            // Trong thực tế, bạn sẽ gọi API để lấy thông tin đơn hàng dựa trên tableId
            // fetchOrderDetails(tableId).then(data => updateOrderModal(data));
            
            // Mã giả để mô phỏng việc lấy dữ liệu
            console.log(`Lấy thông tin đơn hàng cho bàn ${tableId}: ${tableName}`);
        });
    }
    
    // Khởi tạo tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Cập nhật trạng thái các nút khi trang được tải
    updateTableActionButtons();
});

/**
 * Khởi tạo toàn bộ ứng dụng
 */
function initializeApp() {
    // Khởi tạo bộ lọc và sự kiện
    initializeFilters();
    
    // Cập nhật dữ liệu tổng quan ban đầu
    updateSummaryData();
    
    // Khởi tạo biểu đồ
    initializeCharts();
    
    // Thêm sự kiện cho nút Áp dụng
    const applyFilterBtn = document.getElementById('applyFilter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Thêm sự kiện cho nút Xuất báo cáo
    const exportReportBtn = document.getElementById('exportReport');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            exportReport();
        });
    }
}

/**
 * Khởi tạo bộ lọc và các sự kiện liên quan
 */
function initializeFilters() {
    const timeFilter = document.getElementById('timeFilter');
    const dayFilterGroup = document.getElementById('dayFilterGroup');
    const monthFilterGroup = document.getElementById('monthFilterGroup');
    const yearFilterGroup = document.getElementById('yearFilterGroup');
    const categoryFilter = document.getElementById('categoryFilter');

    // Khởi tạo giá trị mặc định
    if (dayFilterGroup) {
        const today = new Date().toISOString().split('T')[0];
        const dayFilter = document.getElementById('dayFilter');
        if (dayFilter) dayFilter.value = today;
    }

    // Hiển thị bộ lọc phù hợp với lựa chọn
    if (timeFilter) {
        // Khởi tạo hiển thị ban đầu
        showRelevantDateFilter(timeFilter.value);
        
        // Thêm event listener cho sự kiện thay đổi
        timeFilter.addEventListener('change', function() {
            showRelevantDateFilter(this.value);
        });
    }
    
    // Thêm dữ liệu cho bộ lọc danh mục
    if (categoryFilter) {
        populateCategoryFilter();
    }
}

/**
 * Hiển thị bộ lọc thời gian phù hợp dựa trên lựa chọn
 */
function showRelevantDateFilter(timeFilterValue) {
    const dayFilterGroup = document.getElementById('dayFilterGroup');
    const monthFilterGroup = document.getElementById('monthFilterGroup');
    const yearFilterGroup = document.getElementById('yearFilterGroup');
    
    // Ẩn tất cả các nhóm bộ lọc
    if (dayFilterGroup) dayFilterGroup.style.display = 'none';
    if (monthFilterGroup) monthFilterGroup.style.display = 'none';
    if (yearFilterGroup) yearFilterGroup.style.display = 'none';
    
    // Hiển thị bộ lọc thích hợp
    switch(timeFilterValue) {
        case 'day':
            if (dayFilterGroup) dayFilterGroup.style.display = 'block';
            break;
        case 'month':
            if (monthFilterGroup) monthFilterGroup.style.display = 'block';
            break;
        case 'year':
            if (yearFilterGroup) yearFilterGroup.style.display = 'block';
            break;
    }
}

/**
 * Điền dữ liệu cho bộ lọc danh mục
 */
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
    const categories = [
        { id: 'all', name: 'Tất cả danh mục' },
        { id: 'main', name: 'Món chính' },
        { id: 'appetizer', name: 'Khai vị' },
        { id: 'dessert', name: 'Tráng miệng' },
        { id: 'drink', name: 'Đồ uống' }
    ];
    
    // Xóa tất cả các option hiện tại
    categoryFilter.innerHTML = '';
    
    // Thêm các option mới
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

/**
 * Áp dụng bộ lọc và tải lại dữ liệu
 */
function applyFilters() {
    // Hiển thị hiệu ứng loading
    showLoading(true);
    
    // Lấy giá trị bộ lọc
    const timeFilter = document.getElementById('timeFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    let dateValue;
    switch(timeFilter) {
        case 'day':
            dateValue = document.getElementById('dayFilter').value;
            break;
        case 'month':
            const monthFilter = document.getElementById('monthFilter');
            dateValue = monthFilter ? monthFilter.value : null;
            break;
        case 'year':
            const yearFilter = document.getElementById('yearFilter');
            dateValue = yearFilter ? yearFilter.value : null;
            break;
    }
    
    console.log(`Áp dụng bộ lọc: Thời gian=${timeFilter}, Ngày=${dateValue}, Danh mục=${categoryFilter}`);
    
    // Trong thực tế, đây sẽ là API call để lấy dữ liệu theo bộ lọc
    // Giả lập việc tải dữ liệu với setTimeout
    setTimeout(() => {
        // Cập nhật dữ liệu tổng quan
        updateSummaryData();
        
        // Cập nhật biểu đồ
        updateCharts(timeFilter, dateValue, categoryFilter);
        
        // Cập nhật bảng dữ liệu chi tiết
        updateDetailTable(timeFilter, dateValue, categoryFilter);
        
        // Ẩn hiệu ứng loading
        showLoading(false);
        
        // Hiển thị thông báo
        showNotification('Dữ liệu đã được cập nhật', 'success');
    }, 800);
}

/**
 * Hiển thị hoặc ẩn hiệu ứng loading
 */
function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Hiển thị thông báo
 */
function showNotification(message, type = 'info') {
    // Tạo thông báo toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    const flexDiv = document.createElement('div');
    flexDiv.className = 'd-flex';
    
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');
    
    flexDiv.appendChild(toastBody);
    flexDiv.appendChild(closeButton);
    toast.appendChild(flexDiv);
    
    // Thêm toast vào container
    const toastContainer = document.getElementById('toastContainer');
    if (toastContainer) {
        toastContainer.appendChild(toast);
        
        // Hiển thị toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Xóa toast khỏi DOM sau khi nó biến mất
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    } else {
        console.log(message);
    }
}

/**
 * Cập nhật dữ liệu tổng quan
 */
function updateSummaryData() {
    // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
    const summaryData = {
        totalRevenue: '25,500,000đ',
        revenueGrowth: 15,
        totalOrders: '125 đơn',
        orderGrowth: 8,
        averageOrderValue: '204,000đ',
        avgOrderGrowth: 5
    };
    
    // Cập nhật UI với dữ liệu thống kê
    const totalRevenueEl = document.getElementById('totalRevenue');
    const revenueGrowthEl = document.getElementById('revenueGrowth');
    const totalOrdersEl = document.getElementById('totalOrders');
    const orderGrowthEl = document.getElementById('orderGrowth');
    const averageOrderValueEl = document.getElementById('averageOrderValue');
    const avgOrderGrowthEl = document.getElementById('avgOrderGrowth');
    
    if (totalRevenueEl) totalRevenueEl.textContent = summaryData.totalRevenue;
    if (revenueGrowthEl) {
        revenueGrowthEl.textContent = `${summaryData.revenueGrowth}% so với kỳ trước`;
        revenueGrowthEl.className = summaryData.revenueGrowth >= 0 ? 'text-success' : 'text-danger';
        revenueGrowthEl.innerHTML = `<i class="fas fa-arrow-${summaryData.revenueGrowth >= 0 ? 'up' : 'down'}"></i> ` + revenueGrowthEl.textContent;
    }
    
    if (totalOrdersEl) totalOrdersEl.textContent = summaryData.totalOrders;
    if (orderGrowthEl) {
        orderGrowthEl.textContent = `${summaryData.orderGrowth}% so với kỳ trước`;
        orderGrowthEl.className = summaryData.orderGrowth >= 0 ? 'text-success' : 'text-danger';
        orderGrowthEl.innerHTML = `<i class="fas fa-arrow-${summaryData.orderGrowth >= 0 ? 'up' : 'down'}"></i> ` + orderGrowthEl.textContent;
    }
    
    if (averageOrderValueEl) averageOrderValueEl.textContent = summaryData.averageOrderValue;
    if (avgOrderGrowthEl) {
        avgOrderGrowthEl.textContent = `${summaryData.avgOrderGrowth}% so với kỳ trước`;
        avgOrderGrowthEl.className = summaryData.avgOrderGrowth >= 0 ? 'text-success' : 'text-danger';
        avgOrderGrowthEl.innerHTML = `<i class="fas fa-arrow-${summaryData.avgOrderGrowth >= 0 ? 'up' : 'down'}"></i> ` + avgOrderGrowthEl.textContent;
    }
}

/**
 * Khởi tạo các biểu đồ
 */
function initializeCharts() {
    // Biểu đồ doanh thu theo thời gian
    if (document.querySelector("#revenueByTimeChart")) {
        window.revenueChart = new ApexCharts(document.querySelector("#revenueByTimeChart"), {
            chart: {
                type: 'area',
                height: 350,
                toolbar: {
                    show: true
                }
            },
            series: [{
                name: 'Doanh thu',
                data: [1200000, 1900000, 1500000, 2500000, 2100000, 3100000, 2500000]
            }],
            xaxis: {
                categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
            },
            yaxis: {
                labels: {
                    formatter: function(value) {
                        return formatCurrency(value);
                    }
                }
            },
            colors: ['#8B4513'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.3
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            tooltip: {
                y: {
                    formatter: function(value) {
                        return formatCurrency(value);
                    }
                }
            }
        });
        window.revenueChart.render();
    }

    // Biểu đồ doanh thu theo danh mục
    if (document.querySelector("#categoryRevenueChart")) {
        window.categoryChart = new ApexCharts(document.querySelector("#categoryRevenueChart"), {
            chart: {
                type: 'donut',
                height: 365
            },
            series: [44, 55, 13, 33],
            labels: ['Món chính', 'Khai vị', 'Tráng miệng', 'Đồ uống'],
            colors: ['#D4AF37', '#8B4513', '#CD853F', '#DEB887'],
            legend: {
                position: 'bottom'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            tooltip: {
                y: {
                    formatter: function(value) {
                        return formatCurrency(value);
                    }
                }
            }
        });
        window.categoryChart.render();
    }

    // Biểu đồ doanh thu theo giờ
    if (document.querySelector("#hourlyRevenueChart")) {
        window.hourlyChart = new ApexCharts(document.querySelector("#hourlyRevenueChart"), {
            chart: {
                type: 'bar',
                height: 350
            },
            series: [{
                name: 'Doanh thu',
                data: [2100000, 2500000, 3500000, 2800000, 4500000, 3000000]
            }],
            xaxis: {
                categories: ['6-9h', '9-12h', '12-15h', '15-18h', '18-21h', '21-23h']
            },
            colors: ['#8B4513'],
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: '60%',
                    dataLabels: {
                        position: 'top'
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function(val) {
                    return formatCurrency(val, true);
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ['#304758']
                }
            },
            yaxis: {
                labels: {
                    formatter: function(value) {
                        return formatCurrency(value);
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function(value) {
                        return formatCurrency(value);
                    }
                }
            }
        });
        window.hourlyChart.render();
    }
}

/**
 * Cập nhật dữ liệu các biểu đồ dựa trên bộ lọc
 */
function updateCharts(timeFilter, dateValue, categoryFilter) {
    // Dữ liệu mẫu cho các biểu đồ - trong thực tế sẽ được lấy từ API
    let timeSeriesData, categoryData, hourlyData;
    
    switch(timeFilter) {
        case 'day':
            // Nếu chọn theo ngày, hiển thị dữ liệu theo giờ
            timeSeriesData = {
                categories: ['7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h'],
                data: [0, 0, 500000, 1200000, 2100000, 3500000, 2800000, 1500000, 1700000, 2000000, 2500000, 3800000, 4200000, 3500000, 2800000, 1500000]
            };
            break;
        case 'month':
            // Nếu chọn theo tháng, hiển thị dữ liệu theo ngày
            timeSeriesData = {
                categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
                data: [1500000, 1800000, 1700000, 1600000, 2200000, 2500000, 2800000, 1900000, 1700000, 1600000, 1700000, 1800000, 1900000, 2100000, 2300000, 2200000, 2500000, 2700000, 2900000, 3100000, 3300000, 3500000, 3300000, 3100000, 2900000, 2700000, 2400000, 2200000, 2000000, 1900000]
            };
            break;
        case 'year':
            // Nếu chọn theo năm, hiển thị dữ liệu theo tháng
            timeSeriesData = {
                categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                data: [45000000, 48000000, 52000000, 49000000, 58000000, 62000000, 68000000, 71000000, 66000000, 64000000, 72000000, 75000000]
            };
            break;
        default:
            timeSeriesData = {
                categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                data: [1200000, 1900000, 1500000, 2500000, 2100000, 3100000, 2500000]
            };
    }
    
    // Dữ liệu biểu đồ theo danh mục
    if (categoryFilter === 'all') {
        categoryData = {
            series: [44, 55, 13, 33],
            labels: ['Món chính', 'Khai vị', 'Tráng miệng', 'Đồ uống']
        };
    } else {
        // Nếu chọn danh mục cụ thể, hiển thị phân tích chi tiết cho danh mục đó
        switch(categoryFilter) {
            case 'main':
                categoryData = {
                    series: [35, 25, 20, 15, 5],
                    labels: ['Món gà', 'Món heo', 'Món bò', 'Món cá', 'Món chay']
                };
                break;
            case 'appetizer':
                categoryData = {
                    series: [45, 30, 25],
                    labels: ['Salad', 'Súp', 'Khai vị nóng']
                };
                break;
            case 'dessert':
                categoryData = {
                    series: [40, 35, 25],
                    labels: ['Bánh ngọt', 'Trái cây', 'Kem']
                };
                break;
            case 'drink':
                categoryData = {
                    series: [30, 25, 20, 15, 10],
                    labels: ['Nước ngọt', 'Bia', 'Rượu', 'Nước ép', 'Đồ uống nóng']
                };
                break;
        }
    }
    
    // Dữ liệu theo giờ
    hourlyData = {
        data: [2100000, 2500000, 3500000, 2800000, 4500000, 3000000]
    };
    
    // Cập nhật biểu đồ
    if (window.revenueChart) {
        window.revenueChart.updateOptions({
            xaxis: {
                categories: timeSeriesData.categories
            }
        });
        window.revenueChart.updateSeries([{
            name: 'Doanh thu',
            data: timeSeriesData.data
        }]);
    }
    
    if (window.categoryChart) {
        window.categoryChart.updateOptions({
            labels: categoryData.labels
        });
        window.categoryChart.updateSeries(categoryData.series);
    }
    
    if (window.hourlyChart) {
        window.hourlyChart.updateSeries([{
            name: 'Doanh thu',
            data: hourlyData.data
        }]);
    }
}

/**
 * Cập nhật bảng dữ liệu chi tiết
 */
function updateDetailTable(timeFilter, dateValue, categoryFilter) {
    const tableBody = document.querySelector('#detailTable tbody');
    if (!tableBody) return;
    
    // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
    const detailData = [
        { id: 'HD001', date: '20/03/2025', time: '12:30', total: 1250000, items: 5, customer: 'Khách lẻ', payment: 'Tiền mặt' },
        { id: 'HD002', date: '20/03/2025', time: '13:15', total: 980000, items: 3, customer: 'Nguyễn Văn A', payment: 'Chuyển khoản' },
        { id: 'HD003', date: '20/03/2025', time: '18:45', total: 2350000, items: 8, customer: 'Công ty TNHH XYZ', payment: 'Thẻ tín dụng' },
        { id: 'HD004', date: '20/03/2025', time: '19:20', total: 1650000, items: 6, customer: 'Trần Thị B', payment: 'Tiền mặt' },
        { id: 'HD005', date: '20/03/2025', time: '20:10', total: 850000, items: 4, customer: 'Khách lẻ', payment: 'Chuyển khoản' }
    ];
    
    // Xóa nội dung hiện tại
    tableBody.innerHTML = '';
    
    // Thêm dữ liệu mới
    detailData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td class="text-end">${formatCurrency(item.total)}</td>
            <td class="text-center">${item.items}</td>
            <td>${item.customer}</td>
            <td>${item.payment}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-info me-1" onclick="viewDetail('${item.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="printInvoice('${item.id}')">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Định dạng số thành tiền tệ Việt Nam
 */
function formatCurrency(value, simplified = false) {
    // Nếu simplified = true, trả về định dạng rút gọn (ví dụ: 2.5tr)
    if (simplified) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'tr';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'k';
        }
        return value.toString();
    }
    
    // Định dạng đầy đủ
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * Xem chi tiết hóa đơn
 */
function viewDetail(invoiceId) {
    console.log(`Xem chi tiết hóa đơn: ${invoiceId}`);
    // Mở modal hoặc chuyển hướng đến trang chi tiết
    showNotification(`Đang tải chi tiết hóa đơn ${invoiceId}`, 'info');
}

/**
 * In hóa đơn
 */
function printInvoice(invoiceId) {
    console.log(`In hóa đơn: ${invoiceId}`);
    showNotification(`Đang chuẩn bị in hóa đơn ${invoiceId}`, 'info');
}

/**
 * Xuất báo cáo
 */
function exportReport() {
    // Lấy thông tin bộ lọc hiện tại
    const timeFilter = document.getElementById('timeFilter').value;
    
    let dateValueText = '';
    switch(timeFilter) {
        case 'day':
            const dayFilter = document.getElementById('dayFilter');
            if (dayFilter) {
                const date = new Date(dayFilter.value);
                dateValueText = date.toLocaleDateString('vi-VN');
            }
            break;
        case 'month':
            const monthFilter = document.getElementById('monthFilter');
            if (monthFilter) {
                const date = new Date(monthFilter.value + '-01');
                dateValueText = date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' });
            }
            break;
        case 'year':
            const yearFilter = document.getElementById('yearFilter');
            if (yearFilter) {
                dateValueText = yearFilter.value;
            }
            break;
    }
    
    showNotification(`Đang xuất báo cáo doanh thu ${dateValueText}`, 'info');
    
    // Giả lập việc xuất báo cáo
    setTimeout(() => {
        showNotification('Xuất báo cáo thành công!', 'success');
    }, 1500);
}