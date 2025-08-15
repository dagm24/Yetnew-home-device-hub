-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful with this in production)
DROP TABLE IF EXISTS device_usage_log CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS storage_boxes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS households CASCADE;

-- Create households table
CREATE TABLE households (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage_boxes table
CREATE TABLE storage_boxes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  compartments INTEGER NOT NULL DEFAULT 12,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devices table
CREATE TABLE devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT CHECK (status IN ('working', 'needs-repair', 'broken')) DEFAULT 'working',
  notes TEXT,
  last_maintenance DATE,
  storage_box UUID REFERENCES storage_boxes(id) ON DELETE SET NULL,
  compartment_number INTEGER,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  current_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  current_location TEXT DEFAULT 'home',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create device_usage_log table for tracking device usage history
CREATE TABLE device_usage_log (
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
CREATE INDEX idx_profiles_household_id ON profiles(household_id);
CREATE INDEX idx_devices_household_id ON devices(household_id);
CREATE INDEX idx_devices_category ON devices(category);
CREATE INDEX idx_devices_location ON devices(location);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_storage_box ON devices(storage_box);
CREATE INDEX idx_devices_current_user_id ON devices(current_user_id);
CREATE INDEX idx_storage_boxes_household_id ON storage_boxes(household_id);
CREATE INDEX idx_households_created_by ON households(created_by);
CREATE INDEX idx_device_usage_log_device_id ON device_usage_log(device_id);
CREATE INDEX idx_device_usage_log_user_id ON device_usage_log(user_id);
CREATE INDEX idx_device_usage_log_household_id ON device_usage_log(household_id);
CREATE INDEX idx_device_usage_log_taken_at ON device_usage_log(taken_at);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_usage_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view household members" ON profiles FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);

-- Create RLS policies for households
CREATE POLICY "Users can view own household" ON households FOR SELECT USING (
  id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can create households" ON households FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Household admins can update household" ON households FOR UPDATE USING (
  id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create RLS policies for devices
CREATE POLICY "Users can view household devices" ON devices FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can create devices in their household" ON devices FOR INSERT WITH CHECK (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  ) AND created_by = auth.uid()
);
CREATE POLICY "Users can update household devices" ON devices FOR UPDATE USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete household devices" ON devices FOR DELETE USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);

-- Create RLS policies for storage_boxes
CREATE POLICY "Users can view household storage boxes" ON storage_boxes FOR SELECT USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can create storage boxes in their household" ON storage_boxes FOR INSERT WITH CHECK (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  ) AND created_by = auth.uid()
);
CREATE POLICY "Users can update household storage boxes" ON storage_boxes FOR UPDATE USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);
CREATE POLICY "Users can delete household storage boxes" ON storage_boxes FOR DELETE USING (
  household_id IN (
    SELECT household_id FROM profiles WHERE id = auth.uid()
  )
);

-- Create RLS policies for device_usage_log
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_households_updated_at BEFORE UPDATE ON households
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storage_boxes_updated_at BEFORE UPDATE ON storage_boxes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
