const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [150, 'Position cannot exceed 150 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d\s\-\(\)]{0,20}$/, 'Please provide a valid phone number']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  profileImage: {
    type: String,
    default: null
  },
  education: {
    type: String,
    maxlength: [500, 'Education cannot exceed 500 characters']
  },
  experience: {
    type: String,
    maxlength: [500, 'Experience cannot exceed 500 characters']
  },
  specialization: {
    type: String,
    maxlength: [300, 'Specialization cannot exceed 300 characters']
  },
  department: {
    type: String,
    enum: ['Chemical', 'Biological', 'Administration', 'Management', 'Research'],
    default: 'Chemical'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  socialLinks: {
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    researchGate: {
      type: String,
      trim: true
    },
    orcid: {
      type: String,
      trim: true
    }
  },
  achievements: [{
    title: String,
    description: String,
    year: Number
  }],
  publications: [{
    title: String,
    journal: String,
    year: Number,
    url: String
  }]
}, {
  timestamps: true
});

// Index for better performance
teamSchema.index({ isActive: 1, displayOrder: 1 });
teamSchema.index({ department: 1 });

// Method to get full name with position
teamSchema.methods.getDisplayName = function() {
  return `${this.name} - ${this.position}`;
};

// Static method to get active team members sorted by display order
teamSchema.statics.getActiveMembers = function() {
  return this.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 })
    .select('-__v');
};

// Static method to get team by department
teamSchema.statics.getByDepartment = function(department) {
  return this.find({ department, isActive: true })
    .sort({ displayOrder: 1, createdAt: 1 })
    .select('-__v');
};

module.exports = mongoose.model('Team', teamSchema);
