const express = require('express');
const OpenAI = require('openai');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc    AI Resume Enhancement
// @route   POST /api/resume/enhance
router.post('/enhance', auth, async (req, res) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const prompt = `Enhance this resume for ATS and impact:

Original: ${JSON.stringify(resume.parsedData)}

Instructions:
1. Make bullet points action-oriented (start with verbs)
2. Add quantifiable achievements
3. Optimize for ATS (keywords natural)
4. Improve summary
5. Suggest skills

Return JSON:
{
  "summary": "enhanced summary",
  "skills": ["skill1", "skill2"],
  "experience": [{"title": "", "company": "", "bullets": [""]}],
  "atsKeywords": ["keyword1"]
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const enhancedData = JSON.parse(completion.choices[0].message.content);

    // Update resume
    resume.enhancedData = enhancedData;
    await resume.save();

    res.json({
      success: true,
      enhancedData
    });
  } catch (error) {
    res.status(500).json({ message: 'Enhancement failed', error: error.message });
  }
});

module.exports = router;

