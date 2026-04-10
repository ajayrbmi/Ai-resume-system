const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFile: {
    name: String,
    path: String,
    size: Number,
    mimetype: String
  },
  parsedData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      bullets: [String]
    }],
    education: [{
      degree: String,
      institution: String,
      year: String
    }],
    summary: String
  },
  enhancedData: {
    summary: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      bullets: [String]
    }],
    atsKeywords: [String]
  },
  versions: [{
    name: String, // 'Corporate', 'Startup', etc.
    content: Object,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);

