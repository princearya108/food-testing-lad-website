const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import configuration
const connectDB = require('./config/database');

// Import route files
const contactRoutes = require('./routes/contact');
const internshipRoutes = require('./routes/internship');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const serviceRequestRoutes = require('./routes/serviceRequest');
const teamRoutes = require('./routes/team');
const equipmentRoutes = require('./routes/equipment');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL || 'https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.netlify.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Create upload directories if they don't exist
const uploadDirs = ['./uploads', './uploads/resumes', './uploads/blog-images', './uploads/team-images', './uploads/equipment-images', './uploads/equipment-manuals'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../image')));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/internship', internshipRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/service-request', serviceRequestRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/equipment', equipmentRoutes);

// Admin routes
app.use('/api/admin/contacts', contactRoutes);
app.use('/api/admin/internships', internshipRoutes);
app.use('/api/admin/blogs', blogRoutes);
app.use('/api/admin/service-requests', serviceRequestRoutes);
app.use('/api/admin/team', teamRoutes);
app.use('/api/admin/equipment', equipmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'GTFTL Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
});