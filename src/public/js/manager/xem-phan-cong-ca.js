document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const weekFilter = document.getElementById('week-filter');
    const departmentFilter = document.getElementById('department-filter');
    const exportButton = document.getElementById('btn-export');
    const detailsModal = document.getElementById('detailsModal');
    const employeeName = document.getElementById('employee-name');
    const detailsTable = document.querySelector('#assignmentDetailsTable tbody');
    
    // Set default week to current week
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (new Date(year, month, day) - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    
    // Format: YYYY-Www
    const formattedWeek = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    weekFilter.value = formattedWeek;

    // Sample data for the charts
    const departmentLabels = ['Phục vụ', 'Bếp', 'Thu ngân'];
    const departmentValues = [18, 14, 8];
    
    const shiftTypeLabels = ['Ca sáng', 'Ca chiều', 'Ca tối'];
    const shiftTypeValues = [15, 12, 13];

    // Initialize ApexCharts for department distribution
    const departmentChartOptions = {
        series: departmentValues,
        chart: {
            type: 'donut',
            height: 350,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        labels: departmentLabels,
        colors: ['#4caf50', '#ff9800', '#2196f3'],
        plotOptions: {
            pie: {
                donut: {
                    size: '50%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                        },
                        value: {
                            show: true,
                            formatter: function(val) {
                                return val + " ca";
                            }
                        },
                        total: {
                            show: true,
                            label: 'Tổng',
                            formatter: function(w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + " ca";
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
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
        legend: {
            position: 'bottom',
            horizontalAlign: 'center'
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + " ca làm việc";
                }
            }
        },
        title: {
            text: 'Tỷ lệ phân bổ ca theo bộ phận',
            align: 'center',
            margin: 10,
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            }
        }
    };

    const shiftTypeChartOptions = {
        series: shiftTypeValues,
        chart: {
            type: 'pie',
            height: 350,
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        labels: shiftTypeLabels,
        colors: ['#4fc3f7', '#ffb74d', '#7986cb'],
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: 20,
                },
            }
        },
        dataLabels: {
            formatter: function(val, opts) {
                return opts.w.config.labels[opts.seriesIndex] + ': ' + opts.w.config.series[opts.seriesIndex] + ' ca';
            }
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
        legend: {
            position: 'bottom',
            horizontalAlign: 'center'
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + " ca làm việc";
                }
            }
        },
        title: {
            text: 'Tỷ lệ phân bổ theo loại ca',
            align: 'center',
            margin: 10,
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            }
        }
    };

    // Render charts
    const departmentChart = new ApexCharts(document.getElementById('departmentChart'), departmentChartOptions);
    departmentChart.render();

    const shiftTypeChart = new ApexCharts(document.getElementById('shiftTypeChart'), shiftTypeChartOptions);
    shiftTypeChart.render();

    // Sample detail data 
    const sampleShiftDetails = {
        1: [
            {date: 'Thứ hai, 20/11/2023', shiftName: 'Ca sáng', time: '7:00 - 12:00', note: ''},
            {date: 'Thứ ba, 21/11/2023', shiftName: 'Ca sáng', time: '7:00 - 12:00', note: ''},
            {date: 'Thứ tư, 22/11/2023', shiftName: 'Ca chiều', time: '12:00 - 17:00', note: 'Thay ca cho Trần Thị B'},
            {date: 'Thứ năm, 23/11/2023', shiftName: 'Ca tối', time: '17:00 - 22:00', note: ''},
            {date: 'Thứ bảy, 25/11/2023', shiftName: 'Ca tối', time: '17:00 - 22:00', note: ''}
        ],
        // ... Giữ nguyên các mẫu chi tiết khác
    };

    // Sample employee names
    const employeeNames = {
        1: 'Nguyễn Văn A',
        2: 'Trần Thị B',
        3: 'Lê Văn C',
        4: 'Phạm Thị D'
    };

    // Event Listeners
    weekFilter.addEventListener('change', loadData);
    departmentFilter.addEventListener('change', loadData);
    
    // Detail buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const employeeId = this.getAttribute('data-id');
            showEmployeeDetails(employeeId);
        });
    });
    
    // Export button
    exportButton.addEventListener('click', exportToExcel);

    // Functions
    function loadData() {
        // Trong môi trường thực tế, bạn sẽ gọi API để lấy dữ liệu mới
        console.log('Tải dữ liệu cho tuần:', weekFilter.value);
        console.log('Bộ phận:', departmentFilter.value);
        
        // Cập nhật lại biểu đồ (chỉ là mẫu)
        updateCharts();
    }

    function showEmployeeDetails(employeeId) {
        // Cập nhật tên nhân viên trong modal
        employeeName.textContent = employeeNames[employeeId] || 'Không xác định';
        
        // Xóa dữ liệu cũ
        detailsTable.innerHTML = '';
        
        // Thêm dữ liệu chi tiết
        const details = sampleShiftDetails[employeeId] || [];
        // ... Giữ nguyên phần code hiển thị chi tiết
    }

    function updateCharts() {
        // Tạo dữ liệu ngẫu nhiên mới
        const newDepartmentData = [
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 5
        ];
        
        const newShiftTypeData = [
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10
        ];
        
        // Cập nhật biểu đồ sử dụng ApexCharts
        departmentChart.updateSeries(newDepartmentData);
        shiftTypeChart.updateSeries(newShiftTypeData);
    }

    function exportToExcel() {
        alert('Tính năng xuất Excel sẽ được triển khai sau!');
    }
});