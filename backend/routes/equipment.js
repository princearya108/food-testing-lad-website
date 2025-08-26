const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Equipment = require('../models/Equipment');
const { authenticateAdmin, optionalAuth } = require('../middleware/auth');

// Multer configuration for equipment images and manuals
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'equipmentImages') {
      uploadPath = './uploads/equipment-images';
    } else if (file.fieldname === 'manuals') {
      uploadPath = './uploads/equipment-manuals';
    } else {
      uploadPath = './uploads/equipment';
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    const prefix = file.fieldname === 'manuals' ? 'manual-' : 'equipment-';
    cb(null, prefix + uniqueSuffix + fileExt);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'equipmentImages') {
      const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedImageTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed for equipment images'));
      }
    } else if (file.fieldname === 'manuals') {
      const allowedDocTypes = /pdf|doc|docx|txt/;
      const extname = allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = /application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|text\/plain/.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only document files (PDF, DOC, DOCX, TXT) are allowed for manuals'));
      }
    } else {
      cb(new Error('Invalid file field'));
    }
  }
});

// @desc    Get all equipment (Public)
// @route   GET /api/equipment
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const category = req.query.category;
    const featured = req.query.featured === 'true';
    
    let equipment;
    
    if (featured) {
      equipment = await Equipment.getFeatured();
    } else if (category && category !== 'all') {
      equipment = await Equipment.getByCategory(category);
    } else {
      equipment = await Equipment.find({ 
        isActive: true, 
        isPublicDisplay: true 
      })
      .sort({ displayOrder: 1, createdAt: 1 })
      .select('-usageLog -calibrationHistory -cost -responsiblePerson');
    }

    res.json({
      success: true,
      data: equipment,
      count: equipment.length
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching equipment'
    });
  }
});

// @desc    Get equipment by ID (Public)
// @route   GET /api/equipment/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .select('-usageLog -calibrationHistory -cost -responsiblePerson');
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching equipment'
    });
  }
});

// @desc    Get all equipment for admin (includes all data)
// @route   GET /api/admin/equipment/all
// @access  Private (Admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'operational', 'maintenance', 'out-of-order', 'retired', 'all'
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    
    // Status filter
    if (status && status !== 'all') {
      const statusMap = {
        'operational': 'Operational',
        'maintenance': 'Under Maintenance',
        'out-of-order': 'Out of Order',
        'retired': 'Retired'
      };
      query.operatingStatus = statusMap[status];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const equipment = await Equipment.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Equipment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    console.log('Equipment fetch query:', query);
    console.log('Equipment results count:', equipment.length);

    res.json({
      success: true,
      data: {
        equipment,
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
    console.error('Error fetching equipment for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching equipment'
    });
  }
});

