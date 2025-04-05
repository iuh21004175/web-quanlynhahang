const express = require('express');
const multer = require('multer');
const router = express.Router();
const CtrlTaiKhoan = require('../controllers/CtrlTaiKhoan');
const CtrlNhanVien = require('../controllers/CtrlNhanVien');
const CtrlThucDon = require('../controllers/CtrlThucDon');
const CtrlKho = require('../controllers/CtrlKho');
const CtrlKhachHang = require('../controllers/CtrlKhachHang');

// Cấu hình lưu file vào bộ nhớ (RAM)
const upload = multer({ storage: multer.memoryStorage() });

router.use(express.json());

router.post('/dang-nhap', CtrlTaiKhoan.dangNhap);
router.post('/nhan-vien', upload.single('hinhAnh'), CtrlNhanVien.themNhanVien);
router.get('/nhan-vien', CtrlNhanVien.layNhanVien);
router.put('/nhan-vien', upload.single('hinhAnh'), CtrlNhanVien.suaNhanVien);
router.get('/danh-muc-mon-an', CtrlThucDon.layDanhMucMonAn);
router.post('/danh-muc-mon-an', CtrlThucDon.themDanhMucMonAn);
router.put('/danh-muc-mon-an', CtrlThucDon.suaDanhMucMonAn);
router.get('/mon-an', CtrlThucDon.layMonAn);
router.post('/mon-an', upload.single('hinhAnh'), CtrlThucDon.themMonAn);
router.put('/mon-an', upload.single('hinhAnh'), CtrlThucDon.suaMonAn);
router.get('/chi-tiet-mon-an', CtrlThucDon.layChiTietMonAn);
router.get('/danh-muc-nguyen-lieu', CtrlKho.layDanhMucNguyenLieu);
router.post('/danh-muc-nguyen-lieu', CtrlKho.themDanhMucNguyenLieu);
router.put('/danh-muc-nguyen-lieu', CtrlKho.suaDanhMucNguyenLieu);
router.get('/nha-cung-cap', CtrlKho.layNhaCungCap);
router.post('/nha-cung-cap', upload.single('hinhAnh'), CtrlKho.themNhaCungCap);
router.put('/nha-cung-cap', upload.single('hinhAnh'), CtrlKho.suaNhaCungCap);
router.get('/nguyen-lieu', CtrlKho.layNguyenLieu);
router.post('/nguyen-lieu', upload.single('hinhAnh'), CtrlKho.themNguyenLieu);
router.put('/nguyen-lieu', upload.single('hinhAnh'), CtrlKho.suaNguyenLieu);
router.post('/dang-ky', CtrlKhachHang.dangKy);
router.post('/dang-nhap-khach-hang', CtrlKhachHang.dangNhap);
router.post('/kiem-tra-so-dien-thoai', CtrlKhachHang.kiemTraSoDienThoai);
router.post('/kiem-tra-ten-dang-nhap', CtrlKhachHang.kiemTraTenDangNhap);
module.exports = router;