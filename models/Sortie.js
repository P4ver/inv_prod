const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sortie = sequelize.define('Sortie', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  code_sortie: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Sortie;
