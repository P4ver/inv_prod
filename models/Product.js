const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  marking_code: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  package_type: { type: DataTypes.STRING },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
});

Product.belongsTo(Category, { foreignKey: 'CategoryId' });
Category.hasMany(Product, { foreignKey: 'CategoryId' });

module.exports = Product;
