const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin, authorizeRoles } = require('../middlewares/authMiddleware');

// Get all products
// router.get('/', protect, getProducts);
router.get('/', protect, getProducts);

// Create a new product 
// router.post('/', protect, admin, createProduct);
router.post('/', protect, authorizeRoles('admin', 'technicien'), createProduct);

// Update a product 
router.put('/:id', protect, authorizeRoles('admin', 'technicien'), updateProduct);

// Delete a product 
router.delete('/:id', protect, authorizeRoles('admin', 'technicien'), deleteProduct);

module.exports = router;