// @desc    Create new equipment
// @route   POST /api/admin/equipment/create
// @access  Private (Admin)
router.post('/admin/create', authenticateAdmin, upload.fields([
  { name: 'equipmentImages', maxCount: 5 },
  { name: 'manuals', maxCount: 3 }
]), async (req, res) => {
  try {
    console.log('Creating equipment with data:', req.body);
    console.log('Uploaded files:', req.files);

    const {
      name,
      model,
      manufacturer,
      category,
      description,
      technicalSpecs,
      applications,
      serialNumber,
      purchaseDate,
      warrantyExpiry,
      operatingStatus,
      location,
      responsiblePerson,
      cost,
      tags,
      displayOrder,
      isPublicDisplay,
      featured,
      maintenanceSchedule
    } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Equipment name and category are required'
      });
    }

    const equipmentData = {
      name: name.trim(),
      category,
      operatingStatus: operatingStatus || 'Operational',
      displayOrder: parseInt(displayOrder) || 0,
      isPublicDisplay: isPublicDisplay !== 'false',
      featured: featured === 'true'
    };

    // Add optional fields
    if (model) equipmentData.model = model.trim();
    if (manufacturer) equipmentData.manufacturer = manufacturer.trim();
    if (description) equipmentData.description = description.trim();
    if (technicalSpecs) equipmentData.technicalSpecs = technicalSpecs.trim();
    if (applications) equipmentData.applications = applications.trim();
    if (serialNumber) equipmentData.serialNumber = serialNumber.trim();
    if (purchaseDate) equipmentData.purchaseDate = new Date(purchaseDate);
    if (warrantyExpiry) equipmentData.warrantyExpiry = new Date(warrantyExpiry);

    // Handle location (if provided as JSON string)
    if (location) {
      try {
        equipmentData.location = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (e) {
        console.log('Invalid location format:', e);
      }
    }

    // Handle responsible person (if provided as JSON string)
    if (responsiblePerson) {
      try {
        equipmentData.responsiblePerson = typeof responsiblePerson === 'string' ? JSON.parse(responsiblePerson) : responsiblePerson;
      } catch (e) {
        console.log('Invalid responsible person format:', e);
      }
    }

    // Handle cost (if provided as JSON string)
    if (cost) {
      try {
        equipmentData.cost = typeof cost === 'string' ? JSON.parse(cost) : cost;
      } catch (e) {
        console.log('Invalid cost format:', e);
      }
    }

    // Handle maintenance schedule (if provided as JSON string)
    if (maintenanceSchedule) {
      try {
        equipmentData.maintenanceSchedule = typeof maintenanceSchedule === 'string' ? JSON.parse(maintenanceSchedule) : maintenanceSchedule;
      } catch (e) {
        console.log('Invalid maintenance schedule format:', e);
      }
    }

    // Handle tags
    if (tags) {
      try {
        equipmentData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        // If not JSON, treat as comma-separated string
        equipmentData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Handle uploaded files
    if (req.files) {
      if (req.files.equipmentImages) {
        equipmentData.equipmentImages = req.files.equipmentImages.map(file => 
          `/uploads/equipment-images/${file.filename}`
        );
      }
      
      if (req.files.manuals) {
        equipmentData.manuals = req.files.manuals.map(file => ({
          title: file.originalname,
          filePath: `/uploads/equipment-manuals/${file.filename}`
        }));
      }
    }

    const newEquipment = new Equipment(equipmentData);
    const savedEquipment = await newEquipment.save();

    console.log('Equipment created successfully:', savedEquipment._id);

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: savedEquipment
    });

  } catch (error) {
    console.error('Error creating equipment:', error);
    
    // Delete uploaded files if equipment creation fails
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        if (file.path) {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
          });
        }
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
      message: error.message || 'Failed to create equipment'
    });
  }
});

// @desc    Update equipment
// @route   PUT /api/admin/equipment/:id
// @access  Private (Admin)
router.put('/admin/:id', authenticateAdmin, upload.fields([
  { name: 'equipmentImages', maxCount: 5 },
  { name: 'manuals', maxCount: 3 }
]), async (req, res) => {
  try {
    console.log('Updating equipment:', req.params.id);
    console.log('Update data:', req.body);
    console.log('New files:', req.files);

    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    const {
      name,
      model,
      manufacturer,
      category,
      description,
      technicalSpecs,
      applications,
      serialNumber,
      purchaseDate,
      warrantyExpiry,
      operatingStatus,
      location,
      responsiblePerson,
      cost,
      tags,
      displayOrder,
      isPublicDisplay,
      featured,
      maintenanceSchedule
    } = req.body;

    // Update fields
    if (name) equipment.name = name.trim();
    if (model !== undefined) equipment.model = model ? model.trim() : undefined;
    if (manufacturer !== undefined) equipment.manufacturer = manufacturer ? manufacturer.trim() : undefined;
    if (category) equipment.category = category;
    if (description !== undefined) equipment.description = description ? description.trim() : undefined;
    if (technicalSpecs !== undefined) equipment.technicalSpecs = technicalSpecs ? technicalSpecs.trim() : undefined;
    if (applications !== undefined) equipment.applications = applications ? applications.trim() : undefined;
    if (serialNumber !== undefined) equipment.serialNumber = serialNumber ? serialNumber.trim() : undefined;
    if (purchaseDate) equipment.purchaseDate = new Date(purchaseDate);
    if (warrantyExpiry) equipment.warrantyExpiry = new Date(warrantyExpiry);
    if (operatingStatus) equipment.operatingStatus = operatingStatus;
    if (displayOrder !== undefined) equipment.displayOrder = parseInt(displayOrder);
    if (isPublicDisplay !== undefined) equipment.isPublicDisplay = isPublicDisplay !== 'false';
    if (featured !== undefined) equipment.featured = featured === 'true';

    // Handle complex objects
    if (location) {
      try {
        equipment.location = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (e) {
        console.log('Invalid location format:', e);
      }
    }

    if (responsiblePerson) {
      try {
        equipment.responsiblePerson = typeof responsiblePerson === 'string' ? JSON.parse(responsiblePerson) : responsiblePerson;
      } catch (e) {
        console.log('Invalid responsible person format:', e);
      }
    }

    if (cost) {
      try {
        equipment.cost = typeof cost === 'string' ? JSON.parse(cost) : cost;
      } catch (e) {
        console.log('Invalid cost format:', e);
      }
    }

    if (maintenanceSchedule) {
      try {
        equipment.maintenanceSchedule = typeof maintenanceSchedule === 'string' ? JSON.parse(maintenanceSchedule) : maintenanceSchedule;
      } catch (e) {
        console.log('Invalid maintenance schedule format:', e);
      }
    }

    if (tags) {
      try {
        equipment.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        equipment.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Handle new uploaded files
    if (req.files) {
      if (req.files.equipmentImages) {
        // Delete old images if exists
        if (equipment.equipmentImages && equipment.equipmentImages.length > 0) {
          equipment.equipmentImages.forEach(imagePath => {
            const oldImagePath = path.join('.', imagePath);
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error('Error deleting old image:', err);
            });
          });
        }
        equipment.equipmentImages = req.files.equipmentImages.map(file => 
          `/uploads/equipment-images/${file.filename}`
        );
      }
      
      if (req.files.manuals) {
        // Delete old manuals if exists
        if (equipment.manuals && equipment.manuals.length > 0) {
          equipment.manuals.forEach(manual => {
            if (manual.filePath) {
              const oldManualPath = path.join('.', manual.filePath);
              fs.unlink(oldManualPath, (err) => {
                if (err) console.error('Error deleting old manual:', err);
              });
            }
          });
        }
        equipment.manuals = req.files.manuals.map(file => ({
          title: file.originalname,
          filePath: `/uploads/equipment-manuals/${file.filename}`
        }));
      }
    }

    const updatedEquipment = await equipment.save();

    console.log('Equipment updated successfully:', updatedEquipment._id);

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      data: updatedEquipment
    });

  } catch (error) {
    console.error('Error updating equipment:', error);

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
      message: error.message || 'Failed to update equipment'
    });
  }
});

