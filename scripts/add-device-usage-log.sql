-- Add device usage tracking to existing database
-- Run this script to add device usage log functionality

-- Add new columns to devices table
ALTER TABLE devices 
ADD COLUMN IF NOT EXISTS current_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS current_location TEXT DEFAULT 'home';

-- Create device_usage_log table for tracking device usage history
CREATE TABLE IF NOT EXISTS device_usage_log (  
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('taken', 'returned', 'moved')),
  location TEXT NOT NULL,
  notes TEXT,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  returned_at TIMESTAMP WITH TIME ZONE,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_devices_current_user_id ON devices(current_user_id);
CREATE INDEX IF NOT EXISTS idx_device_usage_log_device_id ON device_usage_log(device_id);
CREATE INDEX IF NOT EXISTS idx_device_usage_log_user_id ON device_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_device_usage_log_household_id ON device_usage_log(household_id);
CREATE INDEX IF NOT EXISTS idx_device_usage_log_taken_at ON device_usage_log(taken_at);

-- Enable Row Level Security (RLS) for device_usage_log
ALTER TABLE device_usage_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for device_usage_log
DROP POLICY IF EXISTS "Users can view household device usage logs" ON device_usage_log;
DROP POLICY IF EXISTS "Users can create device usage logs in their household" ON device_usage_log;
DROP POLICY IF EXISTS "Users can update household device usage logs" ON device_usage_log;

CREATE POLICY "Users can view household device usage logs" ON device_usage_log FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can create device usage logs in their household" ON device_usage_log FOR INSERT WITH CHECK (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can update household device usage logs" ON device_usage_log FOR UPDATE USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);
