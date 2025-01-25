"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, LogOut, User } from "lucide-react"
import Link from "next/link" // Import the Link component

export default function PatientDashboard() {
  const mockPatient = {
    name: "John Doe",
    id: "PAT-123456",
  }

  const mockMedications = [
    { name: "Medication 1", dosage: "20mg", frequency: "Daily" },
    { name: "Medication 2", dosage: "10mg", frequency: "Twice daily" },
    { name: "Medication 3", dosage: "5mg", frequency: "As needed" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <User className="w-12 h-12" />
          </Avatar>
          <div className="text-center">
            <h2 className="font-semibold">{mockPatient.name}</h2>
            <p className="text-sm text-muted-foreground">Patient</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <Button className="w-full" variant="outline">
            <Scan className="mr-2 h-4 w-4" />
            Scan
          </Button>
          <Button className="w-full" variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome {mockPatient.name}!</h1>
          </div>

          {/* Medications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMedications.map((medication, index) => (
              <Link
                key={index}
                href={`/Medications/${index}`} // Dynamic route for each medication
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{medication.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Dosage: {medication.dosage}</p>
                      <p>Frequency: {medication.frequency}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
