const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Entree = require('./Entree');
const Sortie = require('./Sortie');

// Relationships
Category.hasMany(Product);
Product.belongsTo(Category);

User.hasMany(Entree);
Entree.belongsTo(User);
Product.hasMany(Entree);
Entree.belongsTo(Product);

User.hasMany(Sortie);
Sortie.belongsTo(User);
Product.hasMany(Sortie);
Sortie.belongsTo(Product);

module.exports = { User, Product, Category, Entree, Sortie };
