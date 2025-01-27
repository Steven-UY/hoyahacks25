"use client"

import { useState, useRef } from "react"
import Webcam from "react-webcam"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Camera, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link" // import Link from next/link

export default function MultiMedicineCheck() {
  const [img, setImg] = useState(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [isMatch, setIsMatch] = useState(null)
  const webcamRef = useRef(null)

  // 1) Hardcode valid medicines
  const validMedicines = ["acetaminophen", "ibuprofen"] // Lowercase for easy comparison

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImg(imageSrc)
    await processOcr(imageSrc)
  }

  const processOcr = async (imageData) => {
    setLoading(true)
    setIsMatch(null)

    try {
      const base64Data = imageData.split(",")[1]
      const response = await fetch("http://localhost:6001/api/ocr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Data }),
      })

      if (!response.ok) throw new Error("OCR failed")

      const data = await response.json()
      setText(data.text)

      // 2) Convert recognized text to lowercase, check if it contains any valid medicine
      const recognizedLower = data.text.toLowerCase()
      const foundMatch = validMedicines.some((medicine) =>
        recognizedLower.includes(medicine)
      )

      setIsMatch(foundMatch)
    } catch (error) {
      console.error("Error:", error)
      setText("Error processing image")
    } finally {
      setLoading(false)
    }
  }

  const PopupCard = ({ isCorrect }) => (
    <Card
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 ${
        isCorrect ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
      } border-2 shadow-lg z-10`}
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

        {/* Footer with two buttons: Back (using Link) & Capture */}
        <CardFooter className="bg-teal-50 rounded-b-lg flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Link href="/PatientDashboard" passHref>
            {/* We wrap the Button with a Link so it navigates on click */}
            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              Back
            </Button>
          </Link>

          <Button
            onClick={capture}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Capture &amp; Read Text
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
