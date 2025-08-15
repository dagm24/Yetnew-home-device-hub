"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { StorageBoxManager } from "@/components/storage-box-manager"

export default function StoragePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />

        <main className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Storage Management</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Organize your devices with storage boxes and compartments</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <StorageBoxManager onClose={() => {}} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
