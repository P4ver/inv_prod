const { Entree, Product, User } = require('../models');

// Create multiple Entrées (Stock In)
const createEntrées = async (req, res) => {
  const { entries } = req.body; // Expecting array of { productId, quantity, userId }
  const userId = req.user.id;

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ message: 'Entries must be a non-empty array' });
  }

  try {
    const createdEntrées = [];
    const codeEntree = `ENT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
    
    for (const entry of entries) {
      const { productId, quantity } = entry;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      // Update product quantity
      product.quantity += quantity;
      await product.save();

      // Create entree record
      const newEntrée = await Entree.create({ ProductId: productId, quantity, UserId : userId, code_entree : codeEntree });
      createdEntrées.push(newEntrée);
    }

    res.status(201).json(createdEntrées);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error : Create Entree' });
  }
};


// Get all stock-in entries with product and user info
const getEntrees = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin'; 
    const whereClause = isAdmin ? {} : { userId: req.user.id };

    const entrees = await Entree.findAll({
      where: whereClause,
      include: [
        {
          model: Product,
          attributes: ['marking_code', 'code', 'description']
        },
        {
          model: User, 
          attributes: ['username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(entrees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error : get Entrees' });
  }
};


module.exports = { createEntrées, getEntrees };
