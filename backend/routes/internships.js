const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
// Get all active internships
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      location, 
      featured,
      limit = 10, 
      page = 1 
    } = req.query;
    
    const query = { status: 'active' };
    if (category) query.category = category;
    if (location) query.location = location;
    if (featured === 'true') query.featured = true;
    
    // Add deadline filter to show only non-expired internships
    query.$or = [
      { deadline: { $exists: false } },
      { deadline: null },
      { deadline: { $gte: new Date() } }
    ];
    
    const internships = await Internship.find(query)
      .select('-createdBy -__v')
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Internship.countDocuments(query);
    
    res.json({
      success: true,
      data: internships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships'
    });
  }
});

// Get single internship by ID
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      status: { $in: ['active', 'paused'] }
    }).select('-createdBy -__v');
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    res.json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internship'
    });
  }
});

// Get internship categories and locations
router.get('/meta/options', async (req, res) => {
  try {
    const categories = await Internship.distinct('category');
    const locations = await Internship.distinct('location');
    
    res.json({
      success: true,
      data: {
        categories,
        locations
      }
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch options'
    });
  }
});

// Admin routes (protected)
// Get all internships for admin
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { 
      status, 
      category, 
      location,
      search, 
      limit = 10, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (location) query.location = location;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const internships = await Internship.find(query)
      .populate('createdBy', 'username')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Internship.countDocuments(query);
    
    res.json({
      success: true,
      data: internships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching internships for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships'
    });
  }
});

// Create new internship
router.post('/admin', authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      duration,
      stipend,
      location,
      category,
      positions,
      deadline,
      startDate,
      endDate,
      status,
      skills,
      benefits,
      responsibilities,
      eligibility,
      applicationInstructions,
      contactEmail,
      contactPhone,
      department,
      supervisor,
      featured,
      isRemote,
      isPartTime
    } = req.body;
    
    const internship = new Internship({
      title,
      description,
      requirements,
      duration,
      stipend,
      location,
      category,
      positions: positions || 1,
      deadline: deadline ? new Date(deadline) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      status: status || 'active',
      skills: skills || [],
      benefits: benefits || [],
      responsibilities: responsibilities || [],
      eligibility,
      applicationInstructions,
      contactEmail,
      contactPhone,
      department,
      supervisor,
      featured: featured || false,
      isRemote: isRemote || false,
      isPartTime: isPartTime || false,
      createdBy: req.admin.id
    });
    
    await internship.save();
    await internship.populate('createdBy', 'username');
    
    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship
    });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create internship'
    });
  }
});

// Update internship
router.put('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    const {
      title,
      description,
      requirements,
      duration,
      stipend,
      location,
      category,
      positions,
      deadline,
      startDate,
      endDate,
      status,
      skills,
      benefits,
      responsibilities,
      eligibility,
      applicationInstructions,
      contactEmail,
      contactPhone,
      department,
      supervisor,
      featured,
      isRemote,
      isPartTime
    } = req.body;
    
    // Update internship
    Object.assign(internship, {
      title: title || internship.title,
      description: description || internship.description,
      requirements: requirements || internship.requirements,
      duration: duration || internship.duration,
      stipend: stipend !== undefined ? stipend : internship.stipend,
      location: location || internship.location,
      category: category || internship.category,
      positions: positions !== undefined ? positions : internship.positions,
      deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : internship.deadline,
      startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : internship.startDate,
      endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : internship.endDate,
      status: status || internship.status,
      skills: skills !== undefined ? skills : internship.skills,
      benefits: benefits !== undefined ? benefits : internship.benefits,
      responsibilities: responsibilities !== undefined ? responsibilities : internship.responsibilities,
      eligibility: eligibility !== undefined ? eligibility : internship.eligibility,
      applicationInstructions: applicationInstructions !== undefined ? applicationInstructions : internship.applicationInstructions,
      contactEmail: contactEmail !== undefined ? contactEmail : internship.contactEmail,
      contactPhone: contactPhone !== undefined ? contactPhone : internship.contactPhone,
      department: department !== undefined ? department : internship.department,
      supervisor: supervisor !== undefined ? supervisor : internship.supervisor,
      featured: featured !== undefined ? featured : internship.featured,
      isRemote: isRemote !== undefined ? isRemote : internship.isRemote,
      isPartTime: isPartTime !== undefined ? isPartTime : internship.isPartTime
    });
    
    await internship.save();
    await internship.populate('createdBy', 'username');
    
    res.json({
      success: true,
      message: 'Internship updated successfully',
      data: internship
    });
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship'
    });
  }
});

// Delete internship
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    await Internship.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete internship'
    });
  }
});

// Toggle internship status
router.patch('/admin/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }
    
    // Toggle between active and paused
    internship.status = internship.status === 'active' ? 'paused' : 'active';
    await internship.save();
    
    res.json({
      success: true,
      message: 'Internship status updated successfully',
      data: { status: internship.status }
    });
  } catch (error) {
    console.error('Error toggling internship status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

// Get internship statistics
router.get('/admin/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const stats = await Promise.all([
      Internship.countDocuments({ status: 'active' }),
      Internship.countDocuments({ status: 'paused' }),
      Internship.countDocuments({ status: 'closed' }),
      Internship.countDocuments({ featured: true }),
      Internship.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        active: stats[0],
        paused: stats[1],
        closed: stats[2],
        featured: stats[3],
        byCategory: stats[4]
      }
    });
  } catch (error) {
    console.error('Error fetching internship stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
