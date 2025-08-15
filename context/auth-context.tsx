"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  household_id: string | null;
  role: "admin" | "member";
}

interface Household {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  household: Household | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  createHousehold: (name: string, description?: string) => Promise<void>;
  joinHousehold: (householdId: string) => Promise<void>;
  inviteMember: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      // Check if Supabase is available
      const supabaseReady = await checkSupabaseConnection();

      if (supabaseReady && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        }
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setHousehold(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loadProfile = async (userId: string) => {
    if (!supabase) return;

    try {
      // Check if profile exists first
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        // PGRST116: No rows found
        console.error("Error loading profile:", profileError);
        return;
      }

      if (!profileData) {
        // Try to fetch user from auth.users
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          console.error("Error loading user for profile creation:", userError);
          return;
        }
        // Double-check profile doesn't exist (race condition safety)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", userData.user.id)
          .maybeSingle();
        if (!existingProfile) {
          const now = new Date().toISOString();
          const { error: createProfileError } = await supabase
            .from("profiles")
            .insert({
              id: userData.user.id,
              email: userData.user.email,
              full_name:
                userData.user.user_metadata?.full_name ||
                userData.user.email?.split("@")[0] ||
                "",
              role: "member",
              created_at: now,
              updated_at: now,
            });
          if (createProfileError) {
            console.error(
              "Error creating missing profile:",
              createProfileError
            );
            return;
          }
        }
        // Try to fetch the profile again
        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        setProfile(newProfile);
        return;
      }

      setProfile(profileData);

      // Load household if user has one
      if (profileData.household_id) {
        const { data: householdData, error: householdError } = await supabase
          .from("households")
          .select("*")
          .eq("id", profileData.household_id)
          .single();

        if (!householdError && householdData) {
          setHousehold(householdData);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Trim and strong validation for email
    email = email.trim();
    // RFC 5322 Official Standard regex for email validation
    const emailRegex =
      /^(?:[a-zA-Z0-9_'^&amp;\/+-])+(?:\.(?:[a-zA-Z0-9_'^&amp;\/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error(
        "Please enter a valid email address (e.g. user@example.com). Only standard email addresses are allowed."
      );
    }

    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Do not manually insert profile here.
    // In production, the DB trigger (handle_new_user) should create profiles.
    // If auto-confirm is on, profile will be created on first authenticated session by loadProfile().
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!supabase || !user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;

    // Reload profile
    await loadProfile(user.id);
  };

  const createHousehold = async (name: string, description?: string) => {
    if (!user) throw new Error("Not authenticated");

    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    try {
      const { data, error } = await supabase
        .from("households")
        .insert({
          name,
          description,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating household:", error);
        throw new Error(`Failed to create household: ${error.message}`);
      }

      if (!data) {
        throw new Error("Failed to create household: No data returned");
      }

      // Update user profile with household_id
      await updateProfile({ household_id: data.id });

      // Reload profile to get updated household info
      await loadProfile(user.id);

      return data.id;
    } catch (error) {
      console.error("Error in createHousehold:", error);
      throw error;
    }
  };

  const joinHousehold = async (householdId: string) => {
    if (!supabase || !user) throw new Error("Not authenticated");

    try {
      // First verify the household exists
      const { data: householdData, error: householdError } = await supabase
        .from("households")
        .select("id, name")
        .eq("id", householdId)
        .single();

      if (householdError || !householdData) {
        throw new Error("Household not found. Please check the household ID.");
      }

      await updateProfile({ household_id: householdId, role: "member" });

      // Reload profile to get updated household info
      await loadProfile(user.id);
    } catch (error) {
      console.error("Error joining household:", error);
      throw error;
    }
  };

  const inviteMember = async (email: string) => {
    if (!supabase || !household)
      throw new Error("Not authenticated or no household");

    // In a real app, you'd send an email invitation
    // For now, we'll just log it
    console.log(`Invitation sent to ${email} for household ${household.name}`);
  };

  // Check if Supabase is configured and working
  const checkSupabaseConnection = async () => {
    try {
      // Check if we're on the client side and have environment variables
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

      // Test the connection by trying to query a table
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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        household,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        createHousehold,
        joinHousehold,
        inviteMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
