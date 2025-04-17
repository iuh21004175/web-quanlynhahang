const KhuVuc = require('../models/KhuVuc');
module.exports = {
    indexKhuVuc: async (req, res) => {
        res.render('manager/khu-vuc')
    },
    indexBan: async (req, res) => {
        res.render('manager/ban')
    },
    layKhuVuc: async (req, res) => {
        try {
            const khuVuc = await KhuVuc.findAll({
                attributes: ['id', 'tenKhuVuc'],
                order: [['id', 'ASC']]
            });
            return res.json({ status: true, list: khuVuc });
        }
        catch (error) {
            console.log(error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    themKhuVuc: async (req, res) => {
        try {
            const { tenKhuVuc } = req.body;
            const khuVuc = await KhuVuc.create({ tenKhuVuc });
            return res.json({ status: true, obj: khuVuc });
        }
        catch (error) {
            console.log(error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    suaKhuVuc: async (req, res) => {
        try {
            const { id, tenKhuVuc } = req.body;
            const khuVuc = await KhuVuc.findByPk(id);
            if (!khuVuc) {
                return res.json({ status: false, error: 'Khu vực không tồn tại' });
            }
            khuVuc.tenKhuVuc = tenKhuVuc;
            await khuVuc.save();
            return res.json({ status: true, obj: khuVuc });
        }
        catch (error) {
            console.log(error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    }
}
