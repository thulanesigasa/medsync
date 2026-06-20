-- seed.sql: Populate the Supabase database with initial Mock data
-- Run this in your Supabase SQL Editor to populate Clinics, Doctors, and Updates

-- 1. Insert Clinics
INSERT INTO public.clinics (id, name, address, phone_number, email, hours_of_operation, is_active)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Dawn Park Clinic', 'Cason Road Boksburg 1459', '011 862 1007', 'info@dawnparkclinic.co.za', '08:00 - 17:00', true),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Benoni Health Centre', '54 Harpur Avenue Benoni 1501', '011 845 3564', 'contact@benonihealth.co.za', '08:30 - 17:00', true),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Unjani Clinic Germiston', '250 Victoria Street Germiston 1401', '011 776 9151', 'hello@unjaniclinic.co.za', '08:00 - 17:00', true)
ON CONFLICT (id) DO NOTHING;

-- Note: We cannot insert Doctors (clinic_staff) easily without knowing their profile_id from auth.users.
-- You should register the doctors through the MedSync App (or create users in Supabase Auth), 
-- and then link them to clinics in the `clinic_staff` table using their UUIDs.

-- 2. Insert Clinic Updates/Bulletins (Assuming we have a bulletins table, if not, wait)
-- (We didn't see an explicit bulletins table in clinics.sql, but we have clinics)
