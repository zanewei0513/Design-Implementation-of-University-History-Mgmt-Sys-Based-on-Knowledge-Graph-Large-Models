// server/models/Link.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Link = sequelize.define('links', {
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target: {
    type: DataTypes.STRING,
    allowNull: false
  },
  relationType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  strength: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'links'
});

module.exports = Link;