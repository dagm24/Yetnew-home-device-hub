"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDevices } from "@/context/device-context";
import { useAuth } from "@/context/auth-context";
import {
  History,
  Package,
  Home,
  Building2,
  ArrowLeftRight,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DeviceUsageHistoryProps {
  deviceId: string;
  deviceName: string;
}

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

export function DeviceUsageHistory({
  deviceId,
  deviceName,
}: DeviceUsageHistoryProps) {
  const { deviceUsageLogs, getDeviceUsageHistory } = useDevices();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const deviceLogs = getDeviceUsageHistory(deviceId);
  const hasLogs = deviceLogs.length > 0;

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full sm:w-auto whitespace-normal text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
        >
          <History className="w-4 h-4 mr-2" />
          Usage History
          {hasLogs && (
            <Badge variant="secondary" className="ml-2">
              {deviceLogs.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Usage History - {deviceName}</DialogTitle>
          <DialogDescription>
            Track all device movements and usage over time
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {!hasLogs ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No usage history yet</p>
              <p className="text-sm">
                Start using the device to see its history
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {deviceLogs.map((log, index) => (
                <div
                  key={log.id}
                  className={`relative p-4 rounded-lg border ${
                    index === 0
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                      : "bg-muted/50"
                  }`}
                >
                  {/* Timeline connector */}
                  {index < deviceLogs.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                  )}

                  {/* Action icon and badge */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center">
                      {getActionIcon(log.action)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActionColor(log.action)}>
                          {log.action.charAt(0).toUpperCase() +
                            log.action.slice(1)}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>

                      {/* Location info */}
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        {getLocationIcon(log.location)}
                        <span className="font-medium">{log.location}</span>
                        {log.location !== "home" && (
                          <span className="text-muted-foreground">
                            • {formatDate(log.taken_at)}
                          </span>
                        )}
                      </div>

                      {/* User info */}
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>
                          {log.user_id === user?.id ? "You" : "Another user"}
                        </span>
                      </div>

                      {/* Notes */}
                      {log.notes && (
                        <div className="mt-2 p-2 bg-background rounded border text-sm">
                          <span className="font-medium">Notes:</span>{" "}
                          {log.notes}
                        </div>
                      )}

                      {/* Return time for taken actions */}
                      {log.action === "taken" && log.returned_at && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>Returned {formatDate(log.returned_at)}</span>
                        </div>
                      )}

                      {/* Duration for taken actions without return */}
                      {log.action === "taken" && !log.returned_at && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>
                            Currently in use for {formatDate(log.taken_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {hasLogs && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              Total {deviceLogs.length} usage record
              {deviceLogs.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
