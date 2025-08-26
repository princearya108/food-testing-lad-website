const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  phone: { 
    type: String,
    required: true 
  },
  company: {
    type: String,
    trim: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      'Food Testing',
      'Pharmaceutical Testing', 
      'Marine Products Testing',
      'Forensic Material Testing',
      'Nutritional & Nutraceutical Testing',
      'Microbiological Testing',
      'Animal Cell Culture',
      'In Silico Analysis'
    ]
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  sampleDetails: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  expectedDate: {
    type: Date
  },
  budget: {
    type: String
  },
  additionalNotes: {
    type: String
  },
  status: { 
    type: String, 
    enum: ['new', 'reviewed', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'new' 
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  quotationAmount: {
    type: Number,
    default: null
  },
  quotationNotes: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
serviceRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to update status
serviceRequestSchema.methods.updateStatus = async function(newStatus, notes = '') {
  this.status = newStatus;
  if (notes) {
    this.additionalNotes = this.additionalNotes 
      ? `${this.additionalNotes}\n\n[${new Date().toISOString()}] ${notes}`
      : notes;
  }
  return await this.save();
};

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);