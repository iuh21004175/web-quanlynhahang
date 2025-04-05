const KhachHang = require('../models/KhachHang');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const CtrlKhachHang = {
    dangNhap: async (req, res) => {
        const { tenDangNhap, matKhau, luuDangNhap } = req.body;
        try {
            const khachHang = await KhachHang.findOne({
                where: {
                    tenDangNhap,
                    matKhau: crypto.createHash('md5').update(matKhau).digest('hex')
                }
            });
            if (!khachHang) {
                return res.json({ status: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }
            res.locals.user = {
                id: khachHang.id,
                ten: khachHang.ten,
                luuDangNhap
            }
            // Tạo token cho khách hàng
            const token = jwt.sign({ id: khachHang.id, ten: khachHang.ten, luuDangNhap }, process.env.JWT_SECRET, { expiresIn: luuDangNhap ? '30d' : '1h' });
            // Lưu token vào cookie
            res.cookie('AuthTokenCustomer', token, {
                httpOnly: true,
                maxAge: luuDangNhap ?  1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60, // 30 ngày hoặc 1 giờ
            });
            // Gọi hàm đăng nhập từ CtrlTaiKhoan
            return res.json({status: true});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },
    kiemTraTruyCap: (req, res, next) => {
        try {
            const token = req.cookies.AuthTokenCustomer;
            if (!token) {
                return res.redirect('/')
            }
            // Giải mã token
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
            next();
        } catch (error) {
            console.error('Lỗi khi kiểm tra đăng nhập:', error);
            return res.redirect('/')
        }
    },
    dangKy: async (req, res) => {
        const { ten, gioiTinh, ngaySinh, soDienThoai, diaChi, tenDangNhap, matKhau } = req.body;
        console.log(req.body);
        try {
            // Tạo mới khách hàng
            const khachHang = await KhachHang.create({
                ten,
                gioiTinh,
                ngaySinh,
                soDienThoai,
                diaChi,
                tenDangNhap,
                matKhau: crypto.createHash('md5').update(matKhau).digest('hex')
            });
            
            return res.status(201).json({ status: true});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: false, error: 'Lỗi server', error });
        }
    },
    kiemTraSoDienThoai: async (req, res) => {
        const { soDienThoai } = req.body;
        try {
            const khachHang = await KhachHang.findOne({
                where: {
                    soDienThoai
                }
            });
            if (khachHang) {
                return res.json({ status: true });
            } else {
                return res.json({ status: false });
            }
        } catch (error) {
            console.error(error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    kiemTraTenDangNhap: async (req, res) => {
        const { tenDangNhap } = req.body;
        try {
            const khachHang = await KhachHang.findOne({
                where: {
                    tenDangNhap
                }
            });
            if (khachHang) {
                return res.json({ status: true });
            } else {
                return res.json({ status: false });
            }
        } catch (error) {
            console.error(error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },

}

module.exports = CtrlKhachHang;