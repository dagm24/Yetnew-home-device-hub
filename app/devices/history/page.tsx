"use client";

import { useDevices } from "@/context/device-context";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import {
  History,
  Package,
  Home,
  Building2,
  ArrowLeftRight,
  User,
  MapPin,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ACTION_ICONS = {
  taken: Package,
  returned: Home,
  moved: ArrowLeftRight,
};

const ACTION_COLORS = {
  taken: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  returned: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  moved:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const LOCATION_ICONS = {
  home: Home,
  office: Building2,
  garage: Package,
  workshop: Package,
  kitchen: Home,
  bedroom: Home,
  "living-room": Home,
  basement: Package,
  other: MapPin,
};

export default function DeviceHistoryPage() {
  const { deviceUsageLogs, devices } = useDevices();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterDevice, setFilterDevice] = useState<string>("all");

  const filteredLogs = useMemo(() => {
    return deviceUsageLogs.filter((log) => {
      const device = devices.find((d) => d.id === log.device_id);
      const deviceName = device?.name || "Unknown Device";

      // Search filter
      if (
        searchTerm &&
        !deviceName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Action filter
      if (
        filterAction &&
        filterAction !== "all" &&
        log.action !== filterAction
      ) {
        return false;
      }

      // Location filter
      if (
        filterLocation &&
        filterLocation !== "all" &&
        log.location !== filterLocation
      ) {
        return false;
      }

      // Device filter
      if (
        filterDevice &&
        filterDevice !== "all" &&
        log.device_id !== filterDevice
      ) {
        return false;
      }

      return true;
    });
  }, [
    deviceUsageLogs,
    devices,
    searchTerm,
    filterAction,
    filterLocation,
    filterDevice,
  ]);

  const getLocationIcon = (location: string) => {
    const Icon =
      LOCATION_ICONS[location as keyof typeof LOCATION_ICONS] || MapPin;
    return <Icon className="w-4 h-4" />;
  };

  const getActionIcon = (action: string) => {
    const Icon = ACTION_ICONS[action as keyof typeof ACTION_ICONS] || Package;
    return <Icon className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    return (
      ACTION_COLORS[action as keyof typeof ACTION_COLORS] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const getDeviceName = (deviceId: string) => {
    return devices.find((d) => d.id === deviceId)?.name || "Unknown Device";
  };

  const getCurrentUserInfo = (userId: string) => {
    return userId === user?.id ? "You" : "Another user";
  };

  const uniqueLocations = Array.from(
    new Set(deviceUsageLogs.map((log) => log.location))
  ).sort();
  const uniqueDevices = devices.map((device) => ({
    id: device.id,
    name: device.name,
  }));

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Device Usage History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track all device movements and usage across your household
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Search Devices
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search device names..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Action</label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="All actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    <SelectItem value="taken">Taken</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="moved">Moved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <Select
                  value={filterLocation}
                  onValueChange={setFilterLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Device</label>
                <Select value={filterDevice} onValueChange={setFilterDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="All devices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All devices</SelectItem>
                    {uniqueDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear filters button */}
            {(searchTerm ||
              filterAction !== "all" ||
              filterLocation !== "all" ||
              filterDevice !== "all") && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterAction("all");
                    setFilterLocation("all");
                    setFilterDevice("all");
                  }}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredLogs.length} of {deviceUsageLogs.length} usage
            records
          </p>
        </div>
      </div>

      {/* Usage logs */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">
                No usage history found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {deviceUsageLogs.length === 0
                  ? "Start using your devices to see usage history here"
                  : "Try adjusting your filters to see more results"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log, index) => {
            const device = devices.find((d) => d.id === log.device_id);

            return (
              <Card key={log.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Action icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {getActionIcon(log.action)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getActionColor(log.action)}>
                          {log.action.charAt(0).toUpperCase() +
                            log.action.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(log.taken_at)}
                        </span>
                      </div>

                      {/* Device name */}
                      <h3 className="text-lg font-semibold mb-2">
                        {device?.name || "Unknown Device"}
                      </h3>

                      {/* Location and user info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          {getLocationIcon(log.location)}
                          <span className="font-medium">{log.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4" />
                          <span>{getCurrentUserInfo(log.user_id)}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {log.notes && (
                        <div className="p-3 bg-muted rounded-lg">
                          <span className="font-medium text-sm">Notes:</span>
                          <p className="text-sm mt-1">{log.notes}</p>
                        </div>
                      )}

                      {/* Return time for taken actions */}
                      {log.action === "taken" && log.returned_at && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          <span>Returned {formatDate(log.returned_at)}</span>
                        </div>
                      )}

                      {/* Duration for taken actions without return */}
                      {log.action === "taken" && !log.returned_at && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          <span>
                            Currently in use for {formatDate(log.taken_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
