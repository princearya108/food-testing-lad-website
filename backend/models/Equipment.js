const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
    maxlength: [200, 'Equipment name cannot exceed 200 characters']
  },
  model: {
    type: String,
    trim: true,
    maxlength: [100, 'Model cannot exceed 100 characters']
  },
  manufacturer: {
    type: String,
    trim: true,
    maxlength: [100, 'Manufacturer cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Spectroscopy',
      'Chromatography', 
      'Mass Spectrometry',
      'Analytical Balance',
      'Sample Preparation',
      'Microbiology',
      'Cell Culture',
      'General Laboratory',
      'Safety Equipment',
      'Environmental Control'
    ],
    default: 'General Laboratory'
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  technicalSpecs: {
    type: String,
    maxlength: [3000, 'Technical specifications cannot exceed 3000 characters']
  },
  applications: {
    type: String,
    maxlength: [1500, 'Applications cannot exceed 1500 characters']
  },
  serialNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Serial number cannot exceed 50 characters']
  },
  purchaseDate: {
    type: Date
  },
  warrantyExpiry: {
    type: Date
  },
  maintenanceSchedule: {
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'As Needed'],
      default: 'Monthly'
    },
    lastMaintenance: Date,
    nextMaintenance: Date,
    maintenanceNotes: String
  },
  operatingStatus: {
    type: String,
    enum: ['Operational', 'Under Maintenance', 'Out of Order', 'Retired'],
    default: 'Operational'
  },
  location: {
    building: String,
    floor: String,
    room: String,
    exactLocation: String
  },
  responsiblePerson: {
    name: String,
    email: String,
    phone: String,
    department: String
  },
  equipmentImages: [{
    type: String // Store image paths
  }],
  manuals: [{
    title: String,
    filePath: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  calibrationHistory: [{
    date: Date,
    calibratedBy: String,
    certificateNumber: String,
    nextCalibration: Date,
    notes: String
  }],
  usageLog: [{
    date: {
      type: Date,
      default: Date.now
    },
    user: String,
    purpose: String,
    duration: Number, // in minutes
    notes: String
  }],
  cost: {
    purchasePrice: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    annualMaintenanceCost: Number
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isPublicDisplay: {
    type: Boolean,
    default: true // Whether to show on public website
  },
  featured: {
    type: Boolean,
    default: false // Featured equipment for homepage
  }
}, {
  timestamps: true
});

// Indexes for better performance
equipmentSchema.index({ category: 1, isActive: 1 });
equipmentSchema.index({ operatingStatus: 1 });
equipmentSchema.index({ name: 'text', description: 'text', manufacturer: 'text' });
equipmentSchema.index({ isPublicDisplay: 1, featured: 1 });

// Virtual for next maintenance due
equipmentSchema.virtual('isMaintenanceDue').get(function() {
  if (!this.maintenanceSchedule.nextMaintenance) return false;
  return this.maintenanceSchedule.nextMaintenance <= new Date();
});

// Virtual for warranty status
equipmentSchema.virtual('isUnderWarranty').get(function() {
  if (!this.warrantyExpiry) return false;
  return this.warrantyExpiry > new Date();
});

// Method to log equipment usage
equipmentSchema.methods.logUsage = function(user, purpose, duration, notes) {
  this.usageLog.push({
    user,
    purpose,
    duration,
    notes
  });
  return this.save();
};

// Method to schedule next maintenance
equipmentSchema.methods.scheduleNextMaintenance = function() {
  if (!this.maintenanceSchedule.frequency) return;
  
  const lastMaintenance = this.maintenanceSchedule.lastMaintenance || new Date();
  let nextDate = new Date(lastMaintenance);
  
  switch (this.maintenanceSchedule.frequency) {
    case 'Daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'Weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'Monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'Quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'Annually':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  this.maintenanceSchedule.nextMaintenance = nextDate;
  return this.save();
};

// Static method to get equipment by category
equipmentSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category, 
    isActive: true,
    isPublicDisplay: true 
  })
  .sort({ displayOrder: 1, createdAt: 1 })
  .select('-usageLog -calibrationHistory -cost -responsiblePerson');
};

// Static method to get featured equipment
equipmentSchema.statics.getFeatured = function() {
  return this.find({ 
    featured: true, 
    isActive: true,
    isPublicDisplay: true 
  })
  .sort({ displayOrder: 1 })
  .select('-usageLog -calibrationHistory -cost -responsiblePerson');
};

// Static method to get equipment due for maintenance
equipmentSchema.statics.getMaintenanceDue = function() {
  const today = new Date();
  return this.find({
    'maintenanceSchedule.nextMaintenance': { $lte: today },
    operatingStatus: { $ne: 'Retired' },
    isActive: true
  }).sort({ 'maintenanceSchedule.nextMaintenance': 1 });
};

module.exports = mongoose.model('Equipment', equipmentSchema);
