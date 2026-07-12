-- production_rls.sql
-- This script completely overrides existing Row Level Security (RLS) policies 
-- with strict, production-ready, role-based policies.
-- WARNING: This will drop your existing policies. Only run when ready for production!

-- =================================================================================
-- 0. Helper Functions (Optional but useful for cleaner policies)
-- =================================================================================
-- Function to get the current user's role securely
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS VARCHAR
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- =================================================================================
-- 1. CLEANUP (Drop all existing policies to avoid conflicts)
-- =================================================================================
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view clinics" ON public.clinics;
DROP POLICY IF EXISTS "Admins can update clinics" ON public.clinics;

DROP POLICY IF EXISTS "Patients can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can insert their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can update their own appointments" ON public.appointments;

DROP POLICY IF EXISTS "Patients can view their own records" ON public.medical_records;
DROP POLICY IF EXISTS "Patients can view their own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Doctors can insert records" ON public.medical_records;

DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =================================================================================
-- 2. NEW POLICIES: PROFILES
-- =================================================================================
-- Everyone can view basic profiles (so patients can see doctor names, etc)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Patients can only update themselves. HR/Admins can update others (via RPC ideally, but allowed here).
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "HR can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.get_auth_role() = 'hr');

-- =================================================================================
-- 3. NEW POLICIES: CLINICS
-- =================================================================================
-- Everyone reads clinics
CREATE POLICY "Anyone can view clinics"
  ON public.clinics FOR SELECT
  USING (true);

-- Only HR/Admin can update clinics
CREATE POLICY "HR and Admins can update clinics"
  ON public.clinics FOR UPDATE
  USING (public.get_auth_role() IN ('admin', 'hr'));

-- =================================================================================
-- 4. NEW POLICIES: APPOINTMENTS
-- =================================================================================
-- Patients see own. Staff (admin, hr, receptionist) see all.
CREATE POLICY "Appointments read access"
  ON public.appointments FOR SELECT
  USING (
    auth.uid() = patient_id 
    OR public.get_auth_role() IN ('admin', 'hr', 'receptionist')
  );

-- Patients create own. Staff create all.
CREATE POLICY "Appointments insert access"
  ON public.appointments FOR INSERT
  WITH CHECK (
    auth.uid() = patient_id 
    OR public.get_auth_role() IN ('admin', 'hr', 'receptionist')
  );

-- Patients update own. Staff update all.
CREATE POLICY "Appointments update access"
  ON public.appointments FOR UPDATE
  USING (
    auth.uid() = patient_id 
    OR public.get_auth_role() IN ('admin', 'hr', 'receptionist')
  );

-- =================================================================================
-- 5. NEW POLICIES: MEDICAL RECORDS & PRESCRIPTIONS
-- =================================================================================
CREATE POLICY "Medical records read access"
  ON public.medical_records FOR SELECT
  USING (
    auth.uid() = patient_id 
    OR public.get_auth_role() IN ('admin', 'hr', 'receptionist')
  );

CREATE POLICY "Medical records insert/update access (Staff Only)"
  ON public.medical_records FOR ALL
  USING (public.get_auth_role() IN ('admin', 'hr', 'receptionist'));

-- Prescriptions inherit from medical_records
CREATE POLICY "Prescriptions read access"
  ON public.prescriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_records 
      WHERE medical_records.id = prescriptions.record_id 
      AND (medical_records.patient_id = auth.uid() OR public.get_auth_role() IN ('admin', 'hr', 'receptionist'))
    )
  );

CREATE POLICY "Prescriptions insert/update access (Staff Only)"
  ON public.prescriptions FOR ALL
  USING (public.get_auth_role() IN ('admin', 'hr', 'receptionist'));

-- =================================================================================
-- 6. NEW POLICIES: MESSAGES
-- =================================================================================
CREATE POLICY "Messages read access"
  ON public.messages FOR SELECT
  USING (
    auth.uid() IN (sender_id, receiver_id)
    OR public.get_auth_role() IN ('admin', 'hr', 'receptionist')
  );

CREATE POLICY "Messages insert access"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
  );

-- Complete.
