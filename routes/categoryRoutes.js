const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, admin, authorizeRoles } = require('../middlewares/authMiddleware');

// Get all categories
router.get('/', getCategories);

// Create a new category (admin only)
// router.post('/', protect, admin, createCategory);
router.post('/', protect, authorizeRoles('admin', 'technicien'), createCategory);

module.exports = router;
