const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Food Testing', 'Research', 'Technology', 'Training', 'News', 'General']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  publishDate: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
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

// Create slug from title
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  
  this.updatedAt = new Date();
  next();
});

// Set publish date when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishDate) {
    this.publishDate = new Date();
  }
  next();
});

// Increment views
blogSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Static method to get published blogs
blogSchema.statics.getPublished = function() {
  return this.find({ status: 'published' })
             .populate('author', 'username')
             .sort({ publishDate: -1 });
};

// Static method to get featured blogs
blogSchema.statics.getFeatured = function(limit = 3) {
  return this.find({ 
    status: 'published',
    featuredImage: { $ne: null }
  })
  .populate('author', 'username')
  .sort({ publishDate: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Blog', blogSchema);
