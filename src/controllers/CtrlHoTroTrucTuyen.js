const HoiThoai = require('../models/HoiThoai');
const KhachHang = require('../models/KhachHang');
const TinNhan = require('../models/TinNhan');
const { Op } = require("sequelize");
module.exports = {
    index: (req, res) => {
        res.render('manager/ho-tro-truc-tuyen');
    },
    layHoiThoai: async (req, res) => {
        try {
            if(req.query.id) {
                const id = req.query.id;
                const hoiThoai = await HoiThoai.findOne({
                    include: {
                        model: KhachHang,
                        attributes: ['hoatDong']
                    },
                    where: {
                        id
                    }
                });
                return res.json({status: true, obj: hoiThoai });
            }
            else{
                const hoiThoai = await HoiThoai.findAll({
                    include:{
                        model: KhachHang,
                        attributes: ['hoatDong']
                    },
                    where: {
                        noiDungCuoi: {
                            [Op.not]: null
                        }
                    },
                    order: [['thoiGianGuiCuoi', 'DESC']]
                });
                return res.json({status: true, list: hoiThoai });
            }
        } catch (error) {
            console.error('Lỗi khi lấy hội thoại:', error);
            return res.json({status: false, error: 'Lỗi khi lấy hội thoại', error });
        }
    },
    layTinNhan: async (req, res) => {
        try {
            const idHoiThoai = req.query.id;
            const tinNhan = await TinNhan.findAll({
                where: { idHoiThoai },
                order: [['thoiGianGui', 'ASC']]
            });
            return res.json({status: true, list: tinNhan });
        } catch (error) {
            console.error('Lỗi khi lấy tin nhắn:', error);
            return res.json({status: false, error: 'Lỗi khi lấy tin nhắn', error });
        }
    }
}