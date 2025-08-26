const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Team = require('../models/Team');
const { authenticateAdmin, optionalAuth } = require('../middleware/auth');

// Multer configuration for team profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads/team-images';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'team-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'));
    }
  }
});

// @desc    Get all active team members (Public)
// @route   GET /api/team
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const department = req.query.department;
    let team;
    
    if (department && department !== 'all') {
      team = await Team.getByDepartment(department);
    } else {
      team = await Team.getActiveMembers();
    }

    res.json({
      success: true,
      data: team,
      count: team.length
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team members'
    });
  }
});

// @desc    Get team member by ID (Public)
// @route   GET /api/team/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team member'
    });
  }
});

// @desc    Get all team members for admin (includes inactive)
// @route   GET /api/admin/team/all
// @access  Private (Admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'active', 'inactive', 'all'
    const department = req.query.department;
    const search = req.query.search;

    let query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    
    // Department filter
    if (department && department !== 'all') {
      query.department = department;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const team = await Team.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Team.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    console.log('Team fetch query:', query);
    console.log('Team results count:', team.length);

    res.json({
      success: true,
      data: {
        team,
        pagination: {
          current: page,
          pages: totalPages,
          total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching team for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team members'
    });
  }
});

// @desc    Create new team member
// @route   POST /api/admin/team/create
// @access  Private (Admin)
router.post('/admin/create', authenticateAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    console.log('Creating team member with data:', req.body);
    console.log('Uploaded file:', req.file);

    const {
      name,
      position,
      email,
      phone,
      bio,
      education,
      experience,
      specialization,
      department,
      displayOrder,
      joinDate,
      socialLinks,
      achievements,
      publications
    } = req.body;

    // Validate required fields
    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Name and position are required'
      });
    }

    const teamData = {
      name: name.trim(),
      position: position.trim(),
      department: department || 'Chemical',
      displayOrder: parseInt(displayOrder) || 0
    };

    // Add optional fields
    if (email) teamData.email = email.trim();
    if (phone) teamData.phone = phone.trim();
    if (bio) teamData.bio = bio.trim();
    if (education) teamData.education = education.trim();
    if (experience) teamData.experience = experience.trim();
    if (specialization) teamData.specialization = specialization.trim();
    if (joinDate) teamData.joinDate = new Date(joinDate);

    // Handle profile image
    if (req.file) {
      teamData.profileImage = `/uploads/team-images/${req.file.filename}`;
    }

    // Handle social links (if provided as JSON string)
    if (socialLinks) {
      try {
        teamData.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
      } catch (e) {
        console.log('Invalid social links format:', e);
      }
    }

    // Handle achievements (if provided as JSON string)
    if (achievements) {
      try {
        teamData.achievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
      } catch (e) {
        console.log('Invalid achievements format:', e);
      }
    }

    // Handle publications (if provided as JSON string)
    if (publications) {
      try {
        teamData.publications = typeof publications === 'string' ? JSON.parse(publications) : publications;
      } catch (e) {
        console.log('Invalid publications format:', e);
      }
    }

    const newTeamMember = new Team(teamData);
    const savedMember = await newTeamMember.save();

    console.log('Team member created successfully:', savedMember._id);

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: savedMember
    });

  } catch (error) {
    console.error('Error creating team member:', error);
    
    // Delete uploaded file if team creation fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create team member'
    });
  }
});

// @desc    Update team member
// @route   PUT /api/admin/team/:id
// @access  Private (Admin)
router.put('/admin/:id', authenticateAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    console.log('Updating team member:', req.params.id);
    console.log('Update data:', req.body);
    console.log('New file:', req.file);

    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const {
      name,
      position,
      email,
      phone,
      bio,
      education,
      experience,
      specialization,
      department,
      displayOrder,
      joinDate,
      isActive,
      socialLinks,
      achievements,
      publications
    } = req.body;

    // Update fields
    if (name) teamMember.name = name.trim();
    if (position) teamMember.position = position.trim();
    if (email !== undefined) teamMember.email = email ? email.trim() : undefined;
    if (phone !== undefined) teamMember.phone = phone ? phone.trim() : undefined;
    if (bio !== undefined) teamMember.bio = bio ? bio.trim() : undefined;
    if (education !== undefined) teamMember.education = education ? education.trim() : undefined;
    if (experience !== undefined) teamMember.experience = experience ? experience.trim() : undefined;
    if (specialization !== undefined) teamMember.specialization = specialization ? specialization.trim() : undefined;
    if (department) teamMember.department = department;
    if (displayOrder !== undefined) teamMember.displayOrder = parseInt(displayOrder);
    if (joinDate) teamMember.joinDate = new Date(joinDate);
    if (isActive !== undefined) teamMember.isActive = isActive === 'true' || isActive === true;

    // Handle new profile image
    if (req.file) {
      // Delete old image if exists
      if (teamMember.profileImage) {
        const oldImagePath = path.join('.', teamMember.profileImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      teamMember.profileImage = `/uploads/team-images/${req.file.filename}`;
    }

    // Handle social links
    if (socialLinks) {
      try {
        teamMember.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
      } catch (e) {
        console.log('Invalid social links format:', e);
      }
    }

    // Handle achievements
    if (achievements) {
      try {
        teamMember.achievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
      } catch (e) {
        console.log('Invalid achievements format:', e);
      }
    }

    // Handle publications
    if (publications) {
      try {
        teamMember.publications = typeof publications === 'string' ? JSON.parse(publications) : publications;
      } catch (e) {
        console.log('Invalid publications format:', e);
      }
    }

    const updatedMember = await teamMember.save();

    console.log('Team member updated successfully:', updatedMember._id);

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedMember
    });

  } catch (error) {
    console.error('Error updating team member:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update team member'
    });
  }
});

// @desc    Delete team member
// @route   DELETE /api/admin/team/:id
// @access  Private (Admin)
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    console.log('Deleting team member:', req.params.id);

    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Delete profile image if exists
    if (teamMember.profileImage) {
      const imagePath = path.join('.', teamMember.profileImage);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting team member image:', err);
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    console.log('Team member deleted successfully:', req.params.id);

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member'
    });
  }
});

// @desc    Toggle team member status (active/inactive)
// @route   PATCH /api/admin/team/:id/toggle-status
// @access  Private (Admin)
router.patch('/admin/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    teamMember.isActive = !teamMember.isActive;
    await teamMember.save();

    res.json({
      success: true,
      message: `Team member ${teamMember.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: teamMember.isActive }
    });

  } catch (error) {
    console.error('Error toggling team member status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle team member status'
    });
  }
});

// @desc    Update display order for multiple team members
// @route   PUT /api/admin/team/reorder
// @access  Private (Admin)
router.put('/admin/reorder', authenticateAdmin, async (req, res) => {
  try {
    const { teamOrder } = req.body; // Array of {id, displayOrder}
    
    if (!Array.isArray(teamOrder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team order data'
      });
    }

    const updatePromises = teamOrder.map(({ id, displayOrder }) => 
      Team.findByIdAndUpdate(id, { displayOrder: parseInt(displayOrder) })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Team display order updated successfully'
    });

  } catch (error) {
    console.error('Error updating team order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team order'
    });
  }
});

module.exports = router;
