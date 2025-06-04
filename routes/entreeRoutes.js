const express = require('express');
const router = express.Router();
const { createEntrées, getEntrees } = require('../controllers/entreeController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Create a new Entrée (Stock In)
router.post('/', protect, authorizeRoles('admin', 'technicien'), createEntrées);
router.get('/', protect, authorizeRoles('admin', 'technicien'), getEntrees);

module.exports = router;
