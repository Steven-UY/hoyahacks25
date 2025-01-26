"use client"
import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, LogOut, User } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const [physician, setPhysician] = useState(null)
  const [patients, setPatients] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const mockPhysician = {
      name: "Dr. Sarah Smith",
      id: "DOC-654321",
    }

    const mockPatients = [
      { id: "PAT-001", fullName: "John Doe", age: 45, nextAppointment: "2023-07-15" },
      { id: "PAT-002", fullName: "Jane Smith", age: 32, nextAppointment: "2023-07-16" },
      { id: "PAT-003", fullName: "Michael Brown", age: 60, nextAppointment: "2023-07-17" },
    ]

    const fetchData = async () => {
      try {
        setPhysician(mockPhysician)
        setPatients(mockPatients)
      } catch (err) {
        setError("Failed to load data.")
        console.error(err)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  if (!physician) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-teal-600 p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 bg-white">
            <User className="w-12 h-12 text-teal-600" />
          </Avatar>
          <div className="text-center">
            <h2 className="font-semibold text-white text-lg">{physician.name}</h2>
            <p className="text-sm text-teal-100">Physician ID: {physician.id}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <Button className="w-full bg-teal-700 text-white hover:bg-teal-800 justify-start">
            <Scan className="mr-2 h-4 w-4" />
            Scan
          </Button>
          <Button className="w-full bg-red-500 text-white hover:bg-red-600 justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-2 text-teal-800">Welcome, {physician.name}!</h1>
            <p className="text-teal-600">Manage your patients below.</p>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-teal-800">Your Patients</h2>

          {/* Patients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/Patients/${patient.id}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white border-teal-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-teal-700 text-lg">{patient.fullName}</h3>
                    <div className="space-y-1 text-sm text-teal-600">
                      <p>Age: {patient.age}</p>
                      <p>Next Appointment: {patient.nextAppointment}</p>
                    </div>
                    <Button className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600">View Details</Button>
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

