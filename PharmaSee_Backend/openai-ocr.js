require('dotenv').config()
const fs = require('fs')
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

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
              url: `data:image/jpeg;base64,${image}`,
              detail: "high"
            } 
          }
        ]
      }],
      max_tokens: 4096
    });

    text = response.choices[0].message.content
    res.json({text});
    const filePath = "./src/data/output";

    fs.writeFile(filePath, text , (err) => {
    if (err) {
        console.error("Error writing to file:", err);
    } else {
        console.log(`File has been created at: ${filePath}`);
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