// @desc    Delete equipment
// @route   DELETE /api/admin/equipment/:id
// @access  Private (Admin)
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    console.log('Deleting equipment:', req.params.id);

    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Delete associated files
    if (equipment.equipmentImages && equipment.equipmentImages.length > 0) {
      equipment.equipmentImages.forEach(imagePath => {
        const fullPath = path.join('.', imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error('Error deleting equipment image:', err);
        });
      });
    }

    if (equipment.manuals && equipment.manuals.length > 0) {
      equipment.manuals.forEach(manual => {
        if (manual.filePath) {
          const fullPath = path.join('.', manual.filePath);
          fs.unlink(fullPath, (err) => {
            if (err) console.error('Error deleting equipment manual:', err);
          });
        }
      });
    }

    await Equipment.findByIdAndDelete(req.params.id);

    console.log('Equipment deleted successfully:', req.params.id);

    res.json({
      success: true,
      message: 'Equipment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete equipment'
    });
  }
});

// @desc    Toggle equipment status
// @route   PATCH /api/admin/equipment/:id/toggle-status
// @access  Private (Admin)
router.patch('/admin/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    equipment.isActive = !equipment.isActive;
    await equipment.save();

    res.json({
      success: true,
      message: `Equipment ${equipment.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: equipment.isActive }
    });

  } catch (error) {
    console.error('Error toggling equipment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle equipment status'
    });
  }
});

// @desc    Log equipment usage
// @route   POST /api/admin/equipment/:id/log-usage
// @access  Private (Admin)
router.post('/admin/:id/log-usage', authenticateAdmin, async (req, res) => {
  try {
    const { user, purpose, duration, notes } = req.body;
    
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    await equipment.logUsage(user, purpose, duration, notes);

    res.json({
      success: true,
      message: 'Equipment usage logged successfully'
    });

  } catch (error) {
    console.error('Error logging equipment usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log equipment usage'
    });
  }
});

// @desc    Get equipment maintenance due
// @route   GET /api/admin/equipment/maintenance-due
// @access  Private (Admin)
router.get('/admin/maintenance-due', authenticateAdmin, async (req, res) => {
  try {
    const equipmentDue = await Equipment.getMaintenanceDue();

    res.json({
      success: true,
      data: equipmentDue,
      count: equipmentDue.length
    });

  } catch (error) {
    console.error('Error fetching maintenance due equipment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance due equipment'
    });
  }
});

module.exports = router;
