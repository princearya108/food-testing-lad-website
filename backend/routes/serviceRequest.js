const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const { authenticateAdmin } = require('../middleware/auth');

// @desc    Submit service request
// @route   POST /api/service-request
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('Service request body:', req.body);
    
    // Validate required fields
    const { name, email, phone, serviceType, sampleDetails, requirements } = req.body;
    
    if (!name || !email || !phone || !serviceType || !sampleDetails || !requirements) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, service type, sample details, and requirements are required'
      });
    }
    
    const serviceRequest = new ServiceRequest(req.body);
    await serviceRequest.save();
    
    console.log('Service request saved successfully:', serviceRequest._id);
    
    res.status(201).json({
      success: true,
      message: 'Service request submitted successfully',
      data: {
        id: serviceRequest._id,
        serviceType: serviceRequest.serviceType,
        status: serviceRequest.status
      }
    });
  } catch (error) {
    console.error('Service request submission error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to submit service request'
    });
  }
});

// @desc    Get all service requests (Admin)
// @route   GET /api/admin/service-requests/admin
// @access  Private (Admin)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    console.log('Admin fetching service requests...');
    console.log('Admin user:', req.admin);
    
    const serviceRequests = await ServiceRequest.find()
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${serviceRequests.length} service requests for admin`);
    
    res.json({
      success: true,
      count: serviceRequests.length,
      data: serviceRequests
    });
  } catch (error) {
    console.error('Get service requests error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// @desc    Get single service request (Admin)
// @route   GET /api/admin/service-requests/:id
// @access  Private (Admin)
router.get('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate('assignedTo', 'username email');
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }
    
    res.json({
      success: true,
      data: serviceRequest
    });
  } catch (error) {
    console.error('Get service request error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// @desc    Update service request status
// @route   PATCH /api/admin/service-requests/:id
// @access  Private (Admin)
router.patch('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status, assignedTo, quotationAmount, quotationNotes, notes } = req.body;
    
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }
    
    // Update fields if provided
    if (status) serviceRequest.status = status;
    if (assignedTo) serviceRequest.assignedTo = assignedTo;
    if (quotationAmount) serviceRequest.quotationAmount = quotationAmount;
    if (quotationNotes) serviceRequest.quotationNotes = quotationNotes;
    
    // Add notes if provided
    if (notes) {
      serviceRequest.additionalNotes = serviceRequest.additionalNotes 
        ? `${serviceRequest.additionalNotes}\n\n[${new Date().toISOString()}] ${notes}`
        : notes;
    }
    
    await serviceRequest.save();
    
    res.json({
      success: true,
      message: 'Service request updated successfully',
      data: serviceRequest
    });
  } catch (error) {
    console.error('Update service request error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// @desc    Delete service request (Admin)
// @route   DELETE /api/admin/service-requests/:id
// @access  Private (Admin)
router.delete('/admin/:id', authenticateAdmin, async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    
    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }
    
    await ServiceRequest.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Service request deleted successfully'
    });
  } catch (error) {
    console.error('Delete service request error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// @desc    Get service request statistics (Admin)
// @route   GET /api/admin/service-requests/stats
// @access  Private (Admin)
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const serviceTypeStats = await ServiceRequest.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalRequests = await ServiceRequest.countDocuments();
    const todayRequests = await ServiceRequest.countDocuments({
      createdAt: { 
        $gte: new Date().setHours(0, 0, 0, 0) 
      }
    });
    
    res.json({
      success: true,
      data: {
        statusStats: stats,
        serviceTypeStats: serviceTypeStats,
        totalRequests,
        todayRequests
      }
    });
  } catch (error) {
    console.error('Get service request stats error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;
