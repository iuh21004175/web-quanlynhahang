module.exports = {
    indexDanhMuc: (req, res) => {
        res.render('manager/danh-muc-nguyen-lieu');
    },
    indexNguyenLieu: (req, res) => {
        res.render('manager/nguyen-lieu');
    },
    indexKho: (req, res) => {
        res.render('manager/kho');
    },
    indexPhieuNhap: (req, res) => {
        res.render('manager/phieu-nhap');
    },
    indexPhieuXuat: (req, res) => {
        res.render('manager/phieu-xuat');
    }
}