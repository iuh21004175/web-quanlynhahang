const DonHang = require('../models/DonHang');
const ChiTietDonHang = require('../models/ChiTietDonHang');
const MonAn = require('../models/MonAn');
const moment = require('moment-timezone');

module.exports = {
    indexDauBep: (req, res) => {
        res.render('manager/don-hang-cho-dau-bep');
    },

    themDonHang: async (req, res) => {
        const user = res.locals.user;
        if (!user || !user.id) {
            return res.status(401).json({ status: false, error: 'Chưa đăng nhập hoặc token hết hạn' });
        }

        const { hinhThuc, diaChi, trangThai, tongTien, thanhToan, gioHang, ghiChu } = req.body;

        try {
            const thoiGianGhi = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
            let donHang = await DonHang.create({
                idKhachHang: user.id,
                thoiGianGhi,
                hinhThuc,
                diaChi,
                trangThai,
                tongTien,
                thanhToan
            });

            if (gioHang && gioHang.length > 0) {
                for (const item of gioHang) {
                    await ChiTietDonHang.create({
                        idDonHang: donHang.id,
                        idMonAn: item.id,
                        soLuong: item.quantity,
                        gia: item.price,
                        ghiChu
                    });
                }
            }

            // Nếu trạng thái là "chờ thanh toán" thì thiết lập timeout để xóa sau 5 phút nếu chưa thanh toán
            if (parseInt(trangThai) === 7) {
                setTimeout(async () => {
                    try {
                        const dh = await DonHang.findOne({ where: { id: donHang.id } });
                        if (dh && dh.trangThai === 7) {
                            await ChiTietDonHang.destroy({ where: { idDonHang: dh.id } });
                            await DonHang.destroy({ where: { id: dh.id } });
                            console.log(`⏱️ Đã xóa đơn hàng #${dh.id} do không thanh toán sau 5 phút.`);
                        }
                    } catch (err) {
                        console.error(`❌ Lỗi khi kiểm tra/xóa đơn hàng #${donHang.id}:`, err);
                    }
                }, 5 * 60 * 1000); // 5 phút
            }

            donHang = donHang.toJSON();
            res.json({ status: true, idDonHang: donHang.id });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: false, error: 'Lỗi server' });
        }
    },
    getSuccessOrders: async (req, res) => {
        const { id } = req.params;  // Lấy 'id' từ URL params
        try {
            // Nếu có 'id', truy vấn đơn hàng theo 'id' và trạng thái là 2 (Đã thanh toán)
            let successOrders;
            if (id) {
                successOrders = await DonHang.findAll({
                    where: {
                        id: id,  // Truy vấn theo 'id' từ URL
                        trangThai: 2  // Trạng thái 2 là "Đã thanh toán"
                    }
                });
            } else {
                // Nếu không có 'id', lấy tất cả đơn hàng đã thanh toán
                successOrders = await DonHang.findAll({
                    where: {
                        trangThai: 2  // Trạng thái 2 là "Đã thanh toán"
                    }
                });
            }
    
            if (successOrders.length > 0) {
                successOrders.forEach(order => {
                    console.log(`Đơn hàng ${order.id} đã thanh toán thành công.`);
                    
                });
                res.json(successOrders); // Trả về danh sách đơn hàng
            } else {
                console.log('Không có đơn hàng nào thanh toán thành công.');
                res.status(404).json({ message: 'Không có đơn hàng nào thanh toán thành công.' });
            }
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng thành công:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },
    layDonHang: async (req, res) => {
        const user = res.locals.user;
        
        if (!user || !user.id) {
            return res.status(401).json({ status: false, error: 'Chưa đăng nhập hoặc token hết hạn' });
        }
    
        try {
            const donHang = await DonHang.findAll({
                where: {
                    idKhachHang: user.id,
                    trangThai: [0, 1, 2, 3, 4, 5, 6]
                },
                order: [['id', 'DESC']],
                include: [
                    {
                        model: ChiTietDonHang,
                        attributes: ['idDonHang', 'soLuong', 'gia'], 
                        include: [
                            {
                                model: MonAn,
                                attributes: ['id', 'ten', 'gia', 'hinhAnh'] 
                            }
                        ]
                    }
                ]
            });
    
            return res.json({ status: true, list: donHang });
        } catch (error) {
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server' });
        }
    },
    huyDonHang: async (req, res) => {
        const id = req.params.id;
        try {
            const donHang = await DonHang.findByPk(id);
            if (!donHang) {
                return res.status(404).json({ status: false, error: 'Không tìm thấy đơn hàng' });
            }
    
            // Chỉ cho phép hủy nếu đơn hàng đang ở trạng thái 1 (đặt thành công) hoặc 2 (đã thanh toán)
            if (![1, 2].includes(donHang.trangThai)) {
                return res.status(400).json({ status: false, error: 'Chỉ có thể hủy đơn hàng chưa xử lý' });
            }
    
            donHang.trangThai = 0; 
            await donHang.save();
    
            res.json({ status: true, message: 'Đơn hàng đã được hủy' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, error: 'Lỗi server khi hủy đơn hàng' });
        }
    }    
    
};
