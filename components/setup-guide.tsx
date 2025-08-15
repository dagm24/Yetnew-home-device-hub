"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function SetupGuide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-blue-200 text-blue-600 hover:bg-blue-50"
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
          className="lucide lucide-info mr-2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="l9 12 2 2 4-4" />
        </svg>
        Setup Guide
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yetnew Setup Guide</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-info text-yellow-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="l9 12 2 2 4-4" />
                </svg>
                <h3 className="font-semibold text-yellow-800">Current Status</h3>
              </div>
              <p className="text-yellow-700">
                Your app is currently running in <strong>local mode</strong> using browser storage. To enable real-time
                syncing across devices, you need to set up Supabase.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Step 1</Badge>
                  Set up Supabase Database
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Go to{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      supabase.com
                    </a>{" "}
                    and create a new project
                  </li>
                  <li>Once your project is ready, go to the SQL Editor</li>
                  <li>Copy and paste this SQL script to create the required tables:</li>
                </ol>

                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                  <pre>{`-- Create storage_boxes table first
CREATE TABLE IF NOT EXISTS storage_boxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  compartments INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('working', 'needs-repair', 'broken')) DEFAULT 'working',
  notes TEXT,
  last_maintenance DATE,
  storage_box UUID REFERENCES storage_boxes(id) ON DELETE SET NULL,
  compartment_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_boxes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Allow all operations on devices" ON devices FOR ALL USING (true);
CREATE POLICY "Allow all operations on storage_boxes" ON storage_boxes FOR ALL USING (true);`}</pre>
                </div>

                <p className="text-sm text-gray-600">
                  Click "Run" to execute the script and create your database tables.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Step 2</Badge>
                  Configure Environment Variables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>In your Supabase project, go to Settings → API</li>
                  <li>Copy your Project URL and anon public key</li>
                  <li>Add these environment variables to your deployment:</li>
                </ol>

                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                  <pre>{`NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Step 3</Badge>
                  Enable AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Get an OpenAI API key from{" "}
                    <a
                      href="https://platform.openai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      platform.openai.com
                    </a>
                  </li>
                  <li>Add this environment variable:</li>
                </ol>

                <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                  <pre>{`OPENAI_API_KEY=your_openai_api_key_here`}</pre>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
                <h3 className="font-semibold text-green-800">After Setup</h3>
              </div>
              <p className="text-green-700">
                Once configured, your app will automatically sync in real-time across all devices. You and your father
                will see updates instantly when either of you adds or modifies devices!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
