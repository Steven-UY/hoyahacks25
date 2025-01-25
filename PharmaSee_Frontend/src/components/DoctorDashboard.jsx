"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, LogOut, User } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const mockPhysician = {
    name: "Dr. Sarah Smith",
    id: "DOC-654321",
  }

  const mockPatients = [
    { id: 1, name: "John Doe", age: 45, condition: "Hypertension" },
    { id: 2, name: "Jane Smith", age: 32, condition: "Diabetes" },
    { id: 3, name: "Michael Brown", age: 60, condition: "Heart Disease" },
    // Add more patients as needed
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
            <h2 className="font-semibold">{mockPhysician.name}</h2>
            <p className="text-sm text-muted-foreground">Physician ID: {mockPhysician.id}</p>
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
            <h1 className="text-3xl font-bold mb-2">Welcome {mockPhysician.name}!</h1>
            <p className="text-muted-foreground">Manage your patients below.</p>
          </div>

          {/* Patients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/Patients/${patient.id}`} // Dynamic route for each patient
                className="block transition-transform hover:scale-105"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{patient.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Age: {patient.age}</p>
                      <p>Condition: {patient.condition}</p>
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
