const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KhachHang = sequelize.define('KhachHang', {
    id: {
        field: 'id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        field: 'ten',
        type: DataTypes.STRING,
        allowNull: false
    },
    gioiTinh: {
        field: 'gioi_tinh',
        type: DataTypes.STRING,
        allowNull: false
    },
    ngaySinh: {
        field: 'ngay_sinh',
        type: DataTypes.DATE,
        allowNull: false
    },
    soDienThoai: {
        field: 'so_dien_thoai',
        type: DataTypes.STRING,
        allowNull: false
    },

    diaChi: {
        field: 'dia_chi',
        type: DataTypes.STRING,
        allowNull: false
    },
    tenDangNhap: {
        field: 'ten_dang_nhap',
        type: DataTypes.STRING,
        allowNull: false
    },
    matKhau: {
        field: 'mat_khau',
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'khach_hang',
    timestamps: false
});

module.exports = KhachHang;