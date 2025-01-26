"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [formData, setFormData] = useState({ fullName: "", password: "", role: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleRoleChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      role: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Basic validation
    if (!formData.fullName || !formData.password) {
      setError("All fields are required")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      const data = await response.json()
      console.log(data)
      if (data.authorized === false) {
        router.push("/LoginForm")
      } else if (data.authenticated === true && data.role === "patient") {
        router.push("/PatientDashboard")
      } else if (data.authenticated === true && data.role === "doctor") {
        router.push("/DoctorDashboard")
      }

      console.log(formData)

      // Simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess(true)
      // Reset form after successful login
      setFormData({
        fullName: "",
        password: "",
        role: "",
      })
    } catch (err) {
      setError("Invalid credentials or role. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white border-teal-200 shadow-lg">
        <CardHeader className="bg-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-teal-100">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-teal-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-teal-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-teal-700">
                Role
              </Label>
              <Select onValueChange={handleRoleChange} value={formData.role}>
                <SelectTrigger id="role" className="border-teal-300 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-100 text-green-800 border-green-300">
                <AlertDescription>Login successful! Welcome back, {formData.role}!</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center bg-teal-50 rounded-b-lg">
          <p className="text-sm text-teal-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline font-semibold">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

