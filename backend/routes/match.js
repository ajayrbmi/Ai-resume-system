const express = require('express');
const OpenAI = require('openai');
const Report = require('../models/Report');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth'); // TODO
const router = express.Router();

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// @desc    JD matching & skill gap
// @route   POST /api/match/jd
router.post('/jd', auth, async (req, res) => {
  try {
    const { resumeId, jdText } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // AI Analysis Prompt
    const prompt = `Analyze this resume vs job description:
    
Resume: ${JSON.stringify(resume.parsedData)}
JD: ${jdText}

Return JSON:
{
  "matchScore": number (0-100),
  "skillGaps": [{"skill": "string", "confidence": 0.8}],
  "keywordMatches": [{"keyword": "string", "found": true}],
  "suggestions": ["string"],
  "readabilityScore": number
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    const report = await Report.create({
      resumeId,
      jdText,
      ...analysis
    });

    res.json({
      success: true,
      report: { id: report._id, ...analysis }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Analysis failed' });
  }
});

module.exports = router;

