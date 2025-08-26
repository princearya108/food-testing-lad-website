const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { generateToken, authenticateAdmin } = require('../middleware/auth');

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Contact administrator.'
      });
    }

    // Check password
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken(admin._id);

    // Send response without password
    const { password: adminPassword, ...adminData } = admin.toObject();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: adminData,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current admin profile
// @route   GET /api/auth/profile
// @access  Private (Admin)
router.get('/profile', authenticateAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private (Admin)
router.put('/profile', authenticateAdmin, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (username && username !== admin.username) {
      // Check if username already exists
      const existingAdmin = await Admin.findOne({ 
        username, 
        _id: { $ne: admin._id } 
      });
      
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
      
      admin.username = username;
    }

    if (email && email !== admin.email) {
      // Check if email already exists
      const existingAdmin = await Admin.findOne({ 
        email, 
        _id: { $ne: admin._id } 
      });
      
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      
      admin.email = email;
    }

    // Change password if provided
    if (currentPassword && newPassword) {
      const isValidPassword = await admin.comparePassword(currentPassword);
      
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      admin.password = newPassword;
    }

    await admin.save();

    // Send response without password
    const { password, ...adminData } = admin.toObject();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        admin: adminData
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @desc    Logout admin (mainly for frontend state management)
// @route   POST /api/auth/logout
// @access  Private (Admin)
router.post('/logout', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private (Admin)
router.get('/verify', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      admin: req.admin
    }
  });
});

module.exports = router;
