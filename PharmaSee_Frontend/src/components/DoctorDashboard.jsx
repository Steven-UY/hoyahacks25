"use client"

import { useEffect, useState } from 'react';
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, LogOut, User } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  // State to hold physician data
  const [physician, setPhysician] = useState(null)
  // State to hold patients data
  const [patients, setPatients] = useState([])
  // State to handle errors
  const [error, setError] = useState(null)

  // useEffect to fetch physician and patients data
  useEffect(() => {
    // TODO: Replace mockPhysician with actual API call to fetch physician data
    const mockPhysician = {
      name: "Dr. Sarah Smith",
      id: "DOC-654321",
    }

    // TODO: Replace mockPatients with actual API call to fetch patients data
    const mockPatients = [
      { id: "PAT-001", fullName: "John Doe", age: 45 },
      { id: "PAT-002", fullName: "Jane Smith", age: 32 },
      { id: "PAT-003", fullName: "Michael Brown", age: 60 },
      // Add more patients as needed
    ]

    // Simulate data fetching
    const fetchData = async () => {
      try {
        // TODO: Implement actual fetch requests here
        // Example:
        // const physicianResponse = await fetch('/api/physician/DOC-654321')
        // if (!physicianResponse.ok) throw new Error('Failed to fetch physician data')
        // const physicianData = await physicianResponse.json()
        // setPhysician(physicianData)

        // const patientsResponse = await fetch('/api/physician/DOC-654321/patients')
        // if (!patientsResponse.ok) throw new Error('Failed to fetch patients data')
        // const patientsData = await patientsResponse.json()
        // setPatients(patientsData)

        // For now, use mock data
        setPhysician(mockPhysician)
        setPatients(mockPatients)
      } catch (err) {
        setError("Failed to load data.")
        console.error(err)
      }
    }

    fetchData()
  }, [])

  // Handle error state
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  // Handle loading state
  if (!physician) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <User className="w-12 h-12" />
          </Avatar>
          <div className="text-center">
            <h2 className="font-semibold">{physician.name}</h2>
            <p className="text-sm text-muted-foreground">Physician ID: {physician.id}</p>
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
            <h1 className="text-3xl font-bold mb-2">Welcome {physician.name}!</h1>
            <p className="text-muted-foreground">Manage your patients below.</p>
          </div>

          {/* Patients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/Patients/${patient.id}`} // Dynamic route for each patient
                className="block transition-transform hover:scale-105"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{patient.fullName}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Age: {patient.age}</p>
                      {/* Medication information can be added here in the future */}
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
