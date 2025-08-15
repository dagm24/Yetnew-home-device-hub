-- Drop existing tables if they exist (be careful with this in production)
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS storage_boxes CASCADE;

-- Create storage_boxes table first (since devices references it)
CREATE TABLE storage_boxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  compartments INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devices table
CREATE TABLE devices (
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

-- Create indexes for better performance
CREATE INDEX idx_devices_category ON devices(category);
CREATE INDEX idx_devices_location ON devices(location);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_storage_box ON devices(storage_box);
CREATE INDEX idx_storage_boxes_location ON storage_boxes(location);

-- Enable Row Level Security (RLS)
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_boxes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on devices" ON devices FOR ALL USING (true);
CREATE POLICY "Allow all operations on storage_boxes" ON storage_boxes FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storage_boxes_updated_at BEFORE UPDATE ON storage_boxes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO storage_boxes (name, location, compartments) VALUES
('Pinsa Electrics Box 1', 'Garage Shelf', 12),
('Tools Box', 'Workshop', 8);

-- Get the IDs of the inserted boxes for sample devices
INSERT INTO devices (name, category, location, status, notes, last_maintenance, storage_box, compartment_number) 
SELECT 
  'Power Drill',
  'Power Tools',
  'Garage',
  'working',
  'Black & Decker, 18V',
  '2023-10-15',
  sb.id,
  3
FROM storage_boxes sb WHERE sb.name = 'Tools Box';

INSERT INTO devices (name, category, location, status, notes, last_maintenance, storage_box, compartment_number) 
SELECT 
  'Soldering Iron',
  'Electronics',
  'Workshop',
  'working',
  'Weller, 40W',
  '2023-09-20',
  sb.id,
  5
FROM storage_boxes sb WHERE sb.name = 'Pinsa Electrics Box 1';

INSERT INTO devices (name, category, location, status, notes) VALUES
('Electric Kettle', 'Kitchen Appliances', 'Kitchen', 'needs-repair', 'Heating element seems weak'),
('Circular Saw', 'Power Tools', 'Garage', 'working', 'Makita, 7-1/4 inch');
