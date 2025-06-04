const { Sortie, Product, User } = require('../models');

// Create multiple Sorties (Stock Out)
const createSorties = async (req, res) => {
  const { sorties } = req.body; // Expecting array of { productId, quantity }
  const userId = req.user.id; // ✅ Automatically from token

  if (!Array.isArray(sorties) || sorties.length === 0) {
    return res.status(400).json({ message: 'Sorties must be a non-empty array' });
  }

  try {
    const codeSortie = `SOR-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();

    // Check stock availability first
    for (const { productId, quantity } of sorties) {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }
      if (product.quantity < quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${product.marking_code || productId}` });
      }
    }

    const createdSorties = [];
    
    // All good → proceed to update
    for (const { productId, quantity } of sorties) {
      const product = await Product.findByPk(productId);
      product.quantity -= quantity;
      await product.save();

      const newSortie = await Sortie.create({
        ProductId: productId,
        quantity,
        UserId: userId,
        code_sortie: codeSortie
      });

      createdSorties.push(newSortie);
    }

    res.status(201).json(createdSorties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error : Create Sortie' });
  }
};
// const createSorties = async (req, res) => {
//   const { sorties } = req.body; // Expecting array of { productId, quantity }
//   const userId = req.user.id; // ✅ Automatically from token

//   if (!Array.isArray(sorties) || sorties.length === 0) {
//     return res.status(400).json({ message: 'Sorties must be a non-empty array' });
//   }

//   try {
//     const createdSorties = [];
//     const codeSortie = `SOR-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();

//     for (const sortie of sorties) {
//       const { productId, quantity } = sortie;

//       const product = await Product.findByPk(productId);
//       if (!product) {
//         return res.status(404).json({ message: `Product with ID ${productId} not found` });
//       }

//       if (product.quantity < quantity) {
//         return res.status(400).json({ message: `Not enough stock for product ID ${productId}` });
//       }

//       product.quantity -= quantity;
//       await product.save();

//       const newSortie = await Sortie.create({
//         ProductId : productId,
//         quantity,
//         UserId : userId,
//         code_sortie : codeSortie
//       });

//       createdSorties.push(newSortie);
//     }

//     res.status(201).json(createdSorties);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error : Create Sortie' });
//   }
// };


const getSorties = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin'; 
    const whereClause = isAdmin ? {} : { userId: req.user.id };

    const sorties = await Sortie.findAll({
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

    res.status(200).json(sorties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error : Sortie' });
  }
};
module.exports = { createSorties, getSorties };
