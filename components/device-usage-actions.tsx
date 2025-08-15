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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDevices } from "@/context/device-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Package, Home, Building2, ArrowLeftRight } from "lucide-react";

interface DeviceUsageActionsProps {
  deviceId: string;
  deviceName: string;
  currentLocation?: string;
  currentUserId?: string;
  isCurrentUser?: boolean;
}

const LOCATIONS = [
  { value: "home", label: "Home", icon: Home },
  { value: "office", label: "Office", icon: Building2 },
  { value: "garage", label: "Garage", icon: Package },
  { value: "workshop", label: "Workshop", icon: Package },
  { value: "kitchen", label: "Kitchen", icon: Home },
  { value: "bedroom", label: "Bedroom", icon: Home },
  { value: "living-room", label: "Living Room", icon: Home },
  { value: "basement", label: "Basement", icon: Package },
  { value: "other", label: "Other", icon: ArrowLeftRight },
];

export function DeviceUsageActions({
  deviceId,
  deviceName,
  currentLocation = "home",
  currentUserId,
  isCurrentUser = false,
}: DeviceUsageActionsProps) {
  const { takeDevice, returnDevice, moveDevice } = useDevices();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<"take" | "return" | "move" | null>(null);
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);
    try {
      const finalLocation = location === "other" ? customLocation : location;

      if (action === "take") {
        await takeDevice(deviceId, finalLocation, notes);
        toast({
          title: "Device Taken",
          description: `You've taken ${deviceName} to ${finalLocation}`,
        });
      } else if (action === "return") {
        await returnDevice(deviceId, notes);
        toast({
          title: "Device Returned",
          description: `${deviceName} has been returned home`,
        });
      } else if (action === "move") {
        await moveDevice(deviceId, finalLocation, notes);
        toast({
          title: "Device Moved",
          description: `${deviceName} has been moved to ${finalLocation}`,
        });
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to perform action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAction(null);
    setLocation("");
    setCustomLocation("");
    setNotes("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  const getCurrentUserInfo = () => {
    if (!currentUserId) return null;
    // This would ideally come from a profiles context or be passed as a prop
    return currentUserId === user?.id ? "You" : "Another user";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto whitespace-normal text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20"
        >
          <Package className="w-4 h-4 mr-2" />
          Device Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Device Actions - {deviceName}</DialogTitle>
          <DialogDescription>
            Manage device usage and location tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Current Status:</p>
            <p className="text-sm text-muted-foreground">
              Location: {currentLocation}
              {currentUserId && (
                <>
                  <br />
                  User: {getCurrentUserInfo()}
                </>
              )}
            </p>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label>Select Action</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={action === "take" ? "default" : "outline"}
                size="sm"
                onClick={() => setAction("take")}
                disabled={isCurrentUser}
                className={
                  action === "take"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20"
                }
              >
                Take
              </Button>
              <Button
                variant={action === "return" ? "default" : "outline"}
                size="sm"
                onClick={() => setAction("return")}
                disabled={!isCurrentUser}
                className={
                  action === "return"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20"
                }
              >
                Return
              </Button>
              <Button
                variant={action === "move" ? "default" : "outline"}
                size="sm"
                onClick={() => setAction("move")}
                className={
                  action === "move"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20"
                }
              >
                Move
              </Button>
            </div>
          </div>

          {/* Location Selection (for take and move actions) */}
          {(action === "take" || action === "move") && (
            <div className="space-y-3">
              <Label>Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      <div className="flex items-center">
                        <loc.icon className="w-4 h-4 mr-2" />
                        {loc.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {location === "other" && (
                <Input
                  placeholder="Enter custom location"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                />
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Add any notes about this action..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Button */}
          {action && (
            <Button
              onClick={handleAction}
              disabled={
                isLoading ||
                (action !== "return" && !location) ||
                (location === "other" && !customLocation)
              }
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Processing..." : `Confirm ${action}`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
