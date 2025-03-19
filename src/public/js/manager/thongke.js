document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeCharts();
});

// Xử lý bộ lọc
function initializeFilters() {
    const timeFilter = document.getElementById('timeFilter');
    const dayFilterGroup = document.getElementById('dayFilterGroup');
    const monthFilterGroup = document.getElementById('monthFilterGroup');
    const yearFilterGroup = document.getElementById('yearFilterGroup');

    timeFilter.addEventListener('change', function() {
        dayFilterGroup.style.display = 'none';
        monthFilterGroup.style.display = 'none';
        yearFilterGroup.style.display = 'none';

        switch(this.value) {
            case 'day':
                dayFilterGroup.style.display = 'block';
                break;
            case 'month':
                monthFilterGroup.style.display = 'block';
                break;
            case 'year':
                yearFilterGroup.style.display = 'block';
                break;
        }
    });
}

// Khởi tạo biểu đồ
function initializeCharts() {
    // Biểu đồ doanh thu theo thời gian
    const revenueChart = new ApexCharts(document.querySelector("#revenueByTimeChart"), {
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
                    return value.toLocaleString('vi-VN') + 'đ';
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
        }
    });
    revenueChart.render();

    // Biểu đồ doanh thu theo danh mục
    const categoryChart = new ApexCharts(document.querySelector("#categoryRevenueChart"), {
        chart: {
            type: 'donut',
            height: 350
        },
        series: [44, 55, 13, 33],
        labels: ['Món chính', 'Khai vị', 'Tráng miệng', 'Đồ uống'],
        colors: ['#D4AF37', '#8B4513', '#CD853F', '#DEB887']
    });
    categoryChart.render();

    // Biểu đồ doanh thu theo giờ
    const hourlyChart = new ApexCharts(document.querySelector("#hourlyRevenueChart"), {
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
                borderRadius: 4
            }
        }
    });
    hourlyChart.render();
} 