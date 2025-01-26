"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { User } from "lucide-react"

// Mock data for medications with string IDs
const mockMedications = [
  {
    _id: "MED-001",
    name: "Medication 1",
    dosage: "20mg",
    frequency: "Daily",
    description: "Used to treat high blood pressure.",
  },
  {
    _id: "MED-002",
    name: "Medication 2",
    dosage: "10mg",
    frequency: "Twice daily",
    description: "An antibiotic for bacterial infections.",
  },
  {
    _id: "MED-003",
    name: "Medication 3",
    dosage: "5mg",
    frequency: "As needed",
    description: "Pain reliever for mild to moderate pain.",
  },
]

export default function MedicationDetails() {
  const router = useRouter()
  const params = useParams()
  const medicationId = params.id // Keep as string

  const medication = mockMedications.find((med) => med._id === medicationId)

  if (!medication) {
    return <div className="p-8 text-red-500">Medication not found</div>
  }
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card>
          <CardHeader className="flex items-center gap-4">
            <CardTitle>{medication.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Dosage</h3>
                <p>{medication.dosage}</p>
              </div>
              <div>
                <h3 className="font-semibold">Frequency</h3>
                <p>{medication.frequency}</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{medication.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
