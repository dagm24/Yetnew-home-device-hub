"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function FamilyPage() {
  const { profile, household, createHousehold, joinHousehold, inviteMember } =
    useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [householdName, setHouseholdName] = useState("");
  const [householdDescription, setHouseholdDescription] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const [createdHouseholdId, setCreatedHouseholdId] = useState<string | null>(
    null
  );
  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Validate input
      if (!householdName.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a household name.",
          variant: "destructive",
        });
        return;
      }

      const newId = await createHousehold(householdName.trim(), householdDescription.trim() || undefined);
      setCreatedHouseholdId(newId);
      toast({
        title: "🎉 Household Created Successfully!",
        description: `Your household "${householdName}" has been created. Share the ID below with your family members!`,
      });
      setHouseholdName("");
      setHouseholdDescription("");
    } catch (error) {
      console.error("Error creating household:", error);
      toast({
        title: "❌ Error Creating Household",
        description:
          error instanceof Error ? error.message : "Failed to create household. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);

    try {
      // Validate input
      if (!joinCode.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a household ID.",
          variant: "destructive",
        });
        return;
      }

      await joinHousehold(joinCode.trim());
      toast({
        title: "🎉 Successfully Joined Household!",
        description: "You have successfully joined the household. Welcome to the family!",
      });
      setJoinCode("");
    } catch (error) {
      console.error("Error joining household:", error);
      toast({
        title: "❌ Error Joining Household",
        description:
          error instanceof Error ? error.message : "Failed to join household. Please check the ID and try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate email
      if (!inviteEmail.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter an email address.",
          variant: "destructive",
        });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteEmail.trim())) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      await inviteMember(inviteEmail.trim());
      toast({
        title: "📧 Invitation Sent!",
        description: `An invitation has been sent to ${inviteEmail}. They will receive an email to join your household.`,
      });
      setInviteEmail("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "❌ Error Sending Invitation",
        description:
          error instanceof Error ? error.message : "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navigation />

        <main className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Family Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your household and invite family members
            </p>
          </div>

          {createdHouseholdId && !household ? (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-green-800">
                    Household Created!
                  </span>
                  <span className="text-green-700 text-sm">
                    Share this ID with your family members so they can join:
                  </span>
                  <code className="bg-white px-2 py-1 rounded border text-sm font-mono">
                    {createdHouseholdId}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (createdHouseholdId) {
                        navigator.clipboard.writeText(createdHouseholdId);
                        toast({
                          title: "Copied!",
                          description: "Household ID copied to clipboard.",
                        });
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
          {household ? (
            <div className="space-y-6">
              {/* Current Household */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Household</span>
                    <Badge variant="default">{profile?.role}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Manage your household settings and members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {household?.name}
                      </h3>
                      {household?.description && (
                        <p className="text-gray-600">{household.description}</p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Household ID</h4>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded border text-sm font-mono">
                          {household?.id}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (household?.id) {
                              navigator.clipboard.writeText(household.id);
                              toast({
                                title: "Copied!",
                                description:
                                  "Household ID copied to clipboard.",
                              });
                            }
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Share this ID with family members so they can join your
                        household
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invite Members */}
              {profile?.role === "admin" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Invite Family Members</CardTitle>
                    <CardDescription>
                      Send invitations to family members to join your household
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleInviteMember} className="space-y-4">
                      <div>
                        <Label htmlFor="inviteEmail">Email Address</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter family member's email"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Invitation
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Create Household */}
              <Card>
                <CardHeader>
                  <CardTitle>Create a Household</CardTitle>
                  <CardDescription>
                    Start managing devices for your family
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateHousehold} className="space-y-4">
                    <div>
                      <Label htmlFor="householdName">Household Name</Label>
                      <Input
                        id="householdName"
                        value={householdName}
                        onChange={(e) => setHouseholdName(e.target.value)}
                        placeholder="e.g., The Smith Family"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="householdDescription">
                        Description (Optional)
                      </Label>
                      <Input
                        id="householdDescription"
                        value={householdDescription}
                        onChange={(e) =>
                          setHouseholdDescription(e.target.value)
                        }
                        placeholder="Brief description of your household"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-sm sm:text-base"
                      disabled={isCreating}
                    >
                      {isCreating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Household
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Join Household */}
              <Card>
                <CardHeader>
                  <CardTitle>Join a Household</CardTitle>
                  <CardDescription>
                    Join an existing family household
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoinHousehold} className="space-y-4">
                    <div>
                      <Label htmlFor="joinCode">Household ID</Label>
                      <Input
                        id="joinCode"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter household ID"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ask a family member for the household ID to join
                      </p>
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full bg-transparent text-sm sm:text-base"
                      disabled={isJoining}
                    >
                      {isJoining && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Join Household
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
