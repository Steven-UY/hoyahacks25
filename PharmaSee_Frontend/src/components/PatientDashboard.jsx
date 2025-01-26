"use client"
import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, LogOut, User } from "lucide-react"
import Link from "next/link"

export default function PatientDashboard() {
  const [physician, setPhysician] = useState(null)
  const [patients, setPatients] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const mockPhysician = {
      name: "John Doe",
      id: "PAT-157682",
    }

    const mockPatients = [
      { id: "PAT-001", fullName: "Paxil", age: '20mg', nextAppointment: "2" ,count:"1",desc: "Paxil is like a tiny helper that makes you feel less sad or worried by balancing the happy chemicals in your brain."},
      { id: "PAT-002", fullName: "Ascorbic acid", age: '32mg', nextAppointment: "3",count:"1",desc:"Ascorbic acid, also known as Vitamin C, helps your body heal wounds and make your teeth, skin, and bones strong. It also helps protect your body from getting sick."},
      { id: "PAT-003", fullName: "Vitamin C", age: '45mg', nextAppointment: "1",count:"1" ,desc:"Vitamin C is just like the fuel for your body that helps you grow properly and fight off germs. "},
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
            <p className="text-sm text-teal-100">Patient ID: {physician.id}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <Link href="/Camera">
            <Button className="w-full bg-teal-700 text-white hover:bg-teal-800 justify-start">
              <Scan className="mr-2 h-4 w-4" />
              Scan
            </Button>
          </Link>
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
            <p className="text-teal-600"></p>
          </div>

          <h2 className="text-2xl font-semibold mb-4 text-teal-800">Your Medicine</h2>

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
                      <p>Dosage: {patient.age}</p>
                      <p>Frequency: {patient.nextAppointment}</p>
                      <p>Count: {patient.count}</p>
                      <p>{patient.desc}</p>
                    </div>
                    {/* <Button className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600">View Details</Button> */}
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

