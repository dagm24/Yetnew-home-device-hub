"use client";

import { useState } from "react";
import { useDevices, type Device } from "@/context/device-context";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DeviceDetail } from "@/components/device-detail";
import { DeviceUsageActions } from "@/components/device-usage-actions";
import { DeviceUsageHistory } from "@/components/device-usage-history";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2, Package, MapPin, Tag, Eye, User, Clock } from "lucide-react";
import Image from "next/image";

export function DeviceGrid() {
  const { devices, filterDevices, getStorageBoxById, loading, isMounted } =
    useDevices();
  const { user } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Don't render anything until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Get filters from URL
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const status = searchParams.get("status") || "";
  const storageBox = searchParams.get("storageBox") || "";

  // Apply filters
  const filteredDevices = filterDevices({
    search,
    category,
    location,
    status: status as any,
    storageBox,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "needs-repair":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "broken":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-500">Loading your devices...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => {
            // Get storage box info if available
            const deviceBox = device.storageBox
              ? getStorageBoxById(device.storageBox)
              : null;

            return (
              <Card
                key={device.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700 group"
              >
                <div className="relative h-40 sm:h-48 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={device.image || "/placeholder.svg"}
                    alt={device.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {deviceBox && device.compartmentNumber && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                      #{device.compartmentNumber}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className={getStatusColor(device.status)}>
                      {device.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3 sm:p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-base sm:text-lg truncate mb-1">
                      {device.name}
                    </h3>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <Tag className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{device.category}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{device.location}</span>
                      </div>

                      {deviceBox && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">
                          <Package className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{deviceBox.name}</span>
                        </div>
                      )}

                      {/* Current usage status */}
                      {device.current_user_id && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {device.current_user_id === user?.id
                              ? "You"
                              : "In use"}
                          </span>
                        </div>
                      )}

                      {device.current_location &&
                        device.current_location !== "home" && (
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              At {device.current_location}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col gap-3">
                  {/* View Details - full width */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDevice(device)}
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>

                  {/* Actions row: stack on small screens, side-by-side on sm+ */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="flex-1 min-w-0">
                      <DeviceUsageActions
                        deviceId={device.id}
                        deviceName={device.name}
                        currentLocation={device.current_location}
                        currentUserId={device.current_user_id}
                        isCurrentUser={device.current_user_id === user?.id}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <DeviceUsageHistory
                        deviceId={device.id}
                        deviceName={device.name}
                      />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 sm:p-12 text-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-6 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search-x text-purple-600 dark:text-purple-400"
              >
                <path d="m13.5 8.5-5 5" />
                <path d="m8.5 8.5 5 5" />
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No devices found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
              Try adjusting your search or filters, or add your first device to
              get started
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedDevice}
        onOpenChange={(open) => !open && setSelectedDevice(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
            <DialogDescription>
              View and edit details for the selected device.
            </DialogDescription>
          </DialogHeader>
          {selectedDevice && (
            <DeviceDetail
              device={selectedDevice}
              onClose={() => setSelectedDevice(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
