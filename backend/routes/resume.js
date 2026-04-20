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

const { openai, getModel } = require('../utils/ai');
const { parseFile } = require('../utils/fileParser');
const Report = require('../models/Report'); 

// @desc    Upload & parse resumes (Bulk) & optionally match JD
// @route   POST /api/resume/upload
router.post('/upload', auth, upload.fields([{ name: 'resumes', maxCount: 10 }, { name: 'jd', maxCount: 1 }]), async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!req.files || !req.files.resumes) {
      return res.status(400).json({ message: 'No resume files uploaded' });
    }

    const resumeFiles = req.files.resumes;
    const jdFile = req.files.jd ? req.files.jd[0] : null;
    let jdText = '';

    if (jdFile) {
      jdText = await parseFile(jdFile.path, jdFile.mimetype);
    }

    const results = [];

    for (const resumeFile of resumeFiles) {
      // Parse resume file
      const resumeText = await parseFile(resumeFile.path, resumeFile.mimetype);

      // Extract structured data from resume using AI
      const prompt = `Extract the following fields from the resume text into JSON format: name, email, phone, skills (array of strings), experience (array of {title, company, duration, bullets: [strings]}), education (array of {degree, institution, year}), certifications (array of strings), summary. 
      IMPORTANT: Return ONLY the JSON object. Do not include any explanation or markdown formatting.
      
      Resume text: ${resumeText}`;

      const completion = await openai.chat.completions.create({
        model: getModel(),
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });

      let content = completion.choices[0].message.content;
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(content);

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
      
      // If JD is available, create match report
      if (jdText) {
        const matchPrompt = `Analyze this resume against the job description for ATS compatibility:
        
        Resume JSON: ${JSON.stringify(parsedData)}
        Job Description: ${jdText}

        Return JSON in this format:
        {
          "matchScore": number,
          "skillGaps": [{"skill": "string", "confidence": number}],
          "keywordMatches": [{"keyword": "string", "found": boolean}],
          "suggestions": ["string"],
          "readabilityScore": number
        }`;

        const matchCompletion = await openai.chat.completions.create({
          model: getModel(),
          messages: [{ role: 'user', content: matchPrompt }],
          response_format: { type: 'json_object' }
        });

        let matchContent = matchCompletion.choices[0].message.content;
        matchContent = matchContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(matchContent);

        matchReport = await Report.create({
          resumeId: resume._id,
          jobId,
          jdText,
          ...analysis
        });
      }

      results.push({
        resume: { id: resume._id, name: resumeFile.originalname, parsedData: resume.parsedData },
        matchReport: matchReport ? { id: matchReport._id, ...matchReport._doc } : null
      });
    }

    res.status(201).json({
      success: true,
      processedCount: results.length,
      results
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get candidates for a specific job
// @route   GET /api/resume/job/:jobId
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const reports = await Report.find({ jobId: req.params.jobId })
      .populate({
        path: 'resumeId',
        select: 'parsedData originalFile'
      })
      .sort({ matchScore: -1 });
    
    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get resumes (HR Admin sees all, others see their own)
// @route   GET /api/resume
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'hr_admin') {
      query.userId = req.user.id;
    }
    
    // Find resumes
    const resumes = await Resume.find(query).sort({ createdAt: -1 }).lean();
    
    // Attach latest match score to each resume
    const results = await Promise.all(resumes.map(async (resume) => {
      const latestReport = await Report.findOne({ resumeId: resume._id }).sort({ createdAt: -1 });
      return {
        ...resume,
        matchScore: latestReport ? latestReport.matchScore : null
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

