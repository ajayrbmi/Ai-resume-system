const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requirements: [String],
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
    default: 'mid'
  },
  skillsRequired: [String],
  minScore: {
    type: Number,
    default: 70
  },
  location: String,
  salary: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }  
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
