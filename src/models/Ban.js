const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const KhuVuc = require('./KhuVuc');

const Ban = sequelize.define('Ban', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ten: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sucChua: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trangThai: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idKhuVuc: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'ban',
    timestamps: false,
})

Ban.belongsTo(KhuVuc, {foreignKey: 'idKhuVuc'})
KhuVuc.hasMany(Ban, {foreignKey: 'idKhuVuc'})

module.exports = Ban;