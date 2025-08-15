-- Fix RLS Policies for Yetnew App
-- Run this in your Supabase SQL Editor to fix household creation and profile updates

-- 1. Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view household members" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own household" ON public.households;
DROP POLICY IF EXISTS "Users can create households" ON public.households;
DROP POLICY IF EXISTS "Household admins can update household" ON public.households;

-- 2. Create proper profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Create proper households policies
CREATE POLICY "Users can view own household" ON public.households
  FOR SELECT USING (
    id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create households" ON public.households
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own household" ON public.households
  FOR UPDATE USING (
    id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- 4. Create proper devices policies
CREATE POLICY "Users can view household devices" ON public.devices
  FOR SELECT USING (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create devices in their household" ON public.devices
  FOR INSERT WITH CHECK (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Users can update household devices" ON public.devices
  FOR UPDATE USING (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete household devices" ON public.devices
  FOR DELETE USING (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- 5. Create proper storage_boxes policies
CREATE POLICY "Users can view household storage boxes" ON public.storage_boxes
  FOR SELECT USING (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create storage boxes in their household" ON public.storage_boxes
  FOR INSERT WITH CHECK (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    ) AND created_by = auth.uid()
  );

CREATE POLICY "Users can update household storage boxes" ON public.storage_boxes
  FOR UPDATE USING (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete household storage boxes" ON public.storage_boxes
  FOR DELETE USING (
    household_id IN (
      SELECT household_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 7. Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE households;
ALTER PUBLICATION supabase_realtime ADD TABLE devices;
ALTER PUBLICATION supabase_realtime ADD TABLE storage_boxes;
