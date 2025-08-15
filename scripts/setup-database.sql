-- Yetnew Database Setup Script
-- This script creates all necessary tables, indexes, RLS policies, and functions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful with this in production)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_household_id ON profiles(household_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_devices_household_id ON devices(household_id);
CREATE INDEX idx_devices_category ON devices(category);
CREATE INDEX idx_devices_location ON devices(location);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_storage_box ON devices(storage_box);
CREATE INDEX idx_devices_created_by ON devices(created_by);
CREATE INDEX idx_storage_boxes_household_id ON storage_boxes(household_id);
CREATE INDEX idx_storage_boxes_created_by ON storage_boxes(created_by);
CREATE INDEX idx_households_created_by ON households(created_by);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_boxes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
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
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to validate compartment numbers
CREATE OR REPLACE FUNCTION validate_compartment_number()
RETURNS TRIGGER AS $$
BEGIN
  -- If storage_box is set, validate compartment_number
  IF NEW.storage_box IS NOT NULL AND NEW.compartment_number IS NOT NULL THEN
    -- Check if compartment_number is within the range of the storage box
    IF NEW.compartment_number < 1 OR NEW.compartment_number > (
      SELECT compartments FROM storage_boxes WHERE id = NEW.storage_box
    ) THEN
      RAISE EXCEPTION 'Compartment number must be between 1 and the number of compartments in the storage box';
    END IF;
  END IF;
  
  -- If storage_box is null, compartment_number should also be null
  IF NEW.storage_box IS NULL AND NEW.compartment_number IS NOT NULL THEN
    NEW.compartment_number := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for compartment validation
CREATE TRIGGER validate_device_compartment
  BEFORE INSERT OR UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION validate_compartment_number();

-- Insert some sample data for testing (optional)
-- INSERT INTO households (id, name, description, created_by) VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000', 'Sample Household', 'A sample household for testing', '00000000-0000-0000-0000-000000000000');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE households;
ALTER PUBLICATION supabase_realtime ADD TABLE devices;
ALTER PUBLICATION supabase_realtime ADD TABLE storage_boxes;
