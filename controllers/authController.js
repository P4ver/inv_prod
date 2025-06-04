const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
  if (!user.isActive) {
    return res.status(403).json({ message: 'Your account is not activated. Please contact an administrator.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,     // true if you use HTTPS in production
    sameSite: 'Lax'    // or 'None' if cross-site and HTTPS
  });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
}

const register = async (req, res) => {
    const { username, email, password, role } = req.body;
  
    try {
      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Count total users
      const userCount = await User.count();
      const isFirstUser = userCount === 0;
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: isFirstUser ? 'admin' : (role || 'user'),
        isActive: isFirstUser ? true : false,
        // role: role || 'user', // default to 'user' if no role provided
        // isActive: false,
      });
  
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const getUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  // Update user details (admin only)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role, isActive  } = req.body;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password if it's provided
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Update user details
      await user.update({
        username,
        email,
        password: hashedPassword || user.password, // Only update password if provided
        role: role || user.role, // Update role if provided
        isActive: typeof isActive !== 'undefined' ? isActive : user.isActive
      });
  
      res.json({
        message: 'User updated successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  // Delete a user (admin only)
const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.destroy();
  
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
    

module.exports = { 
    login,
    register,
    updateUser,
    deleteUser,
    getUsers
 };
