const express = require('express');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');
const router = express.Router();
const { openai, getModel } = require('../utils/ai');

// @desc    Create a new job
// @route   POST /api/jobs
router.post('/', auth, checkRole(['recruiter', 'hr_admin']), async (req, res) => {
  try {
    const { title, company, description, requirements, location, salary, experienceLevel, minScore } = req.body;
    
    // Auto-extract skills/keywords using AI
    const prompt = `Extract a list of 5-10 specific technical skills and keywords from this job description:
    "${description}"
    Return ONLY a JSON object in this format: { "keywords": ["skill1", "skill2"] }`;

    const completion = await openai.chat.completions.create({
      model: getModel(),
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(content);
    const skillsRequired = parsed.keywords || parsed.skills || [];

    const job = await Job.create({
      title,
      company,
      description,
      requirements,
      experienceLevel,
      minScore,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      location,
      salary,
      postedBy: req.user.id
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Job Creation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
router.put('/:id', auth, checkRole(['recruiter', 'hr_admin']), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Make sure user owns job or is admin
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'hr_admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
router.delete('/:id', auth, checkRole(['recruiter', 'hr_admin']), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'hr_admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all jobs (HR Admin sees all, Recruiter sees their own)
// @route   GET /api/jobs
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'recruiter') {
      query.postedBy = req.user.id;
    }
    
    const jobs = await Job.find(query).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get recruiter stats
// @route   GET /api/jobs/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const jobCount = await Job.countDocuments({ postedBy: req.user.id });
    const resumeCount = await Resume.countDocuments({ userId: req.user.id });
    
    // Calculate average match score from reports
    const resumes = await Resume.find({ userId: req.user.id });
    const resumeIds = resumes.map(r => r._id);
    
    const reports = await Report.find({ resumeId: { $in: resumeIds } });
    const avgScore = reports.length > 0 
      ? Math.round(reports.reduce((acc, r) => acc + (r.matchScore || 0), 0) / reports.length) 
      : 0;

    res.json({
      success: true,
      stats: {
        jobCount,
        resumeCount,
        avgScore: `${avgScore}%`
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single job
// @route   GET /api/jobs/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
