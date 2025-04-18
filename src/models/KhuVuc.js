const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const KhuVuc = sequelize.define('KhuVuc', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tenKhuVuc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'khu_vuc',
    timestamps: false
});

module.exports = KhuVuc;
