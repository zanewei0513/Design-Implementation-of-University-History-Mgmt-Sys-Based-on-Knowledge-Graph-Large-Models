const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistoryEvent = sequelize.define('history_events', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'history_events'
});

module.exports = HistoryEvent;