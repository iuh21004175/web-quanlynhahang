document.addEventListener('DOMContentLoaded', async function () {
    let listDonHang = await getAPIXemDonHang();
    thaoTacDonHang(listDonHang);

    document.addEventListener('click', async function (e) {
        if (e.target.classList.contains('btn-cancel-order')) {
            const orderId = e.target.getAttribute('data-id');
            if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
                const response = await fetch(`/api/huy-don-hang/${orderId}`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.status) {
                    alert('✅ Đơn hàng đã được hủy.');
                    // Làm mới danh sách đơn hàng sau khi hủy
                    let listDonHang = await getAPIXemDonHang();
                    thaoTacDonHang(listDonHang);
                } else {
                    alert('❌ Hủy đơn hàng thất bại: ' + (data.message || 'Lỗi không xác định.'));
                }
            }
        }
    });
    

    // Xử lý sự kiện khi chọn tab
    const tabButtons = document.querySelectorAll('#orderTabs .nav-link');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const status = button.getAttribute('data-status');
            filterOrdersByStatus(status, listDonHang);
        });
    });
});

// Lọc đơn hàng theo trạng thái
function filterOrdersByStatus(status, allOrders) {
    let filteredOrders = allOrders;
    if (status !== 'all') {
        filteredOrders = allOrders.filter(donHang => donHang.trangThai.toString() === status);
    }
    thaoTacDonHang(filteredOrders);
}

// Hàm thao tác với đơn hàng
function thaoTacDonHang(list) {
    const danhSachDonHang = document.querySelector('#orderList');
    danhSachDonHang.innerHTML = ''; // Xóa danh sách cũ

    if (!list || list.length === 0) {
        danhSachDonHang.innerHTML = `
            <div class="col-12 text-center">
                <h5>Không có đơn hàng nào.</h5>
                <a href="/menu" class="btn btn-primary mt-3">Xem menu</a>
            </div>
        `;
        return;
    }

    list.forEach(function (donHang) {
        // Phần còn lại giữ nguyên như bạn đã viết
        const trangThaiText = {
            0: 'Đã hủy',
            1: 'Đặt thành công',
            2: 'Đã thanh toán',
            3: 'Đang chế biến',
            4: 'Đã chế biến',
            5: 'Đang giao hàng',
            6: 'Đã giao hàng'
        };

        const date = new Date(donHang.thoiGianGhi);
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        const itemsHTML = (donHang.ChiTietDonHangs || []).map(item => {
            const mon = item.MonAn || {};
            const tongTienMon = item.soLuong * item.gia;
            return `
                <div class="cart-item d-flex align-items-center mb-3">
                    <img src="${mon.hinhAnh || '/default.jpg'}" width="80px" height="80px" alt="${mon.ten || 'Món ăn'}" class="cart-item-image me-3">
                    <div class="cart-item-details flex-grow-1">
                        <h6 class="cart-item-title mb-1">${mon.ten || ''}</h6>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted">${item.soLuong} x ${item.gia.toLocaleString('vi-VN')}₫</span>
                            <span class="cart-item-price text-primary">${tongTienMon.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>
                </div>`;
        }).join('');

        let buttonHTML = '';
        if (donHang.trangThai === 1 || donHang.trangThai === 2) {
            buttonHTML = `<button class="btn btn-danger col-3 text-center btn-cancel-order" data-id="${donHang.id}">Hủy</button>`;
        } else if (donHang.trangThai === 6 || donHang.trangThai === 0) {
            buttonHTML = `<button class="btn btn-success col-3 text-center" data-bs-toggle="modal" data-bs-target="#exampleModal">Đặt lại</button>`;
        } else {
            buttonHTML = `<button class="btn btn-warning col-3 text-center" data-bs-toggle="modal" data-bs-target="#exampleModal">Đang thực hiện</button>`;
        }


        const html = `
            <div class="col-md-6">
                <div class="order-card card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="order-id">Đơn ${donHang.id}</span>
                        <span class="order-status badge">${trangThaiText[donHang.trangThai]}</span>
                    </div>
                    <div class="card-body">
                        <div class="order-items mb-3">
                            ${itemsHTML}
                        </div>
                        <div class="order-info">
                            <div class="row mb-2">
                                <div class="col-6 text-muted">Thời gian đặt:</div>
                                <div class="col-6 text-end order-time">${formattedTime}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6 text-muted">Địa chỉ:</div>
                                <div class="col-6 text-end order-address">${donHang.diaChi}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6 text-muted">Tổng tiền:</div>
                                <div class="col-6 text-end order-total fw-bold text-primary">${donHang.tongTien.toLocaleString('vi-VN')}₫</div>
                            </div>
                            <div class="row">
                                <div class="col-6 text-muted">Trạng thái:</div>
                                <div class="col-6 text-end order-address">${trangThaiText[donHang.trangThai]}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-9 text-muted"></div>
                            ${buttonHTML}
                        </div>
                    </div>
                </div>
            </div>`;
        danhSachDonHang.innerHTML += html;
    });
}


// Hàm lấy danh sách đơn hàng từ API
async function getAPIXemDonHang() {
    try {
        const response = await fetch('/api/lay-don-hang', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        console.log('Dữ liệu nhận về từ API:', data);
        if (data.status) {
            return data.list;  
        } else {
            console.error('❌ Lỗi từ server:', data.error);
            return [];
        }
    } catch (error) {
        console.error('🚫 Lỗi khi fetch:', error);
        return [];
    }
}
