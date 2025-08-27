const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxLength: 200,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Chemical Analysis',
      'Microbiological Testing',
      'Nutritional Analysis', 
      'Contaminant Detection',
      'Quality Control',
      'Pharmaceutical Testing',
      'Marine Products Testing',
      'Consultation Services',
      'Training Services',
      'Calibration Services'
    ],
    required: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  priceRange: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  duration: {
    type: String,
    trim: true
  },
  turnaroundTime: {
    type: String,
    trim: true
  },
  features: {
    type: [String],
    default: []
  },
  requirements: {
    type: [String],
    default: []
  },
  methodology: {
    type: String
  },
  instruments: {
    type: [String],
    default: []
  },
  standards: {
    type: [String],
    default: []
  },
  sampleTypes: {
    type: [String],
    default: []
  },
  parameters: {
    type: [String],
    default: []
  },
  reportFormat: {
    type: String,
    enum: ['PDF', 'Excel', 'Both'],
    default: 'PDF'
  },
  certification: {
    nabl: {
      type: Boolean,
      default: false
    },
    iso: {
      type: Boolean,
      default: false
    },
    other: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'coming-soon'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    maxLength: 160,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  gallery: {
    type: [String],
    default: []
  },
  relatedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  serviceCode: {
    type: String,
    unique: true,
    trim: true
  },
  minSampleSize: {
    type: String,
    trim: true
  },
  preservationMethod: {
    type: String,
    trim: true
  },
  shelfLife: {
    type: String,
    trim: true
  },
  bookingRequired: {
    type: Boolean,
    default: false
  },
  emergencyService: {
    type: Boolean,
    default: false
  },
  homeCollection: {
    type: Boolean,
    default: false
  },
  onlineReporting: {
    type: Boolean,
    default: true
  },
  requestCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Generate slug from name if not provided
serviceSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Generate service code if not provided
  if (!this.serviceCode) {
    const categoryCode = this.category.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    this.serviceCode = `${categoryCode}${randomNum}`;
  }
  
  next();
});

// Indexes for better query performance
serviceSchema.index({ slug: 1 });
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ featured: -1, popular: -1 });
serviceSchema.index({ status: 1, createdAt: -1 });
serviceSchema.index({ name: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ serviceCode: 1 });

// Virtual for price display
serviceSchema.virtual('displayPrice').get(function() {
  if (this.price) return this.price;
  if (this.priceRange && this.priceRange.min && this.priceRange.max) {
    return `₹${this.priceRange.min} - ₹${this.priceRange.max}`;
  }
  return 'Contact for pricing';
});

module.exports = mongoose.model('Service', serviceSchema);
