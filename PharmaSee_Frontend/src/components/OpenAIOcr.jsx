"use client"

import { useState, useRef } from "react"
import Webcam from "react-webcam"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Camera } from "lucide-react"

const OpenAIOcr = () => {
  const [img, setImg] = useState(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef(null)

  // Capture image from webcam
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImg(imageSrc)
    await processWithOpenAI(imageSrc)
  }

  // Process image with OpenAI API
  const processWithOpenAI = async (imageData) => {
    setLoading(true)
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
    } catch (error) {
      console.error("Error:", error)
      setText("Error processing image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Webcam OCR with OpenAI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        {text && (
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="font-semibold mb-2">Extracted Text:</h3>
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={capture} disabled={loading} className="w-full">
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
  )
}

export default OpenAIOcr

