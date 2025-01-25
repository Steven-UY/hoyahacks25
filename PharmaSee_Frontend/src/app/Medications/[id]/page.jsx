"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

// Mock data for medications
const mockMedications = [
  {
    id: 0,
    name: "Medication 1",
    dosage: "20mg",
    frequency: "Daily",
    description: "Used to treat high blood pressure.",
  },
  {
    id: 1,
    name: "Medication 2",
    dosage: "10mg",
    frequency: "Twice daily",
    description: "An antibiotic for bacterial infections.",
  },
  {
    id: 2,
    name: "Medication 3",
    dosage: "5mg",
    frequency: "As needed",
    description: "Pain reliever for mild to moderate pain.",
  },
]

export default function MedicationDetails() {
  const router = useRouter()
  const params = useParams()
  const medicationId = Number(params.id)

  const medication = mockMedications.find((med) => med.id === medicationId)

  if (!medication) {
    return <div>Medication not found</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card>
          <CardHeader>
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

