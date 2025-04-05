const DanhMucNguyenLieu = require('../models/DanhMucNguyenLieu');
const NhaCungCap = require('../models/NhaCungCap');
const NguyenLieu = require('../models/NguyenLieu');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
module.exports = {
    indexDanhMuc: (req, res) => {
        res.render('manager/danh-muc-nguyen-lieu');
    },
    indexNhaCungCap: (req, res) => {
        res.render('manager/nha-cung-cap');
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
    },
    layDanhMucNguyenLieu: async (req, res) => {
        try{
            const danhMuc = await DanhMucNguyenLieu.findAll();
            return res.json({status: true, list: danhMuc});
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server' });
        }
    },
    themDanhMucNguyenLieu: async (req, res) => {
        const { tenDanhMuc } = req.body;
        try{
            const danhMuc = await DanhMucNguyenLieu.create({ tenDanhMuc });
            return res.json({status: true, obj: danhMuc});
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server: ', error });
        }
    },
    suaDanhMucNguyenLieu: async (req, res) => {
        const { id, tenDanhMuc } = req.body;
        try{
            const danhMuc = await DanhMucNguyenLieu.findByPk(id);
            if(danhMuc){
                danhMuc.tenDanhMuc = tenDanhMuc;
                await danhMuc.save();
                await danhMuc.reload();
                return res.json({status: true, obj: danhMuc});
            }
            else{
                return res.json({ status: false, error: 'Không tìm thấy danh mục' });
            }
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server: ', error });
        }
    },
    layNhaCungCap: async (req, res) => {
        try{
            const ncc = await NhaCungCap.findAll();
            return res.json({status: true, list: ncc});
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    themNhaCungCap: async (req, res) => {
        const { ten, soDienThoai, email, diaChi } = req.body;
        try{
            const nhaCungCap = await NhaCungCap.create({ ten, soDienThoai, email, diaChi });
            if(req.file && nhaCungCap){
                // Tải ảnh lên Cloudinary (sử dụng Promise để đồng bộ hóa)
                const uploadToCloudinary = (fileBuffer, publicId) => {
                    return new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream({
                            folder: 'nha-cung-cap',
                            public_id: publicId,
                            transformation: [
                                { width: 300, height: 300, crop: 'fill' }
                            ]
                        }, (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        });

                        Readable.from(fileBuffer).pipe(uploadStream);
                    });
                };

                // Tải ảnh và cập nhật lại hình ảnh cho nhân viên
                const hinhAnhUrl = await uploadToCloudinary(req.file.buffer, nhaCungCap.id);
                await nhaCungCap.update({ hinhAnh: hinhAnhUrl });
                await nhaCungCap.reload();
            }
            return res.json({status: true, obj: nhaCungCap});
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    suaNhaCungCap: async (req, res) => {
        const { id, ten, soDienThoai, email, diaChi } = req.body;
        try{
            const nhaCungCap = await NhaCungCap.findByPk(id);
            if(nhaCungCap){
                nhaCungCap.ten = ten;
                nhaCungCap.soDienThoai = soDienThoai;
                nhaCungCap.email = email;
                nhaCungCap.diaChi = diaChi;
                await nhaCungCap.save();
                if(req.file){
                    // Tải ảnh lên Cloudinary (sử dụng Promise để đồng bộ hóa)
                    const uploadToCloudinary = (fileBuffer, publicId) => {
                        return new Promise((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream({
                                folder: 'nha-cung-cap',
                                public_id: publicId,
                                transformation: [
                                    { width: 300, height: 300, crop: 'fill' }
                                ]
                            }, (error, result) => {
                                if (error) return reject(error);
                                resolve(result.secure_url);
                            });

                            Readable.from(fileBuffer).pipe(uploadStream);
                        });
                    };

                    // Tải ảnh và cập nhật lại hình ảnh cho nhân viên
                    const hinhAnhUrl = await uploadToCloudinary(req.file.buffer, id);
                    nhaCungCap.hinhAnh = hinhAnhUrl;
                }
                await nhaCungCap.reload();
                return res.json({status: true, obj: nhaCungCap});
            }
            else{
                return res.json({ status: false, error: 'Không tìm thấy nhà cung cấp' });
            }
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    layNguyenLieu: async (req, res) => {
        try{
            const nguyenLieu = await NguyenLieu.findAll({
                include: [
                    {
                        model: NhaCungCap,
                        attributes: ['ten']
                    },
                    {
                        model: DanhMucNguyenLieu,
                        attributes: ['tenDanhMuc']
                    }
                ],
                order: [['id', 'DESC']]
            });
            return res.json({status: true, list: nguyenLieu});
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    themNguyenLieu: async (req, res) => {
        const { ten, donVi, toiThieu, idNhaCungCap, idDanhMuc } = req.body;
        try{
            let nguyenLieu = await NguyenLieu.create({ ten, donVi, toiThieu, idNhaCungCap, idDanhMuc });
            if(nguyenLieu){
                // Tải ảnh lên Cloudinary (sử dụng Promise để đồng bộ hóa)
                const uploadToCloudinary = (fileBuffer, publicId) => {
                    return new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream({
                            folder: 'nguyen-lieu',
                            public_id: publicId,
                            transformation: [
                                { width: 300, height: 300, crop: 'fill' }
                            ]
                        }, (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        });

                        Readable.from(fileBuffer).pipe(uploadStream);
                    });
                };

                // Tải ảnh và cập nhật lại hình ảnh cho nhân viên
                const hinhAnhUrl = await uploadToCloudinary(req.file.buffer, nguyenLieu.id);
                await nguyenLieu.update({ hinhAnh: hinhAnhUrl });
                await nguyenLieu.reload();
                nguyenLieu = nguyenLieu.toJSON();
                const danhMuc = await DanhMucNguyenLieu.findOne({
                    where: { id: nguyenLieu.idDanhMuc },
                    attributes: ['tenDanhMuc']

                });
                nguyenLieu.DanhMucNguyenLieu = danhMuc.toJSON();
                const nhaCungCap = await NhaCungCap.findOne({
                    where: { id: nguyenLieu.idNhaCungCap },
                    attributes: ['ten']
                });
                nguyenLieu.NhaCungCap = nhaCungCap.toJSON();
                return res.json({status: true, obj: nguyenLieu});
            }
            else{
                return res.json({ status: false, error: 'Không tìm thấy nguyên liệu' });
            }
            
        }
        catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    },
    suaNguyenLieu: async (req, res) => {
        const { id, ten, donVi, toiThieu, idNhaCungCap, idDanhMuc } = req.body;
        try{
            let nguyenLieu = await NguyenLieu.findByPk(id);
            if(nguyenLieu){
                nguyenLieu.ten = ten;
                nguyenLieu.donVi = donVi;
                nguyenLieu.toiThieu = toiThieu;
                nguyenLieu.idNhaCungCap = idNhaCungCap;
                nguyenLieu.idDanhMuc = idDanhMuc;
                await nguyenLieu.save();
                if(req.file){
                    // Tải ảnh lên Cloudinary (sử dụng Promise để đồng bộ hóa)
                    const uploadToCloudinary = (fileBuffer, publicId) => {
                        return new Promise((resolve, reject) => {
                            const uploadStream = cloudinary.uploader.upload_stream({
                                folder: 'nguyen-lieu',
                                public_id: publicId,
                                transformation: [
                                    { width: 300, height: 300, crop: 'fill' }
                                ]
                            }, (error, result) => {
                                if (error) return reject(error);
                                resolve(result.secure_url);
                            });

                            Readable.from(fileBuffer).pipe(uploadStream);
                        });
                    };

                    // Tải ảnh và cập nhật lại hình ảnh cho nhân viên
                    const hinhAnhUrl = await uploadToCloudinary(req.file.buffer, id);
                    nguyenLieu.hinhAnh = hinhAnhUrl;
                }
                await nguyenLieu.reload();
                nguyenLieu = nguyenLieu.toJSON();
                // Lấy danh mục nguyên liệu và nhà cung cấp
                const danhMuc = await DanhMucNguyenLieu.findOne({
                    where: { id: nguyenLieu.idDanhMuc },
                    attributes: ['tenDanhMuc']
                });
                nguyenLieu.DanhMucNguyenLieu = danhMuc.toJSON();
                const nhaCungCap = await NhaCungCap.findOne({
                    where: { id: nguyenLieu.idNhaCungCap },
                    attributes: ['ten']
                });
                nguyenLieu.NhaCungCap = nhaCungCap.toJSON();
                return res.json({status: true, obj: nguyenLieu});
            }
            else{
                return res.json({ status: false, error: 'Không tìm thấy nguyên liệu' });
            }
        }catch(error){
            console.error('Error:', error);
            return res.json({ status: false, error: 'Lỗi server', error });
        }
    }
}