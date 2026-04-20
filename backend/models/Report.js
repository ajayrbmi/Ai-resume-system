const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  jdText: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  skillGaps: [{
    skill: String,
    confidence: Number
  }],
  keywordMatches: [{
    keyword: String,
    found: Boolean
  }],
  suggestions: [String],
  recruiterFeedback: String,
  readabilityScore: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);

