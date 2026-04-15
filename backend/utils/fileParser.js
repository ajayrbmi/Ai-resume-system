const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const parseFile = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (err) {
    console.error('Error parsing file:', err);
    throw err;
  }
};

module.exports = { parseFile };
