"use client";

import type React from "react";

import { useState } from "react";
import { useDevices, type StorageBox } from "@/context/device-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StorageBoxManagerProps {
  onClose: () => void;
}

export function StorageBoxManager({ onClose }: StorageBoxManagerProps) {
  const { storageBoxes, addStorageBox, updateStorageBox, deleteStorageBox } =
    useDevices();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingBoxId, setEditingBoxId] = useState<string | null>(null);
  const [deleteBoxId, setDeleteBoxId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    compartments: 12,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "compartments" ? Number.parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Box name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Box location is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.compartments < 1 || formData.compartments > 100) {
      toast({
        title: "Validation Error",
        description: "Number of compartments must be between 1 and 100.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingBoxId) {
        // Update existing box
        await updateStorageBox(editingBoxId, formData);
        toast({
          title: "✅ Storage Box Updated Successfully!",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Add new box
        await addStorageBox(formData);
        toast({
          title: "🎉 Storage Box Added Successfully!",
          description: `${formData.name} has been added to your collection.`,
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving storage box:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem saving the storage box.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (box: StorageBox) => {
    setFormData({
      name: box.name,
      location: box.location,
      compartments: box.compartments,
    });
    setEditingBoxId(box.id);
    setIsAdding(true);
  };

  const handleDelete = () => {
    if (deleteBoxId) {
      deleteStorageBox(deleteBoxId);
      toast({
        title: "🗑️ Storage Box Deleted",
        description: "The storage box has been removed successfully.",
      });
      setDeleteBoxId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      compartments: 12,
    });
    setEditingBoxId(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Storage Boxes</h3>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
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
                className="lucide lucide-plus mr-2"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add Box
            </Button>
          </div>

          {storageBoxes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {storageBoxes.map((box) => (
                <Card key={box.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{box.name}</h4>
                        <p className="text-sm text-gray-500">
                          Location: {box.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          Compartments: {box.compartments}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(box)}
                          className="h-8 px-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteBoxId(box.id)}
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trash-2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-purple-100 p-4 rounded-full inline-flex mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-package text-purple-600"
                >
                  <path d="M16.5 9.4 7.55 4.24" />
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" x2="12" y1="22" y2="12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No storage boxes yet</h3>
              <p className="text-gray-500 mb-4">
                Add your first storage box to organize your devices
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-4">
            {editingBoxId ? "Edit Storage Box" : "Add New Storage Box"}
          </h3>
          {/* Provide a hidden description for a11y when used inside dialogs elsewhere */}
          <p id="storage-box-form-description" className="sr-only">
            Enter the storage box name, location, and compartments, then save.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Box Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Pinsa Electrics Box 1"
              />
            </div>

            <div>
              <Label htmlFor="location">Box Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Garage Shelf"
              />
            </div>

            <div>
              <Label htmlFor="compartments">Number of Compartments</Label>
              <Input
                id="compartments"
                name="compartments"
                type="number"
                min={1}
                max={100}
                value={formData.compartments}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                How many separate compartments does this storage box have?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-sm sm:text-base"
              >
                {editingBoxId ? "Update Box" : "Add Box"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <AlertDialog
        open={!!deleteBoxId}
        onOpenChange={(open) => !open && setDeleteBoxId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this storage box. Any devices
              assigned to this box will be unassigned. This action cannot be
              undone.
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
    </div>
  );
}
