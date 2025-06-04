const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Entree = sequelize.define('Entree', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  code_entree: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Entree;
