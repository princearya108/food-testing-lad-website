const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
// Get all published pages
router.get('/', async (req, res) => {
  try {
    const { type, limit = 10, page = 1 } = req.query;
    
    const query = { status: 'published' };
    if (type) query.pageType = type;
    
    const pages = await Page.find(query)
      .select('title slug pageType metaDescription createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Page.countDocuments(query);
    
    res.json({
      success: true,
      data: pages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pages'
    });
  }
});

// Get single page by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'username');
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    // Increment views
    page.views += 1;
    await page.save();
    
    res.json({
      success: true,
      data: page
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page'
    });
  }
});

// Admin routes (protected)
// Get all pages for admin
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { 
      status, 
      type, 
      search, 
      limit = 10, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.pageType = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const pages = await Page.find(query)
      .populate('author', 'username')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Page.countDocuments(query);
    
    res.json({
      success: true,
      data: pages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pages for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pages'
    });
  }
});

// Create new page
router.post('/admin', authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      metaDescription,
      metaKeywords,
      pageType,
      status,
      isIndexable,
      customCSS,
      customJS
    } = req.body;
    
    // Check if slug already exists
    if (slug) {
      const existingPage = await Page.findOne({ slug });
      if (existingPage) {
        return res.status(400).json({
          success: false,
          message: 'Page with this slug already exists'
        });
      }
    }
    
    const page = new Page({
      title,
      slug,
      content,
      metaDescription,
      metaKeywords: metaKeywords ? metaKeywords.split(',').map(k => k.trim()) : [],
      pageType: pageType || 'static',
      status: status || 'published',
      isIndexable: isIndexable !== undefined ? isIndexable : true,
      customCSS: customCSS || '',
      customJS: customJS || '',
      author: req.admin.id
    });
    
    await page.save();
    await page.populate('author', 'username');
    
    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: page
    });
  } catch (error) {
    console.error('Error creating page:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle MongoDB connection errors
    if (error.name === 'MongoNetworkError' || error.message.includes('connection')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again.',
        error: 'Database temporarily unavailable'
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Page with this slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create page',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update page
router.put('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      metaDescription,
      metaKeywords,
      pageType,
      status,
      isIndexable,
      customCSS,
      customJS
    } = req.body;
    
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    // Check if slug already exists (excluding current page)
    if (slug && slug !== page.slug) {
      const existingPage = await Page.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingPage) {
        return res.status(400).json({
          success: false,
          message: 'Page with this slug already exists'
        });
      }
    }
    
    // Update page
    page.title = title || page.title;
    page.slug = slug || page.slug;
    page.content = content || page.content;
    page.metaDescription = metaDescription !== undefined ? metaDescription : page.metaDescription;
    page.metaKeywords = metaKeywords ? metaKeywords.split(',').map(k => k.trim()) : page.metaKeywords;
    page.pageType = pageType || page.pageType;
    page.status = status || page.status;
    page.isIndexable = isIndexable !== undefined ? isIndexable : page.isIndexable;
    page.customCSS = customCSS !== undefined ? customCSS : page.customCSS;
    page.customJS = customJS !== undefined ? customJS : page.customJS;
    
    await page.save();
    await page.populate('author', 'username');
    
    res.json({
      success: true,
      message: 'Page updated successfully',
      data: page
    });
  } catch (error) {
    console.error('Error updating page:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Page with this slug already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update page'
    });
  }
});

// Delete page
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    await Page.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete page'
    });
  }
});

// Get page analytics
router.get('/admin/:id/analytics', authenticateAdmin, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    const analytics = {
      views: page.views,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      status: page.status,
      pageType: page.pageType
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching page analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

module.exports = router;
