"use client"

import type React from "react"

import { useState } from "react"
import { useDevices, type DeviceStatus } from "@/context/device-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface DeviceFormProps {
  deviceId?: string
  onComplete: () => void
}

export function DeviceForm({ deviceId, onComplete }: DeviceFormProps) {
  const { addDevice, updateDevice, getDeviceById, storageBoxes } = useDevices()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If deviceId is provided, we're editing an existing device
  const existingDevice = deviceId ? getDeviceById(deviceId) : undefined

  // Update the form state and fields
  const [formData, setFormData] = useState({
    name: existingDevice?.name || "",
    image: existingDevice?.image || "/placeholder.svg?height=200&width=200",
    category: existingDevice?.category || "",
    location: existingDevice?.location || "",
    status: existingDevice?.status || ("working" as DeviceStatus),
    notes: existingDevice?.notes || "",
    lastMaintenance: existingDevice?.lastMaintenance || "",
    storageBox: existingDevice?.storageBox || "",
    compartmentNumber: existingDevice?.compartmentNumber || 0,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(existingDevice?.image || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For a real app, you'd upload this to a storage service
      // For this demo, we'll create a data URL
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the data - only include storage box fields if a box is selected
      const deviceData = {
        ...formData,
        storageBox: formData.storageBox || undefined,
        compartmentNumber: formData.storageBox && formData.compartmentNumber ? formData.compartmentNumber : undefined,
      }

      if (deviceId) {
        // Update existing device
        await updateDevice(deviceId, deviceData)
        toast({
          title: "✅ Device Updated Successfully!",
          description: `${formData.name} has been updated successfully.`,
        })
      } else {
        // Add new device
        await addDevice(deviceData)
        toast({
          title: "🎉 Device Added Successfully!",
          description: `${formData.name} has been added to your collection.`,
        })
      }
      onComplete()
    } catch (error) {
      console.error("Error saving device:", error)
      toast({
        title: "❌ Error Saving Device",
        description: error instanceof Error ? error.message : "There was a problem saving the device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get the selected storage box to show available compartments
  const selectedBox = storageBoxes.find((box) => box.id === formData.storageBox)
  const maxCompartments = selectedBox?.compartments || 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Power Drill"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Power Tools"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Garage"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="needs-repair">Needs Repair</SelectItem>
                <SelectItem value="broken">Broken</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="storageBox">Storage Box</Label>
            <Select
              value={formData.storageBox || "none"}
              onValueChange={(value) => handleSelectChange("storageBox", value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select storage box (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {storageBoxes.map((box) => (
                  <SelectItem key={box.id} value={box.id}>
                    {box.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.storageBox && formData.storageBox !== "none" && (
            <div>
              <Label htmlFor="compartmentNumber">Compartment Number (1-{maxCompartments})</Label>
              <Input
                id="compartmentNumber"
                name="compartmentNumber"
                type="number"
                min={1}
                max={maxCompartments}
                value={formData.compartmentNumber || ""}
                onChange={handleNumberChange}
                placeholder="e.g., 3"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Device Image</Label>
            <div className="mt-1 flex flex-col items-center">
              <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-2 relative">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Device preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No image selected</div>
                )}
              </div>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Upload an image of the device</p>
            </div>
          </div>

          <div>
            <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
            <Input
              id="lastMaintenance"
              name="lastMaintenance"
              type="date"
              value={formData.lastMaintenance || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional information about the device..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onComplete} className="text-sm sm:text-base text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-sm sm:text-base"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {deviceId ? "Update Device" : "Add Device"}
        </Button>
      </div>
    </form>
  )
}
