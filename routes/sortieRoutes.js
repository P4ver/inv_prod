const express = require('express');
const router = express.Router();
const { createSorties, getSorties } = require('../controllers/sortieController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Create a new Sortie (Stock Out)
router.post('/', protect, authorizeRoles('admin', 'technicien'), createSorties);
router.get('/', protect, authorizeRoles('admin', 'technicien'), getSorties);

module.exports = router;
