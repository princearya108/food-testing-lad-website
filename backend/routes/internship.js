const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const InternshipApplication = require('../models/InternshipApplication');
const { authenticateAdmin } = require('../middleware/auth');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// @desc    Submit internship application
// @route   POST /api/internship
// @access  Public
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const applicationData = {
      ...req.body,
      resume: req.file ? req.file.path : null
    };
    
    const application = new InternshipApplication(applicationData);
    await application.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Internship application submitted successfully', 
      data: application 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// @desc    Get all internship applications (Admin)
// @route   GET /api/admin/internships
// @access  Private (Admin)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const applications = await InternshipApplication.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// @desc    Update application status
// @route   PATCH /api/admin/internships/:id
// @access  Private (Admin)
router.patch('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const application = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
