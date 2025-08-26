const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  education: String,
  field: String,
  duration: String,
  experience: String,
  motivation: String,
  resume: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);
