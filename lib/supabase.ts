import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a client only if both variables are available and we're on the client side
export const supabase =
  typeof window !== "undefined" && supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          household_id: string | null
          role: "admin" | "member"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          household_id?: string | null
          role?: "admin" | "member"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          household_id?: string | null
          role?: "admin" | "member"
          updated_at?: string
        }
      }
      households: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          updated_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          name: string
          image: string | null
          category: string
          location: string
          status: "working" | "needs-repair" | "broken"
          notes: string | null
          last_maintenance: string | null
          storage_box: string | null
          compartment_number: number | null
          household_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image?: string | null
          category: string
          location: string
          status?: "working" | "needs-repair" | "broken"
          notes?: string | null
          last_maintenance?: string | null
          storage_box?: string | null
          compartment_number?: number | null
          household_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image?: string | null
          category?: string
          location?: string
          status?: "working" | "needs-repair" | "broken"
          notes?: string | null
          last_maintenance?: string | null
          storage_box?: string | null
          compartment_number?: number | null
          updated_at?: string
        }
      }
      storage_boxes: {
        Row: {
          id: string
          name: string
          location: string
          compartments: number
          household_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          compartments: number
          household_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          compartments?: number
          updated_at?: string
        }
      }
    }
  }
}
