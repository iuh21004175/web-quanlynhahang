document.addEventListener('DOMContentLoaded', function () {
    let cart = JSON.parse(localStorage.getItem('gioHang')) || [];
    if (cart.length > 0) {
        let tongGia = 0;
        const phiDichVu = 0;

        cart.forEach(item => {
            tongGia += item.price * item.quantity;
        });

        let tongTien = tongGia + phiDichVu;

        // Cập nhật nội dung số tiền
        const soTienDiv = document.getElementById('soTien');
        if (soTienDiv) {
            soTienDiv.textContent = tongTien.toLocaleString('vi-VN') + 'đ';
        }

        // Lấy id đơn hàng từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id'); // Lấy giá trị của tham số 'id' trong URL

        // Kiểm tra xem có id không, nếu không thì dùng mặc định '12345'
        const orderDescription = orderId ? `DH${orderId}` : 'DH12345';

        // Tạo URL QR mới có amount và id đơn hàng
        const qrImg = document.getElementById('qrImage');
        if (qrImg) {
            const amountParam = tongTien;
            const newQRUrl = `https://qr.sepay.vn/img?bank=TPBank&acc=10001198354&template=compact&amount=${amountParam}&des=${orderDescription}`;
            qrImg.src = newQRUrl;
        }
    }
    
});
