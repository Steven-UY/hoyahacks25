"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Autocomplete() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [selectedMedicines, setSelectedMedicines] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [medicineDetails, setMedicineDetails] = useState({
    medicine: "",
    dosage: "",
    frequency: "",
    count: ""
  })

  const handleInputChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 1) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/autocomplete?query=${value}`)
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error("Error fetching autocomplete:", error)
    }
  }

  const showPopup = (medicine, index = null) => {
    setMedicineDetails({
      medicine,
      dosage: index !== null ? selectedMedicines[index].dosage : "",
      frequency: index !== null ? selectedMedicines[index].frequency : "",
      count: index !== null ? selectedMedicines[index].count : ""
    })
    setEditingIndex(index)
    setSuggestions([]) // Close the suggestions list
  }

  const saveMedicine = () => {
    const { medicine, dosage, frequency, count } = medicineDetails

    if (dosage && frequency && count) {
      if (editingIndex !== null) {
        const updatedMedicines = [...selectedMedicines]
        updatedMedicines[editingIndex] = { medicine, dosage, frequency, count }
        setSelectedMedicines(updatedMedicines)
      } else {
        setSelectedMedicines([...selectedMedicines, { medicine, dosage, frequency, count }])
      }
      setMedicineDetails({ medicine: "", dosage: "", frequency: "", count: "" })
      setEditingIndex(null)
    } else {
      alert("Please fill in all fields.")
    }
  }

  const removeMedicine = (index) => {
    const updatedMedicines = selectedMedicines.filter((_, i) => i !== index)
    setSelectedMedicines(updatedMedicines)
  }

  // const downloadJSON = () => {
  //   if (selectedMedicines.length === 0) {
  //     alert("No medicines added to download.")
  //     return
  //   }

  //   const dataStr = JSON.stringify(selectedMedicines, null, 2)
  //   const blob = new Blob([dataStr], { type: "application/json" })
  //   const url = URL.createObjectURL(blob)

  //   const a = document.createElement("a")
  //   a.href = url
  //   a.download = "medicines.json"
  //   document.body.appendChild(a)
  //   a.click()
  //   document.body.removeChild(a)
  // }

  const sendJSON = async () => {
    if (selectedMedicines.length === 0) {
      alert("No medicines added to send.")
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/save-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedMedicines)
      })
      const data = await response.json()
      alert(data.message)

       // Call the generate-explanations endpoint
    const explanationsResponse = await fetch('http://localhost:5001/api/generate-explanations', {
      method: 'GET'
    })
    const explanationsData = await explanationsResponse.json()
    console.log("Generated explanations:", explanationsData)
    alert("Explanations generated successfully")


    } catch (error) {
      console.error("Error sending JSON:", error)
    }
  }

  return (
    <Card className="w-full p-4 shadow-md">
      <CardHeader>
        <CardTitle>Medicine Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="autocomplete-container mb-4">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Start typing medicine name..."
            className="autocomplete-input mb-2"
          />
          {suggestions.length > 0 && (
            <div className="autocomplete-items bg-white border border-gray-300 rounded-md shadow-md p-2">
              {suggestions.map((medicine, index) => (
                <div key={index} className="autocomplete-item p-2 cursor-pointer hover:bg-gray-100" onClick={() => showPopup(medicine)}>
                  {medicine}
                </div>
              ))}
            </div>
          )}
        </div>
        <div id="medicinePopup" style={{ display: medicineDetails.medicine ? "block" : "none" }} className="mb-4">
          <h3 id="popupTitle" className="text-lg font-semibold mb-2">{editingIndex !== null ? "Edit Medicine Details" : "Details"}</h3>
          <Input
            type="text"
            value={medicineDetails.medicine}
            onChange={(e) => setMedicineDetails({ ...medicineDetails, medicine: e.target.value })}
            placeholder="Medicine Name"
            readOnly
            className="mb-2"
          />
          <Input
            type="text"
            value={medicineDetails.dosage}
            onChange={(e) => setMedicineDetails({ ...medicineDetails, dosage: e.target.value })}
            placeholder="Dosage"
            className="mb-2"
          />
          <Input
            type="text"
            value={medicineDetails.frequency}
            onChange={(e) => setMedicineDetails({ ...medicineDetails, frequency: e.target.value })}
            placeholder="Frequency"
            className="mb-2"
          />
          <Input
            type="text"
            value={medicineDetails.count}
            onChange={(e) => setMedicineDetails({ ...medicineDetails, count: e.target.value })}
            placeholder="Count"
            className="mb-2"
          />
          <div className="flex space-x-2">
            <Button onClick={saveMedicine} className="mr-2">Save</Button>
            <Button onClick={() => setMedicineDetails({ medicine: "", dosage: "", frequency: "", count: "" })}>Cancel</Button>
          </div>
        </div>
        <div id="selected-medicines-list" className="mb-4">
          {selectedMedicines.map((med, index) => (
            <div key={index} className="pill-details p-2 border-b border-gray-200 flex justify-between items-center">
              <div>
                <b>#{med.medicine}</b> - {med.dosage}, {med.frequency}, Count: {med.count}
              </div>
              <div className="pill-actions flex space-x-2">
                <Button className="edit-btn mr-2" onClick={() => showPopup(med.medicine, index)}>Edit</Button>
                <Button className="delete-btn" onClick={() => removeMedicine(index)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={sendJSON}>Send To Patient</Button>
      </CardContent>
    </Card>
  )
}