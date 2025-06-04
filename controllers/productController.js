const { Product } = require('../models');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product (Admin only)
const createProduct = async (req, res) => {
  const { marking_code, code, description, quantity, CategoryId, package_type } = req.body;

  try {
    const newProduct = await Product.create({
      marking_code,
      code,
      description,
      quantity,
      CategoryId,
      package_type
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product (Admin only)
// const updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const { marking_code, code, description, quantity, categoryId, package_type } = req.body;

//   try {
//     const product = await Product.findByPk(id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     await product.update({
//       marking_code,
//       code,
//       description,
//       quantity,
//       categoryId,
//       package_type
//     });

//     res.json({ message: 'Product updated successfully', product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { marking_code, code, description, quantity, CategoryId, package_type } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({
      marking_code,
      code,
      description,
      quantity,
      CategoryId,
      package_type
    });

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product (Admin only)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
