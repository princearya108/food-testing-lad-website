const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  metaDescription: {
    type: String,
    maxLength: 160,
    trim: true
  },
  metaKeywords: {
    type: [String],
    default: []
  },
  pageType: {
    type: String,
    enum: [
      'privacy-policy',
      'terms-of-service', 
      'about-us',
      'contact-us',
      'sitemap',
      'disclaimer',
      'refund-policy',
      'static'
    ],
    default: 'static'
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'private'],
    default: 'published'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isIndexable: {
    type: Boolean,
    default: true
  },
  customCSS: {
    type: String,
    default: ''
  },
  customJS: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate slug from title if not provided
pageSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better search performance
pageSchema.index({ slug: 1 });
pageSchema.index({ pageType: 1, status: 1 });
pageSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Page', pageSchema);
