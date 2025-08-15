"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";

export type DeviceStatus = "working" | "needs-repair" | "broken";

export interface StorageBox {
  id: string;
  name: string;
  location: string;
  compartments: number;
  household_id: string;
  created_by: string;
}

export interface Device {
  id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  status: DeviceStatus;
  notes: string;
  lastMaintenance: string | null;
  createdAt: string;
  storageBox?: string;
  compartmentNumber?: number;
  household_id: string;
  created_by: string;
  current_user_id?: string;
  current_location?: string;
}

export interface DeviceUsageLog {
  id: string;
  device_id: string;
  user_id: string;
  action: "taken" | "returned" | "moved";
  location: string;
  notes?: string;
  taken_at: string;
  returned_at?: string;
  household_id: string;
}

interface DeviceContextType {
  devices: Device[];
  storageBoxes: StorageBox[];
  deviceUsageLogs: DeviceUsageLog[];
  loading: boolean;
  isSupabaseReady: boolean;
  isMounted: boolean;
  addDevice: (
    device: Omit<Device, "id" | "createdAt" | "household_id" | "created_by">
  ) => Promise<void>;
  updateDevice: (id: string, device: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  getDeviceById: (id: string) => Device | undefined;
  addStorageBox: (
    box: Omit<StorageBox, "id" | "household_id" | "created_by">
  ) => Promise<void>;
  updateStorageBox: (id: string, box: Partial<StorageBox>) => Promise<void>;
  deleteStorageBox: (id: string) => Promise<void>;
  getStorageBoxById: (id: string) => StorageBox | undefined;
  filterDevices: (filters: {
    search?: string;
    category?: string;
    location?: string;
    status?: DeviceStatus;
    storageBox?: string;
  }) => Device[];
  takeDevice: (
    deviceId: string,
    location: string,
    notes?: string
  ) => Promise<void>;
  returnDevice: (deviceId: string, notes?: string) => Promise<void>;
  moveDevice: (
    deviceId: string,
    newLocation: string,
    notes?: string
  ) => Promise<void>;
  getDeviceUsageHistory: (deviceId: string) => DeviceUsageLog[];
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Sample storage boxes for fallback
const sampleStorageBoxes: StorageBox[] = [
  {
    id: "box1",
    name: "Pinsa Electrics Box 1",
    location: "Garage Shelf",
    compartments: 12,
    household_id: "sample",
    created_by: "sample",
  },
  {
    id: "box2",
    name: "Tools Box",
    location: "Workshop",
    compartments: 8,
    household_id: "sample",
    created_by: "sample",
  },
];

// Sample devices for fallback
const sampleDevices: Device[] = [
  {
    id: "1",
    name: "Power Drill",
    image: "/placeholder.svg?height=200&width=200",
    category: "Power Tools",
    location: "Garage",
    status: "working",
    notes: "Black & Decker, 18V",
    lastMaintenance: "2023-10-15",
    createdAt: "2023-01-15T00:00:00.000Z",
    storageBox: "box2",
    compartmentNumber: 3,
    household_id: "sample",
    created_by: "sample",
  },
  {
    id: "2",
    name: "Soldering Iron",
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    location: "Workshop",
    status: "working",
    notes: "Weller, 40W",
    lastMaintenance: "2023-09-20",
    createdAt: "2022-11-05T00:00:00.000Z",
    storageBox: "box1",
    compartmentNumber: 5,
    household_id: "sample",
    created_by: "sample",
  },
  {
    id: "3",
    name: "Electric Kettle",
    image: "/placeholder.svg?height=200&width=200",
    category: "Kitchen Appliances",
    location: "Kitchen",
    status: "needs-repair",
    notes: "Heating element seems weak",
    lastMaintenance: null,
    createdAt: "2022-05-10T00:00:00.000Z",
    household_id: "sample",
    created_by: "sample",
  },
];

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, household } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [storageBoxes, setStorageBoxes] = useState<StorageBox[]>([]);
  const [deviceUsageLogs, setDeviceUsageLogs] = useState<DeviceUsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if Supabase is configured and working
  const checkSupabaseConnection = async () => {
    try {
      if (typeof window === "undefined") return false;

      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        console.log(
          "Supabase environment variables not configured, using localStorage"
        );
        return false;
      }

      if (!supabase) {
        console.log("Supabase client not initialized");
        return false;
      }

      const { error } = await supabase
        .from("storage_boxes")
        .select("count", { count: "exact", head: true });

      if (error) {
        console.log("Supabase tables not ready:", error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.log("Supabase connection failed:", error);
      return false;
    }
  };

  // Load data when user and household are available
  useEffect(() => {
    if (isMounted && user) {
      loadData();
    }
  }, [isMounted, user, household]);

  const loadDeviceUsageLogs = async () => {
    if (!supabase || !household) return;

    try {
      const { data, error } = await supabase
        .from("device_usage_log")
        .select("*")
        .eq("household_id", household.id)
        .order("taken_at", { ascending: false });

      if (error) {
        console.error("Error loading device usage logs:", error);
        return;
      }

      setDeviceUsageLogs(data || []);
    } catch (error) {
      console.error("Error loading device usage logs:", error);
    }
  };

  // Set up real-time subscriptions only if Supabase is ready and user has household
  useEffect(() => {
    if (!isSupabaseReady || !supabase || !isMounted || !household) return;

    const devicesSubscription = supabase
      .channel("devices-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "devices",
          filter: `household_id=eq.${household.id}`,
        },
        () => {
          loadDevices();
        }
      )
      .subscribe();

    const boxesSubscription = supabase
      .channel("storage-boxes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "storage_boxes",
          filter: `household_id=eq.${household.id}`,
        },
        () => {
          loadStorageBoxes();
        }
      )
      .subscribe();

    return () => {
      devicesSubscription.unsubscribe();
      boxesSubscription.unsubscribe();
    };
  }, [isSupabaseReady, isMounted, household]);

  const loadData = async () => {
    if (!isMounted || !user) return;

    setLoading(true);
    try {
      const supabaseReady = await checkSupabaseConnection();
      setIsSupabaseReady(supabaseReady);

      if (supabaseReady && household) {
        console.log("Loading data from Supabase...");
        await Promise.all([
          loadDevices(),
          loadStorageBoxes(),
          loadDeviceUsageLogs(),
        ]);
      } else {
        console.log("Loading data from localStorage...");
        const storedDevices = localStorage.getItem(`yetnewDevices_${user.id}`);
        if (storedDevices) {
          try {
            setDevices(JSON.parse(storedDevices));
          } catch (error) {
            console.error("Error parsing stored devices:", error);
            setDevices(sampleDevices);
          }
        } else {
          setDevices(sampleDevices);
        }

        const storedBoxes = localStorage.getItem(
          `yetnewStorageBoxes_${user.id}`
        );
        if (storedBoxes) {
          try {
            setStorageBoxes(JSON.parse(storedBoxes));
          } catch (error) {
            console.error("Error parsing stored boxes:", error);
            setStorageBoxes(sampleStorageBoxes);
          }
        } else {
          setStorageBoxes(sampleStorageBoxes);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setDevices(sampleDevices);
      setStorageBoxes(sampleStorageBoxes);
      setIsSupabaseReady(false);
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    if (!isSupabaseReady || !supabase || !household) return;

    try {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .eq("household_id", household.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading devices:", error);
        return;
      }

      const formattedDevices: Device[] = data.map((device) => ({
        id: device.id,
        name: device.name,
        image: device.image || "/placeholder.svg?height=200&width=200",
        category: device.category,
        location: device.location,
        status: device.status as DeviceStatus,
        notes: device.notes || "",
        lastMaintenance: device.last_maintenance,
        createdAt: device.created_at,
        storageBox: device.storage_box || undefined,
        compartmentNumber: device.compartment_number || undefined,
        household_id: device.household_id,
        created_by: device.created_by,
        current_user_id: device.current_user_id || undefined,
        current_location: device.current_location || "home",
      }));

      setDevices(formattedDevices);
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  };

  const loadStorageBoxes = async () => {
    if (!isSupabaseReady || !supabase || !household) return;

    try {
      const { data, error } = await supabase
        .from("storage_boxes")
        .select("*")
        .eq("household_id", household.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading storage boxes:", error);
        return;
      }

      const formattedBoxes: StorageBox[] = data.map((box) => ({
        id: box.id,
        name: box.name,
        location: box.location,
        compartments: box.compartments,
        household_id: box.household_id,
        created_by: box.created_by,
      }));

      setStorageBoxes(formattedBoxes);
    } catch (error) {
      console.error("Error loading storage boxes:", error);
    }
  };

  // Save to localStorage when not using Supabase
  useEffect(() => {
    if (!isSupabaseReady && devices.length > 0 && isMounted && user) {
      try {
        localStorage.setItem(
          `yetnewDevices_${user.id}`,
          JSON.stringify(devices)
        );
      } catch (error) {
        console.error("Error saving devices to localStorage:", error);
      }
    }
  }, [devices, isSupabaseReady, isMounted, user]);

  useEffect(() => {
    if (!isSupabaseReady && storageBoxes.length > 0 && isMounted && user) {
      try {
        localStorage.setItem(
          `yetnewStorageBoxes_${user.id}`,
          JSON.stringify(storageBoxes)
        );
      } catch (error) {
        console.error("Error saving storage boxes to localStorage:", error);
      }
    }
  }, [storageBoxes, isSupabaseReady, isMounted, user]);

  const addDevice = async (
    device: Omit<Device, "id" | "createdAt" | "household_id" | "created_by">
  ) => {
    if (!user) throw new Error("Not authenticated");

    if (isSupabaseReady && supabase && household) {
      try {
        const { data, error } = await supabase
          .from("devices")
          .insert({
            name: device.name,
            image: device.image,
            category: device.category,
            location: device.location,
            status: device.status,
            notes: device.notes,
            last_maintenance:
              device.lastMaintenance && device.lastMaintenance !== ""
                ? device.lastMaintenance
                : null,
            storage_box: device.storageBox || null,
            compartment_number: device.compartmentNumber || null,
            household_id: household.id,
            created_by: user.id,
          })
          .select();

        if (error) {
          console.error("Error adding device:", error);
          throw new Error(`Failed to add device: ${error.message}`);
        }

        console.log("Device added successfully:", data);
      } catch (error) {
        console.error("Error adding device:", error);
        throw error;
      }
    } else if (!household) {
      throw new Error(
        "Please create or join a household first before adding devices."
      );
    } else {
      // Fallback to localStorage
      const newDevice: Device = {
        ...device,
        id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        household_id: household?.id || "local",
        created_by: user.id,
      };
      setDevices((prev) => [newDevice, ...prev]);
    }
  };

  const updateDevice = async (id: string, updatedFields: Partial<Device>) => {
    if (isSupabaseReady && supabase && household) {
      try {
        const { error } = await supabase
          .from("devices")
          .update({
            name: updatedFields.name,
            image: updatedFields.image,
            category: updatedFields.category,
            location: updatedFields.location,
            status: updatedFields.status,
            notes: updatedFields.notes,
            last_maintenance:
              updatedFields.lastMaintenance &&
              updatedFields.lastMaintenance !== ""
                ? updatedFields.lastMaintenance
                : null,
            storage_box: updatedFields.storageBox || null,
            compartment_number: updatedFields.compartmentNumber || null,
          })
          .eq("id", id)
          .eq("household_id", household.id);

        if (error) {
          console.error("Error updating device:", error);
          throw new Error(`Failed to update device: ${error.message}`);
        }
      } catch (error) {
        console.error("Error updating device:", error);
        throw error;
      }
    } else {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === id ? { ...device, ...updatedFields } : device
        )
      );
    }
  };

  const deleteDevice = async (id: string) => {
    if (isSupabaseReady && supabase && household) {
      try {
        const { error } = await supabase
          .from("devices")
          .delete()
          .eq("id", id)
          .eq("household_id", household.id);

        if (error) {
          console.error("Error deleting device:", error);
          throw new Error(`Failed to delete device: ${error.message}`);
        }
      } catch (error) {
        console.error("Error deleting device:", error);
        throw error;
      }
    } else {
      setDevices((prev) => prev.filter((device) => device.id !== id));
    }
  };

  const getDeviceById = (id: string) => {
    return devices.find((device) => device.id === id);
  };

  const addStorageBox = async (
    box: Omit<StorageBox, "id" | "household_id" | "created_by">
  ) => {
    if (!user) throw new Error("Not authenticated");

    if (isSupabaseReady && supabase && household) {
      try {
        const { data, error } = await supabase
          .from("storage_boxes")
          .insert({
            name: box.name,
            location: box.location,
            compartments: box.compartments,
            household_id: household.id,
            created_by: user.id,
          })
          .select();

        if (error) {
          console.error("Error adding storage box:", error);
          throw new Error(
            `Failed to add storage box: ${
              error.message || "Unknown database error"
            }`
          );
        }

        console.log("Storage box added successfully:", data);
      } catch (error) {
        console.error("Error adding storage box:", error);
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(`Failed to add storage box: ${String(error)}`);
        }
      }
    } else if (!household) {
      throw new Error(
        "Please create or join a household first before adding storage boxes."
      );
    } else {
      const newBox: StorageBox = {
        ...box,
        id: `box_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        household_id: household?.id || "local",
        created_by: user.id,
      };
      setStorageBoxes((prev) => [newBox, ...prev]);
    }
  };

  const updateStorageBox = async (
    id: string,
    updatedFields: Partial<StorageBox>
  ) => {
    if (isSupabaseReady && supabase && household) {
      try {
        const { data, error } = await supabase
          .from("storage_boxes")
          .update({
            name: updatedFields.name,
            location: updatedFields.location,
            compartments: updatedFields.compartments,
          })
          .eq("id", id)
          .eq("household_id", household.id)
          .select();

        if (error) {
          console.error("Error updating storage box:", error);
          throw new Error(
            `Failed to update storage box: ${
              error.message || "Unknown database error"
            }`
          );
        }

        console.log("Storage box updated successfully:", data);
      } catch (error) {
        console.error("Error updating storage box:", error);
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(`Failed to update storage box: ${String(error)}`);
        }
      }
    } else {
      setStorageBoxes((prev) =>
        prev.map((box) => (box.id === id ? { ...box, ...updatedFields } : box))
      );
    }
  };

  const deleteStorageBox = async (id: string) => {
    if (isSupabaseReady && supabase && household) {
      try {
        const { data, error } = await supabase
          .from("storage_boxes")
          .delete()
          .eq("id", id)
          .eq("household_id", household.id)
          .select();

        if (error) {
          console.error("Error deleting storage box:", error);
          throw new Error(
            `Failed to delete storage box: ${
              error.message || "Unknown database error"
            }`
          );
        }

        console.log("Storage box deleted successfully:", data);
      } catch (error) {
        console.error("Error deleting storage box:", error);
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(`Failed to delete storage box: ${String(error)}`);
        }
      }
    } else {
      setStorageBoxes((prev) => prev.filter((box) => box.id !== id));
      setDevices((prev) =>
        prev.map((device) =>
          device.storageBox === id
            ? { ...device, storageBox: undefined, compartmentNumber: undefined }
            : device
        )
      );
    }
  };

  const getStorageBoxById = (id: string) => {
    return storageBoxes.find((box) => box.id === id);
  };

  const filterDevices = (filters: {
    search?: string;
    category?: string;
    location?: string;
    status?: DeviceStatus;
    storageBox?: string;
  }) => {
    return devices.filter((device) => {
      if (
        filters.search &&
        !device.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !device.notes.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (filters.category && device.category !== filters.category) {
        return false;
      }

      if (filters.location && device.location !== filters.location) {
        return false;
      }

      if (filters.status && device.status !== filters.status) {
        return false;
      }

      if (filters.storageBox && device.storageBox !== filters.storageBox) {
        return false;
      }

      return true;
    });
  };

  // Device usage tracking methods
  const takeDevice = async (
    deviceId: string,
    location: string,
    notes?: string
  ) => {
    if (!supabase || !household || !user) {
      throw new Error("Not authenticated or no household");
    }

    try {
      // Create usage log entry
      const { error: logError } = await supabase
        .from("device_usage_log")
        .insert({
          device_id: deviceId,
          user_id: user.id,
          action: "taken",
          location,
          notes,
          household_id: household.id,
        });

      if (logError) {
        throw new Error(`Failed to log device usage: ${logError.message}`);
      }

      // Update device with current user and location
      const { error: deviceError } = await supabase
        .from("devices")
        .update({
          current_user_id: user.id,
          current_location: location,
        })
        .eq("id", deviceId);

      if (deviceError) {
        throw new Error(`Failed to update device: ${deviceError.message}`);
      }

      // Update local state
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? {
                ...device,
                current_user_id: user.id,
                current_location: location,
              }
            : device
        )
      );

      // Reload usage logs
      await loadDeviceUsageLogs();
    } catch (error) {
      console.error("Error taking device:", error);
      throw error;
    }
  };

  const returnDevice = async (deviceId: string, notes?: string) => {
    if (!supabase || !household || !user) {
      throw new Error("Not authenticated or no household");
    }

    try {
      // Find the most recent "taken" log entry for this device
      const { data: logs, error: fetchError } = await supabase
        .from("device_usage_log")
        .select("*")
        .eq("device_id", deviceId)
        .eq("action", "taken")
        .is("returned_at", null)
        .order("taken_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        throw new Error(`Failed to fetch device logs: ${fetchError.message}`);
      }

      if (logs && logs.length > 0) {
        // Update the log entry with return time
        const { error: updateError } = await supabase
          .from("device_usage_log")
          .update({ returned_at: new Date().toISOString() })
          .eq("id", logs[0].id);

        if (updateError) {
          throw new Error(`Failed to update log: ${updateError.message}`);
        }
      }

      // Update device to remove current user
      const { error: deviceError } = await supabase
        .from("devices")
        .update({
          current_user_id: null,
          current_location: "home",
        })
        .eq("id", deviceId);

      if (deviceError) {
        throw new Error(`Failed to update device: ${deviceError.message}`);
      }

      // Update local state
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? {
                ...device,
                current_user_id: undefined,
                current_location: "home",
              }
            : device
        )
      );

      // Reload usage logs
      await loadDeviceUsageLogs();
    } catch (error) {
      console.error("Error returning device:", error);
      throw error;
    }
  };

  const moveDevice = async (
    deviceId: string,
    newLocation: string,
    notes?: string
  ) => {
    if (!supabase || !household || !user) {
      throw new Error("Not authenticated or no household");
    }

    try {
      // Create usage log entry for the move
      const { error: logError } = await supabase
        .from("device_usage_log")
        .insert({
          device_id: deviceId,
          user_id: user.id,
          action: "moved",
          location: newLocation,
          notes,
          household_id: household.id,
        });

      if (logError) {
        throw new Error(`Failed to log device move: ${logError.message}`);
      }

      // Update device location
      const { error: deviceError } = await supabase
        .from("devices")
        .update({
          current_location: newLocation,
        })
        .eq("id", deviceId);

      if (deviceError) {
        throw new Error(`Failed to update device: ${deviceError.message}`);
      }

      // Update local state
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, current_location: newLocation }
            : device
        )
      );

      // Reload usage logs
      await loadDeviceUsageLogs();
    } catch (error) {
      console.error("Error moving device:", error);
      throw error;
    }
  };

  const getDeviceUsageHistory = (deviceId: string) => {
    return deviceUsageLogs.filter((log) => log.device_id === deviceId);
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        storageBoxes,
        deviceUsageLogs,
        loading,
        isSupabaseReady,
        isMounted,
        addDevice,
        updateDevice,
        deleteDevice,
        getDeviceById,
        addStorageBox,
        updateStorageBox,
        deleteStorageBox,
        getStorageBoxById,
        filterDevices,
        takeDevice,
        returnDevice,
        moveDevice,
        getDeviceUsageHistory,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
};
