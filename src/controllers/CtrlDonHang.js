module.exports = {
    index: (req, res) => {
        if(res.locals.taiKhoan.vaiTro === 'Quản lý'){
            res.render('manager/don-hang-cho-quan-ly')
        }
        else if(res.locals.taiKhoan.vaiTro === 'Đầu bếp'){
            res.render('manager/don-hang-cho-dau-bep')
        }
        else if(res.locals.taiKhoan.vaiTro === 'Phục vụ'){
            res.render('manager/don-hang-cho-phuc-vu')
        }
        
    },
    
}