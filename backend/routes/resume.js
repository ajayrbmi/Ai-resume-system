const express = require('express');
const multer = require('multer');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth'); // TODO: create middleware
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX allowed'));
    }
  }
});

// @desc    Upload & parse resume
// @route   POST /api/resume/upload
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // TODO: Parse file (PDF/DOCX)
    const parsedData = { /* parsing logic */ };

    const resume = await Resume.create({
      userId: req.user.id,
      originalFile: {
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      parsedData
    });

    res.status(201).json({
      success: true,
      resume: {
        id: resume._id,
        parsedData: resume.parsedData
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user resumes
// @route   GET /api/resume
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

