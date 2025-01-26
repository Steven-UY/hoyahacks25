"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Autocomplete from "@/components/Autocomplete"

// Mock data for patients and their medications
const mockPatients = [
  {
    id: "PAT-001",
    fullName: "John Doe",
    age: 45,
    condition: "Hypertension",
    medications: [
      { name: "Ibuprofen", dosage: "10mg", frequency: "Once daily" },
      { name: "Acetaminophen", dosage: "5mg", frequency: "Once daily" },
    ],
  },
  {
    id: "PAT-002",
    fullName: "Jane Smith",
    age: 32,
    condition: "Diabetes",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Insulin", dosage: "10 units", frequency: "Before meals" },
    ],
  },
  {
    id: "PAT-003",
    fullName: "Michael Brown",
    age: 60,
    condition: "Heart Disease",
    medications: [
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily" },
    ],
  },
  // Add more patients as needed
]

export default function PatientDetails() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id // Keep as string

  // State to manage prescription form
  const [prescription, setPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    instructions: "",
  })

  // Find the patient based on the ID from the URL
  const patient = mockPatients.find((p) => p.id === patientId)

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-teal-700 hover:text-teal-800 hover:bg-teal-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Card className="bg-white border-teal-200 shadow-lg">
            <CardContent className="p-6">
              <p className="text-teal-800">Patient not found. Please check the URL and try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target
    setPrescription((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitPrescription = (e) => {
    e.preventDefault()
    // Here you would typically send the prescription data to your backend API
    console.log("Prescription submitted:", prescription)
    // Reset the form
    setPrescription({ medication: "", dosage: "", frequency: "", instructions: "" })
    // Show a success message (in a real app, you'd want to use a proper notification system)
    alert("Prescription submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-teal-700 hover:text-teal-800 hover:bg-teal-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card className="mb-6 bg-white border-teal-200 shadow-lg">
          <CardHeader className="bg-teal-600 text-white rounded-t-lg">
            <CardTitle>{patient.fullName}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2 text-teal-800">
              <p>Age: {patient.age}</p>
              <p>Condition: {patient.condition}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6 bg-white border-teal-200 shadow-lg">
          <CardHeader className="bg-teal-600 text-white rounded-t-lg">
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="list-disc pl-5 space-y-2 text-teal-800">
              {patient.medications.map((med, index) => (
                <li key={index}>
                  {med.name} - {med.dosage}, {med.frequency}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="mb-8">
          <Autocomplete />
        </div>
      </div>
    </div>
  )
}

