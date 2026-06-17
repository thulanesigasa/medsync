-- clinics.sql: Stores clinic branch information and operational hours

CREATE TABLE public.clinics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone_number VARCHAR(20),
  email VARCHAR(255),
  hours_of_operation TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors / Staff mapped to clinics
CREATE TABLE public.clinic_staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  title VARCHAR(100), -- 'Cardiologist', 'General Practitioner', etc.
  rating DECIMAL(3,2) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, clinic_id)
);

-- Enable RLS
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_staff ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Clinics are viewable by everyone." ON public.clinics FOR SELECT USING (true);
CREATE POLICY "Clinic staff viewable by everyone." ON public.clinic_staff FOR SELECT USING (true);
-- Write policies restricted to admins (mocked as role checking in real app)
