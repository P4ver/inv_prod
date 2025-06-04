const express = require('express');
const router = express.Router();
const {
  getStockSummary,
  getEntreeReport,
  getSortieReport,
  getActivityReport
} = require('../controllers/reportController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Accessible by admin or technicien
router.get('/stock-summary', protect, authorizeRoles('admin', 'technicien'), getStockSummary);
router.get('/entrees', protect, authorizeRoles('admin', 'technicien'), getEntreeReport);
router.get('/sorties', protect, authorizeRoles('admin', 'technicien'), getSortieReport);
router.get('/activity', protect, authorizeRoles('admin', 'technicien'), getActivityReport);

module.exports = router;
