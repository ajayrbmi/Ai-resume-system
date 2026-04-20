const express = require('express');
const { openai, getModel } = require('../utils/ai');
const Report = require('../models/Report');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const router = express.Router();

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

Return JSON ONLY:
{
  "matchScore": number (0-100),
  "skillGaps": [{"skill": "string", "confidence": 0.8}],
  "keywordMatches": [{"keyword": "string", "found": true}],
  "suggestions": ["string"],
  "readabilityScore": number
}`;

    const completion = await openai.chat.completions.create({
      model: getModel(),
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(content);

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
    console.error('Match Error:', error);
    res.status(500).json({ message: 'Analysis failed' });
  }
});

module.exports = router;

