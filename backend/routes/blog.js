const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/Blog');
const { authenticateAdmin, optionalAuth } = require('../middleware/auth');

// Multer configuration for blog images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/blog-images/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
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

// @desc    Get all published blogs (Public)
// @route   GET /api/blogs
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = { status: 'published' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        blogs,
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
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blogs'
    });
  }
});

// @desc    Get single blog by slug (Public)
// @route   GET /api/blogs/:slug
// @access  Public
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'username');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    await blog.incrementViews();

    res.json({
      success: true,
      data: {
        blog
      }
    });

  } catch (error) {
    console.error('Get single blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blog'
    });
  }
});

// @desc    Get featured blogs (Public)
// @route   GET /api/blogs/featured/posts
// @access  Public
router.get('/featured/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const blogs = await Blog.getFeatured(limit);

    res.json({
      success: true,
      data: {
        blogs
      }
    });

  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured blogs'
    });
  }
});

// Admin Routes (Protected)

// @desc    Get all blogs for admin (including drafts)
// @route   GET /api/admin/blogs
// @access  Private (Admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        blogs,
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
    console.error('Get admin blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blogs'
    });
  }
});

// @desc    Create new blog
// @route   POST /api/admin/blogs/create
// @access  Private (Admin)
router.post('/admin/create', authenticateAdmin, upload.single('featuredImage'), async (req, res) => {
  try {
    console.log('Blog creation request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const { title, excerpt, content, tags, category, status } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, excerpt, and content are required'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    const blogData = {
      title,
      slug,
      excerpt,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'General',
      status: status || 'draft',
      author: req.admin._id,
      featuredImage: req.file ? req.file.filename : null
    };

    console.log('Creating blog with data:', blogData);
    console.log('Admin user creating blog:', req.admin);

    const blog = new Blog(blogData);
    console.log('Blog object before save:', blog);
    
    await blog.save();
    console.log('Blog saved successfully with ID:', blog._id);

    const populatedBlog = await Blog.findById(blog._id).populate('author', 'username');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: {
        blog: populatedBlog
      }
    });

  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create blog post'
    });
  }
});

// @desc    Update blog
// @route   PUT /api/admin/blogs/:id
// @access  Private (Admin)
router.put('/admin/:id', authenticateAdmin, upload.single('featuredImage'), async (req, res) => {
  try {
    const { title, excerpt, content, tags, category, status } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Update fields
    blog.title = title || blog.title;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.tags = tags ? tags.split(',').map(tag => tag.trim()) : blog.tags;
    blog.category = category || blog.category;
    blog.status = status || blog.status;

    // Handle featured image update
    if (req.file) {
      // Delete old image if exists
      if (blog.featuredImage && fs.existsSync(blog.featuredImage)) {
        fs.unlinkSync(blog.featuredImage);
      }
      blog.featuredImage = req.file.path;
    }

    await blog.save();

    const populatedBlog = await Blog.findById(blog._id).populate('author', 'username');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: {
        blog: populatedBlog
      }
    });

  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating blog'
    });
  }
});

// @desc    Delete blog
// @route   DELETE /api/admin/blogs/:id
// @access  Private (Admin)
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Delete featured image if exists
    if (blog.featuredImage && fs.existsSync(blog.featuredImage)) {
      fs.unlinkSync(blog.featuredImage);
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting blog'
    });
  }
});

// @desc    Get single blog for admin (including drafts)
// @route   GET /api/admin/blogs/:id
// @access  Private (Admin)
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: {
        blog
      }
    });

  } catch (error) {
    console.error('Get admin single blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blog'
    });
  }
});

module.exports = router;
