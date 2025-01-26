"use client"

import { useState, useRef } from "react"
import Webcam from "react-webcam"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Camera, CheckCircle, XCircle } from "lucide-react"

const OpenAIOcr = () => {
  const [img, setImg] = useState(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [isMatch, setIsMatch] = useState(null)
  const webcamRef = useRef(null)

  // Expected text (replace this with your actual expected text)
  const expectedText = "Aspirin 500mg"

  // Capture image from webcam
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImg(imageSrc)
    await processWithOpenAI(imageSrc)
  }

  // Process image with OpenAI API
  const processWithOpenAI = async (imageData) => {
    setLoading(true)
    setIsMatch(null)
    try {
      // Remove data URL prefix
      const base64Data = imageData.split(",")[1]

      const response = await fetch("http://localhost:3001/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Data,
        }),
      })

      if (!response.ok) throw new Error("OCR failed")

      const data = await response.json()
      setText(data.text)

      // Check if the scanned text matches the expected text
      setIsMatch(data.text.toLowerCase().includes(expectedText.toLowerCase()))
    } catch (error) {
      console.error("Error:", error)
      setText("Error processing image")
    } finally {
      setLoading(false)
    }
  }

  const PopupCard = ({ isCorrect }) => (
    <Card
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 ${isCorrect ? "bg-green-100" : "bg-red-100"} border-2 ${isCorrect ? "border-green-500" : "border-red-500"} shadow-lg z-10`}
    >
      <CardContent className="p-4 text-center">
        {isCorrect ? (
          <>
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p className="text-green-700 font-semibold">Correct Medicine!</p>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
            <p className="text-red-700 font-semibold">Wrong Medicine!</p>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12">
      <Card className="w-full max-w-2xl mx-auto bg-white border-teal-200 shadow-lg">
        <CardHeader className="bg-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Scan Your Medicine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6 relative">
          <div className="relative aspect-video rounded-md overflow-hidden border-2 border-teal-300">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover"
            />
          </div>
          {text && (
            <div className="p-4 bg-teal-50 rounded-md border border-teal-200">
              <h3 className="font-semibold mb-2 text-teal-800">Extracted Text:</h3>
              <p className="whitespace-pre-wrap text-teal-700">{text}</p>
            </div>
          )}
          {isMatch !== null && <PopupCard isCorrect={isMatch} />}
        </CardContent>
        <CardFooter className="bg-teal-50 rounded-b-lg">
          <Button
            onClick={capture}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Capture & Read Text
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OpenAIOcr

