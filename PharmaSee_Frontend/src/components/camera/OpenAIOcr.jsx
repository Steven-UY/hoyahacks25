'use client'
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const OpenAIOcr = () => {
  const [img, setImg] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  // Capture image from webcam
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    await processWithOpenAI(imageSrc);
  };

  // Process image with OpenAI API
  const processWithOpenAI = async (imageData) => {
    setLoading(true);
    try {
      // Remove data URL prefix
      const base64Data = imageData.split(',')[1];
      
      const response = await fetch('http://localhost:3001/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data
        }),
      });

      if (!response.ok) throw new Error('OCR failed');
      
      const data = await response.json();
      setText(data.text);

    } catch (error) {
      console.error('Error:', error);
      setText('Error processing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Webcam OCR with OpenAI</h1>
      
      {/* Webcam Preview */}
      <div style={{ margin: '20px 0' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          style={{ width: '100%' }}
        />
      </div>

      {/* Capture Button */}
      <button 
        onClick={capture}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Processing...' : 'Capture & Read Text'}
      </button>

      {/* Results Display */}
      {text && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
          <h3>Extracted Text:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{text}</p>
        </div>
      )}
    </div>
  );
};

export default OpenAIOcr;