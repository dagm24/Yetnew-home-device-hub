"use client"

import { useAuth } from "@/context/auth-context"
import { useDevices } from "@/context/device-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChatbotButton } from "@/components/chatbot-button"
import Link from "next/link"
import { Home, Wrench, Package, Plus, Users } from "lucide-react"

export default function DashboardPage() {
  const { profile, household } = useAuth()
  const { devices, storageBoxes, loading } = useDevices()

  const workingDevices = devices.filter((d) => d.status === "working").length
  const needsRepairDevices = devices.filter((d) => d.status === "needs-repair").length
  const brokenDevices = devices.filter((d) => d.status === "broken").length

  const recentDevices = devices.slice(0, 5)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900/20">
        <Navigation />

        {/* Demo Mode Banner */}
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 sm:py-3 mt-16">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16 10,8" />
                </svg>
                <span className="font-semibold text-sm sm:text-base">Demo Mode Active</span>
              </div>
              <p className="text-xs sm:text-sm opacity-90 mt-1">
                You're exploring the demo version. Data is stored locally and will reset when you refresh.
                <Link href="/family" className="underline ml-1 hidden sm:inline">
                  Set up Supabase for real-time family sharing →
                </Link>
              </p>
            </div>
          </div>
        )}

        <main className="container mx-auto px-4 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {profile?.full_name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {household ? `Managing devices for ${household.name}` : "Set up your household to get started"}
            </p>
          </div>

          {!household ? (
            <Card className="mb-6 sm:mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-full">
                    <Home className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 text-lg">
                      Set up your household
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                      Create or join a household to start managing devices with your family.
                    </p>
                  </div>
                  <Link href="/family">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 w-full sm:w-auto">Get Started</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Total Devices</CardTitle>
                    <Wrench className="w-4 h-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">{devices.length}</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Working</CardTitle>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{workingDevices}</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Needs Repair</CardTitle>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">{needsRepairDevices}</div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Storage Boxes</CardTitle>
                    <Package className="w-4 h-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">{storageBoxes.length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Devices and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Recent Devices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentDevices.length > 0 ? (
                      <div className="space-y-4">
                        {recentDevices.map((device) => (
                          <div key={device.id} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm sm:text-base truncate">{device.name}</p>
                              <p className="text-xs sm:text-sm text-gray-500 truncate">{device.category}</p>
                            </div>
                            <Badge
                              className={`ml-2 text-xs ${
                                device.status === "working"
                                  ? "bg-green-100 text-green-800"
                                  : device.status === "needs-repair"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {device.status.replace("-", " ")}
                            </Badge>
                          </div>
                        ))}
                        <Link href="/devices">
                          <Button variant="outline" className="w-full bg-transparent">
                            View All Devices
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4 text-sm sm:text-base">No devices yet</p>
                        <Link href="/devices">
                          <Button>Add Your First Device</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Link href="/devices">
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Device
                        </Button>
                      </Link>
                      <Link href="/storage">
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Package className="w-4 h-4 mr-2" />
                          Manage Storage
                        </Button>
                      </Link>
                      <Link href="/family">
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Users className="w-4 h-4 mr-2" />
                          Invite Family Members
                        </Button>
                      </Link>
                      <div className="pt-2">
                        <ChatbotButton />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>

        {/* Floating AI Assistant Button - Mobile */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <ChatbotButton />
        </div>
      </div>
    </ProtectedRoute>
  )
}
