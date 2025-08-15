"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { DeviceGrid } from "@/components/device-grid"
import { SearchFilters } from "@/components/search-filters"
import { AddDeviceButton } from "@/components/add-device-button"
import { ChatbotButton } from "@/components/chatbot-button"

export default function DevicesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900/20">
        <Navigation />

        <main className="container mx-auto px-4 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Devices</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Manage all your household devices and tools
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none">
                <AddDeviceButton />
              </div>
              <div className="hidden sm:block">
                <ChatbotButton />
              </div>
            </div>
          </div>

          <SearchFilters />
          <DeviceGrid />
        </main>

        {/* Floating AI Assistant Button - Mobile */}
        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
          <ChatbotButton />
        </div>
      </div>
    </ProtectedRoute>
  )
}
