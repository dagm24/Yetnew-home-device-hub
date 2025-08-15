"use client";

import { useState } from "react";
import { useDevices, type Device } from "@/context/device-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeviceForm } from "@/components/device-form";
import { DeviceUsageActions } from "@/components/device-usage-actions";
import { DeviceUsageHistory } from "@/components/device-usage-history";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface DeviceDetailProps {
  device: Device;
  onClose: () => void;
}

export function DeviceDetail({ device, onClose }: DeviceDetailProps) {
  const { deleteDevice, getStorageBoxById } = useDevices();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get storage box information if available
  const storageBox = device.storageBox
    ? getStorageBoxById(device.storageBox)
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-green-100 text-green-800";
      case "needs-repair":
        return "bg-yellow-100 text-yellow-800";
      case "broken":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = () => {
    deleteDevice(device.id);
    toast({
      title: "🗑️ Device Deleted Successfully!",
      description: `${device.name} has been removed from your collection.`,
    });
    onClose();
  };

  if (isEditing) {
    return (
      <DeviceForm
        deviceId={device.id}
        onComplete={() => {
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative h-64 sm:h-72 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          <Image
            src={device.image || "/placeholder.svg"}
            alt={device.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="bg-white/0 dark:bg-gray-900/0">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">{device.name}</h2>
            <Badge className={getStatusColor(device.status)}>
              {device.status.replace("-", " ")}
            </Badge>
          </div>

          <dl className="mt-4 space-y-3 text-xs sm:text-sm">
            <div className="flex">
              <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">
                Category:
              </dt>
              <dd>{device.category}</dd>
            </div>
            <div className="flex">
              <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">
                Location:
              </dt>
              <dd>{device.location}</dd>
            </div>

            {storageBox && (
              <>
                <div className="flex">
                  <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">
                    Storage Box:
                  </dt>
                  <dd className="font-medium text-purple-600">
                    {storageBox.name}
                  </dd>
                </div>
                {device.compartmentNumber && (
                  <div className="flex">
                    <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">
                      Compartment:
                    </dt>
                    <dd className="font-medium text-purple-600">
                      #{device.compartmentNumber}
                    </dd>
                  </div>
                )}
                <div className="flex">
                  <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">
                    Box Location:
                  </dt>
                  <dd>{storageBox.location}</dd>
                </div>
              </>
            )}

            <div className="flex">
              <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">
                Last Maintenance:
              </dt>
              <dd>
                {device.lastMaintenance
                  ? new Date(device.lastMaintenance).toLocaleDateString()
                  : "Not recorded"}
              </dd>
            </div>
            <div className="flex">
              <dt className="w-32 font-medium text-gray-500 dark:text-gray-400">
                Added on:
              </dt>
              <dd>{new Date(device.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>

          {device.notes && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-500 dark:text-gray-400">
                Notes:
              </h3>
              <p className="mt-1 text-sm">{device.notes}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
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
                className="lucide lucide-pencil mr-2"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1"
            >
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
                className="lucide lucide-trash-2 mr-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
              Delete
            </Button>
          </div>

          {/* Usage actions inside details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <DeviceUsageActions
              deviceId={device.id}
              deviceName={device.name}
              currentLocation={device.current_location}
              currentUserId={device.current_user_id}
              isCurrentUser={device.current_user_id === user?.id}
            />
            <DeviceUsageHistory deviceId={device.id} deviceName={device.name} />
          </div>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {device.name} from your collection.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
