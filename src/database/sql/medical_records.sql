-- medical_records.sql: Stores prescriptions and past diagnoses

CREATE TABLE public.medical_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.clinic_staff(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  record_type VARCHAR(50) NOT NULL, -- 'Diagnosis', 'Prescription', 'Test Result'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT, -- Link to Supabase Storage if PDF/Image
  date_issued DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  record_id UUID REFERENCES public.medical_records(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration_days INTEGER,
  refills_remaining INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Patients can view their own records" 
  ON public.medical_records FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can view their own prescriptions" 
  ON public.prescriptions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_records 
      WHERE medical_records.id = prescriptions.record_id 
      AND medical_records.patient_id = auth.uid()
    )
  );

-- Only doctors/admins should be inserting records in production
CREATE POLICY "Doctors can insert records" 
  ON public.medical_records FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clinic_staff 
      WHERE clinic_staff.id = medical_records.doctor_id 
      AND clinic_staff.profile_id = auth.uid()
    )
  );
