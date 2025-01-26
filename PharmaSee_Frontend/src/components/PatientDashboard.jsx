"use client"

import { useState, useEffect } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scan, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/patientDashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);
  
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!patient) return <div className="p-8">No patient data found</div>;

  return (
    <div className="min-h-screen flex">
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

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome {patient.fullName}!</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patient.medication.map((medication) => (
              <Link
                key={medication.id}
                href={`/dashboard/medication/${medication.id}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{medication.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Dosage: {medication.dose}</p>
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
  );
}
