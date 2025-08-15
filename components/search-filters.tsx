"use client"

import { useState, useEffect } from "react"
import { useDevices } from "@/context/device-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Search, Filter, X } from "lucide-react"

export function SearchFilters() {
  const { devices, storageBoxes } = useDevices()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [storageBox, setStorageBox] = useState(searchParams.get("storageBox") || "")
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filters
  const categories = Array.from(new Set(devices.map((d) => d.category)))
  const locations = Array.from(new Set(devices.map((d) => d.location)))
  const statuses = Array.from(new Set(devices.map((d) => d.status)))

  // Update URL with filters
  const updateFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category && category !== "all") params.set("category", category)
    if (location && location !== "all") params.set("location", location)
    if (status && status !== "all") params.set("status", status)
    if (storageBox && storageBox !== "all") params.set("storageBox", storageBox)

    router.push(`${pathname}?${params.toString()}`)
  }

  // Apply filters when they change
  useEffect(() => {
    updateFilters()
  }, [search, category, location, status, storageBox])

  const resetFilters = () => {
    setSearch("")
    setCategory("")
    setLocation("")
    setStatus("")
    setStorageBox("")
    setShowFilters(false)
  }

  const hasActiveFilters = category || location || status || storageBox

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`whitespace-nowrap ${hasActiveFilters ? "border-purple-500 text-purple-600" : ""}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-purple-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {[category, location, status, storageBox].filter(Boolean).length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters} size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat.replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={storageBox} onValueChange={setStorageBox}>
              <SelectTrigger>
                <SelectValue placeholder="Storage Box" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boxes</SelectItem>
                {storageBoxes.map((box) => (
                  <SelectItem key={box.id} value={box.id}>
                    {box.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
