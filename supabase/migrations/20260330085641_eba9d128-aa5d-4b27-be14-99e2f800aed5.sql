CREATE TABLE public.beta_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  logements TEXT NOT NULL,
  type_gestion TEXT NOT NULL,
  defis JSONB DEFAULT '[]'::jsonb,
  channel_manager TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.beta_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert beta profiles"
  ON public.beta_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read beta profiles"
  ON public.beta_profiles FOR SELECT
  USING (true);