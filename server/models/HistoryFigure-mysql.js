const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistoryFigure = sequelize.define('historical_figures', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    intro: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    maint: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'historical_figures'
});

module.exports = HistoryFigure;