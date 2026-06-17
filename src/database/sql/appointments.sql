-- appointments.sql: Manages doctor appointments

CREATE TABLE public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.clinic_staff(id) ON DELETE CASCADE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Completed', 'Cancelled'
  type VARCHAR(50) DEFAULT 'In-person', -- 'In-person', 'Telehealth'
  reason_for_visit TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Patients can view their own appointments" 
  ON public.appointments FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments" 
  ON public.appointments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.clinic_staff 
      WHERE clinic_staff.id = appointments.doctor_id 
      AND clinic_staff.profile_id = auth.uid()
    )
  );

CREATE POLICY "Patients can insert their own appointments" 
  ON public.appointments FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own appointments" 
  ON public.appointments FOR UPDATE 
  USING (auth.uid() = patient_id);
