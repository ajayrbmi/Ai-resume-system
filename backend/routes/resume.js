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

const OpenAI = require('openai');
const { parseFile } = require('../utils/fileParser');
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
const Report = require('../models/Report'); // Needed for JD match

// @desc    Upload & parse resume & optionally match JD
// @route   POST /api/resume/upload
router.post('/upload', auth, upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'jd', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const resumeFile = req.files.resume[0];
    const jdFile = req.files.jd ? req.files.jd[0] : null;

    // Parse resume file
    const resumeText = await parseFile(resumeFile.path, resumeFile.mimetype);

    // Extract structured data from resume using OpenAI
    const prompt = `Extract the following fields from the resume text into JSON format: name, email, phone, skills (array of strings), experience (array of {title, company, duration, bullets: [strings]}), education (array of {degree, institution, year}), summary. Resume text: ${resumeText}`;

    const completion = await openai.chat.completions.create({
      model: process.env.MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const parsedData = JSON.parse(completion.choices[0].message.content);

    const resume = await Resume.create({
      userId: req.user.id,
      originalFile: {
        name: resumeFile.originalname,
        path: resumeFile.path,
        size: resumeFile.size,
        mimetype: resumeFile.mimetype
      },
      parsedData
    });
    
    let matchReport = null;
    
    // If JD is uploaded, parse it and create match report
    if (jdFile) {
      const jdText = await parseFile(jdFile.path, jdFile.mimetype);
      
      const matchPrompt = `Analyze this resume vs job description:
      
Resume: ${JSON.stringify(parsedData)}
JD: ${jdText}

Return JSON:
{
  "matchScore": number (0-100),
  "skillGaps": [{"skill": "string", "confidence": number}],
  "keywordMatches": [{"keyword": "string", "found": boolean}],
  "suggestions": ["string"],
  "readabilityScore": number
}`;

      const matchCompletion = await openai.chat.completions.create({
        model: process.env.MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: matchPrompt }],
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(matchCompletion.choices[0].message.content);

      matchReport = await Report.create({
        resumeId: resume._id,
        jdText,
        ...analysis
      });
    }

    res.status(201).json({
      success: true,
      resume: {
        id: resume._id,
        parsedData: resume.parsedData
      },
      matchReport: matchReport ? { id: matchReport._id, ...matchReport._doc } : null
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

