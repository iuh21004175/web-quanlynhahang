const express = require('express');
const multer = require('multer');
const router = express.Router();
const CtrlTrangChu = require('../controllers/CtrlTrangChu');
const CtrlKhachHang = require('../controllers/CtrlKhachHang');
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
    const excludedRoutes = ['/'];
    if (excludedRoutes.includes(req.path)) {
        // Nếu là / thì kiểm tra xem có cookie không
        const token = req.cookies.AuthTokenCustomer;
        // Kiểm tra luồng hiện tại có phải / hay không
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Lưu thông tin vào res.locals.user
            res.locals.user = {
                id: decoded.id,
                ten: decoded.ten,
                luuDangNhap: decoded.luuDangNhap
            }
            // Kiểm tra luuDangNhap
            if (!decoded.luuDangNhap) {
                // Nếu false, tạo lại cookie với thời gian sống mới
                const newToken = jwt.sign({ id: decoded.id, ten: decoded.ten, luuDangNhap: decoded.luuDangNhap }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('AuthTokenCustomer', newToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 // 1 giờ
                });
            }
        }
        next(); // ✅ Bỏ qua kiểm tra và chuyển tiếp nếu trong danh sách loại trừ
    }
    else{
        //✅ Kiểm tra truy cập cho các route còn lại
        CtrlKhachHang.kiemTraTruyCap(req, res, next);
    }
});
router.get('/', CtrlTrangChu.index)
router.get('/dang-xuat', CtrlKhachHang.dangXuat);

module.exports = router;