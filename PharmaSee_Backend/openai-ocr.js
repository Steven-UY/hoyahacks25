require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { text } = require('stream/consumers');

const app = express();
const port = /*process.env.PORT ||*/ 6001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// File paths
const savedPrescriptionPath = path.join(__dirname, 'src/data', 'saved_prescription.json');
const outputFilePath = path.join(__dirname, 'src', 'output.txt');

// Middleware
app.use(cors());
app.use(express.json());

// Function to read the contents of output.txt
function readOutputFile() {
  try {
    const data = fs.readFileSync(outputFilePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`Error reading ${outputFilePath}:`, err);
    return null;
  }
}
async function extractDrugType(text) {
  const prompt = `Extract the type of medicine from the following text:\n\n${text}\n\nDrug type:`;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      max_tokens: 100, // Adjust this as needed for your response
    });
    return response.choices[0].message.content.trim(); // Correct access to the content
  } catch (err) {
    console.error('Error extracting drug type:', err);
    return null;
  }
}


// OCR Endpoint
app.post('/api/ocr', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: [
          { 
            type: "text", 
            text: "Extract all text from this image exactly as it appears. Include all formatting, spacing, and special characters. Do not add any commentary or translations." 
          },
          { 
            type: "image_url", 
            image_url: { 
              url:`data:image/jpeg;base64,${image}`,
              detail: "high"
            } 
          }
        ]
      }],
      max_tokens: 4096
    });

    const text = response.choices[0].message.content
    drugType = await extractDrugType(text);
    res.json({text, drugType});
    const filePath = "./src/data/output";

    fs.writeFile(filePath, text , (err) => {
    if (err) {
        console.error("Error writing to file:", err);
    } else {
        console.log(`File has been created at: ${filePath}`);
    }
    })
    fs.writeFile(savedPrescriptionPath, drugType , (err) => {
      if (err) {
          console.error("Error writing to file:", err);
      } else {
          console.log(`File has been created at: ${savedPrescriptionPath}`);
      }
      })


  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ 
      error: 'OCR processing failed',
      message: error.message || 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});