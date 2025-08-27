const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
// Get all active services
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured,
      popular,
      search,
      limit = 10, 
      page = 1,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;
    
    const query = { status: 'active' };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (popular === 'true') query.popular = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const services = await Service.find(query)
      .select('-createdBy -lastUpdatedBy -__v')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Service.countDocuments(query);
    
    res.json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get single service by slug or ID
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by slug first, then by ID
    let service = await Service.findOne({
      slug: identifier,
      status: 'active'
    }).populate('relatedServices', 'name slug category price');
    
    if (!service) {
      service = await Service.findOne({
        _id: identifier,
        status: 'active'
      }).populate('relatedServices', 'name slug category price');
    }
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Increment request count
    service.requestCount += 1;
    await service.save();
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

// Get service categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Service.aggregate([
      { $match: { status: 'active' } },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          services: { $push: { name: '$name', slug: '$slug' } }
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get featured services
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const services = await Service.find({ 
      status: 'active', 
      featured: true 
    })
    .select('name slug category description price duration features')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching featured services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured services'
    });
  }
});

// Admin routes (protected)
// Get all services for admin
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { 
      status, 
      category, 
      featured,
      search, 
      limit = 10, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const services = await Service.find(query)
      .populate('createdBy', 'username')
      .populate('lastUpdatedBy', 'username')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Service.countDocuments(query);
    
    res.json({
      success: true,
      data: services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching services for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Create new service
router.post('/admin', authenticateAdmin, async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.admin.id,
      lastUpdatedBy: req.admin.id
    };
    
    // Handle price range
    if (req.body.priceMin && req.body.priceMax) {
      serviceData.priceRange = {
        min: parseFloat(req.body.priceMin),
        max: parseFloat(req.body.priceMax),
        currency: req.body.currency || 'INR'
      };
    }
    
    const service = new Service(serviceData);
    await service.save();
    await service.populate('createdBy', 'username');
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Service with this ${field} already exists`
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
});

// Update service
router.put('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Update service data
    Object.assign(service, req.body);
    service.lastUpdatedBy = req.admin.id;
    
    // Handle price range
    if (req.body.priceMin && req.body.priceMax) {
      service.priceRange = {
        min: parseFloat(req.body.priceMin),
        max: parseFloat(req.body.priceMax),
        currency: req.body.currency || 'INR'
      };
    }
    
    await service.save();
    await service.populate(['createdBy', 'lastUpdatedBy'], 'username');
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Service with this ${field} already exists`
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// Delete service
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    await Service.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

// Toggle service status
router.patch('/admin/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Toggle between active and inactive
    service.status = service.status === 'active' ? 'inactive' : 'active';
    service.lastUpdatedBy = req.admin.id;
    await service.save();
    
    res.json({
      success: true,
      message: 'Service status updated successfully',
      data: { status: service.status }
    });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

// Toggle featured status
router.patch('/admin/:id/toggle-featured', authenticateAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    service.featured = !service.featured;
    service.lastUpdatedBy = req.admin.id;
    await service.save();
    
    res.json({
      success: true,
      message: 'Service featured status updated successfully',
      data: { featured: service.featured }
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured status'
    });
  }
});

// Get service statistics
router.get('/admin/stats/overview', authenticateAdmin, async (req, res) => {
  try {
    const stats = await Promise.all([
      Service.countDocuments({ status: 'active' }),
      Service.countDocuments({ status: 'inactive' }),
      Service.countDocuments({ featured: true }),
      Service.countDocuments({ popular: true }),
      Service.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Service.aggregate([
        { $group: { _id: null, totalRequests: { $sum: '$requestCount' } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        active: stats[0],
        inactive: stats[1],
        featured: stats[2],
        popular: stats[3],
        byCategory: stats[4],
        totalRequests: stats[5][0]?.totalRequests || 0
      }
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
