const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.groq.com/openai/v1"
});

const getModel = () => process.env.MODEL || 'llama-3.1-8b-instant';

module.exports = {
  openai,
  getModel
};
