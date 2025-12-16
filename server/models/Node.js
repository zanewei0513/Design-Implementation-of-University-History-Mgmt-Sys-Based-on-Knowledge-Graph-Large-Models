// server/models/Node.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Node = sequelize.define('nodes', {
  id: {
    type: DataTypes.STRING(50), // 增加长度限制
    primaryKey: true
  },
  label: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  timeline_start: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false // 改为必填字段
  },
  timeline_end: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  relatedEvents: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('relatedEvents');
      return rawValue ? rawValue.split(',') : [];
    }
  }
}, {
  timestamps: false,
  tableName: 'nodes',
  indexes: [
    { fields: ['type'] }, // 添加类型索引
    { fields: ['timeline_start'] }
  ]
});

module.exports = Node;