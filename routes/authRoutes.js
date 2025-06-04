const express = require('express');
const router = express.Router();
const { login, deleteUser, register, getUsers, updateUser } = require('../controllers/authController');
const { body } = require('express-validator');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  login
);


router.post('/register', register);

router.get('/', protect, admin, getUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
