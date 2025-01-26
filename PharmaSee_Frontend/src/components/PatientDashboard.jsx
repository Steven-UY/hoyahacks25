"use client"

import { useState } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scan, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function PatientDashboard() {
  // Initialize patient data directly without useEffect
  const [patient] = useState({
    _id: "PAT-123456",
    fullName: "John Doe",
    email: "johndoe@example.com",
    age: 30,
    // Simulating populated medications with string _id fields
    medication: [
      { _id: "MED-001", name: "Medication 1" },
      { _id: "MED-002", name: "Medication 2" },
      { _id: "MED-003", name: "Medication 3" },
    ],
  });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-6 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <User className="w-12 h-12" />
          </Avatar>
          <div className="text-center">
            <h2 className="font-semibold">{patient.fullName}</h2>
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
            <h1 className="text-3xl font-bold mb-2">Welcome {patient.fullName}!</h1>
          </div>

          {/* Medications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patient.medication.map((medication) => (
              <Link
                key={medication._id}
                href={`/Medications/${medication._id}`} // Dynamic route for each medication
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{medication.name}</h3>
                    {/* Future: Add more details if needed */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
