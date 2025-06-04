const { Product, Entree, Sortie, User, Category } = require('../models');
const { Op } = require('sequelize');

// Stock Summary Report
const getStockSummary = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category]
    });

    const summary = products.map(p => ({
      productId: p.id,
      name: p.name,
      category: p.Category ? p.Category.name : null,
      quantity: p.quantity,
      status: p.quantity > 0 ? 'In Stock' : 'Out of Stock'
    }));

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Entrées Report
const getEntreeReport = async (req, res) => {
  try {
    const entrees = await Entree.findAll({
      include: [Product, User],
      order: [['createdAt', 'DESC']]
    });

    const result = entrees.map(e => ({
      product: e.Product?.marking_code,
      ref: e.Product?.code,
      quantity: e.quantity,
      addedBy: e.User?.username,
      date: e.createdAt,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Sorties Report
const getSortieReport = async (req, res) => {
  try {
    const sorties = await Sortie.findAll({
      include: [Product, User],
      order: [['createdAt', 'DESC']]
    });

    const result = sorties.map(s => ({
      product: s.Product?.marking_code,
      ref: s.Product?.code,
      quantity: s.quantity,
      requestedBy: s.User?.username,
      date: s.createdAt,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// Monthly Activity
const getActivityReport = async (req, res) => {
  const { start, end } = req.query;

  try {
    const entrees = await Entree.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(start), new Date(end)]
        }
      }
    });

    const sorties = await Sortie.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(start), new Date(end)]
        }
      }
    });

    const totalEntree = entrees.reduce((sum, e) => sum + e.quantity, 0);
    const totalSortie = sorties.reduce((sum, s) => sum + s.quantity, 0);

    res.json({
      start,
      end,
      totalEntree,
      totalSortie
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = {
  getStockSummary,
  getEntreeReport,
  getSortieReport,
  getActivityReport
};
