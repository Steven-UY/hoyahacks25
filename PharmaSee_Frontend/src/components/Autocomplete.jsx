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
    count: "",
  })

  const handleInputChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 1) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/autocomplete?query=${value}`
      )
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
      count: index !== null ? selectedMedicines[index].count : "",
    })
    setEditingIndex(index)
    setSuggestions([]) // Close the suggestions list
  }

  const saveMedicine = () => {
    const { medicine, dosage, frequency, count } = medicineDetails

    if (dosage && frequency && count) {
      if (editingIndex !== null) {
        const updatedMedicines = [...selectedMedicines]
        updatedMedicines[editingIndex] = {
          medicine,
          dosage,
          frequency,
          count,
        }
        setSelectedMedicines(updatedMedicines)
      } else {
        setSelectedMedicines([
          ...selectedMedicines,
          { medicine, dosage, frequency, count },
        ])
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

  const sendJSON = async () => {
    if (selectedMedicines.length === 0) {
      alert("No medicines added to send.")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/save-prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMedicines),
      })
      const data = await response.json()
      alert(data.message)

      // Call the generate-explanations endpoint
      const explanationsResponse = await fetch(
        "http://localhost:5001/api/generate-explanations",
        {
          method: "GET",
        }
      )
      const explanationsData = await explanationsResponse.json()
      console.log("Generated explanations:", explanationsData)
      alert("Explanations generated successfully")
    } catch (error) {
      console.error("Error sending JSON:", error)
    }
  }

  return (
    <Card className="mb-6 bg-white border-teal-200 shadow-lg">
      {/* Matching the teal header style as seen in PatientDetails */}
      <CardHeader className="bg-teal-600 text-white rounded-t-lg px-4 py-3">
        <CardTitle className="text-white">Medicine Prescription</CardTitle>
      </CardHeader>

      <CardContent className="p-6 text-teal-800">
        {/* Input + Autocomplete Suggestions */}
        <div className="mb-4">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Start typing medicine name..."
            className="mb-2 border-teal-300 text-teal-800"
          />
          {suggestions.length > 0 && (
            <div className="autocomplete-items bg-white border border-teal-300 rounded-md shadow-md p-2 text-teal-800">
              {suggestions.map((medicine, index) => (
                <div
                  key={index}
                  className="autocomplete-item p-2 cursor-pointer hover:bg-teal-50"
                  onClick={() => showPopup(medicine)}
                >
                  {medicine}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popup Form */}
        {medicineDetails.medicine && (
          <div
            id="medicinePopup"
            className="mb-4 border border-teal-300 p-4 rounded-md bg-teal-50"
          >
            <h3 id="popupTitle" className="text-lg font-semibold mb-2">
              {editingIndex !== null ? "Edit Medicine Details" : "New Medicine Details"}
            </h3>
            <Input
              type="text"
              value={medicineDetails.medicine}
              onChange={(e) =>
                setMedicineDetails({
                  ...medicineDetails,
                  medicine: e.target.value,
                })
              }
              placeholder="Medicine Name"
              readOnly
              className="mb-2 border-teal-300 text-teal-800"
            />
            <Input
              type="text"
              value={medicineDetails.dosage}
              onChange={(e) =>
                setMedicineDetails({ ...medicineDetails, dosage: e.target.value })
              }
              placeholder="Dosage"
              className="mb-2 border-teal-300 text-teal-800"
            />
            <Input
              type="text"
              value={medicineDetails.frequency}
              onChange={(e) =>
                setMedicineDetails({
                  ...medicineDetails,
                  frequency: e.target.value,
                })
              }
              placeholder="Frequency"
              className="mb-2 border-teal-300 text-teal-800"
            />
            <Input
              type="text"
              value={medicineDetails.count}
              onChange={(e) =>
                setMedicineDetails({
                  ...medicineDetails,
                  count: e.target.value,
                })
              }
              placeholder="Count"
              className="mb-2 border-teal-300 text-teal-800"
            />
            <div className="flex space-x-2">
              <Button onClick={saveMedicine} className="bg-teal-600 hover:bg-teal-700 text-white">
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setMedicineDetails({
                    medicine: "",
                    dosage: "",
                    frequency: "",
                    count: "",
                  })
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Selected Medicines List */}
        <div id="selected-medicines-list" className="mb-4">
          {selectedMedicines.map((med, index) => (
            <div
              key={index}
              className="p-2 border-b border-teal-100 flex justify-between items-center text-teal-900"
            >
              <div>
                <strong>#{med.medicine}</strong> - {med.dosage}, {med.frequency}, Count:{" "}
                {med.count}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="border-teal-300 text-teal-800 hover:bg-teal-50"
                  onClick={() => showPopup(med.medicine, index)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => removeMedicine(index)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={sendJSON} className="bg-teal-600 hover:bg-teal-700 text-white">
          Send To Patient
        </Button>
      </CardContent>
    </Card>
  )
}
