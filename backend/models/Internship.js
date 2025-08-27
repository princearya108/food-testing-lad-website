const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  stipend: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    enum: ['Bhubaneswar', 'Remote', 'On-site', 'Hybrid'],
    default: 'Bhubaneswar'
  },
  category: {
    type: String,
    enum: ['Technical', 'Research', 'Administrative', 'Field Work', 'Laboratory'],
    required: true
  },
  positions: {
    type: Number,
    default: 1,
    min: 1
  },
  deadline: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'filled'],
    default: 'active'
  },
  skills: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  responsibilities: {
    type: [String],
    default: []
  },
  eligibility: {
    type: String,
    default: ''
  },
  applicationInstructions: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  supervisor: {
    type: String,
    trim: true
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  isPartTime: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
internshipSchema.index({ status: 1, deadline: 1 });
internshipSchema.index({ category: 1, status: 1 });
internshipSchema.index({ featured: -1, createdAt: -1 });
internshipSchema.index({ title: 'text', description: 'text' });

// Virtual for checking if deadline has passed
internshipSchema.virtual('isExpired').get(function() {
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});

// Auto-close internships past deadline
internshipSchema.pre('save', function(next) {
  if (this.deadline && new Date() > this.deadline && this.status === 'active') {
    this.status = 'closed';
  }
  next();
});

module.exports = mongoose.model('Internship', internshipSchema);
