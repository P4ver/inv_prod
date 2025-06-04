const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'technicien', 'user'), defaultValue: 'user' },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // inactive by default until admin approves
  }
});

module.exports = User;
