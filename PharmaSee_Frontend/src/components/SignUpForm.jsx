"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    email: "",
    age: "",
    role: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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
    if (!formData.fullName || !formData.email || !formData.password || !formData.age || !formData.role) {
      setError("All fields are required")
      return
    }

    const age = Number.parseInt(formData.age, 10)
    if (isNaN(age) || age < 1 || age > 120) {
      setError("Please enter a valid age between 1 and 120")
      return
    }

    // AJAX Request
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, {
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
      console.log(formData)

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess(true)
      // Reset form after successful submission
      setFormData({
        fullName: "",
        password: "",
        email: "",
        age: "",
        role: "",
      })
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Card className="w-full max-w-md mx-auto bg-navy-50 border-navy-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-navy-900">Sign Up</CardTitle>
          <CardDescription className="text-navy-600">Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-navy-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="border-navy-300 focus:border-navy-500 focus:ring-navy-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-navy-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-navy-300 focus:border-navy-500 focus:ring-navy-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-navy-300 focus:border-navy-500 focus:ring-navy-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-navy-700">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="text"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
                className="border-navy-300 focus:border-navy-500 focus:ring-navy-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-navy-700">
                Role
              </Label>
              <Select onValueChange={handleRoleChange} value={formData.role}>
                <SelectTrigger id="role" className="border-navy-300 focus:border-navy-500 focus:ring-navy-500">
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
                <AlertDescription>Sign up successful! Welcome aboard!</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700 text-white">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-navy-600">
            Already have an account?{" "}
            <a href="/login" className="text-navy-700 hover:underline font-semibold">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
