
-- Storage bucket for signature PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('signature-documents', 'signature-documents', true);

-- Storage policies
CREATE POLICY "Anyone can view signature documents" ON storage.objects FOR SELECT USING (bucket_id = 'signature-documents');
CREATE POLICY "Authenticated users can upload signature documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'signature-documents' AND auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update signature documents" ON storage.objects FOR UPDATE USING (bucket_id = 'signature-documents' AND auth.uid() IS NOT NULL);

-- Templates de documents de signature
CREATE TABLE public.signature_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  document_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);
ALTER TABLE public.signature_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view templates" ON public.signature_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage templates" ON public.signature_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Zones interactives sur les templates
CREATE TABLE public.signature_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.signature_templates(id) ON DELETE CASCADE,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('signature', 'initials', 'date', 'text')),
  label TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'conciergerie')),
  page_number INTEGER NOT NULL DEFAULT 1,
  x_position DOUBLE PRECISION NOT NULL DEFAULT 0,
  y_position DOUBLE PRECISION NOT NULL DEFAULT 0,
  width DOUBLE PRECISION NOT NULL DEFAULT 200,
  height DOUBLE PRECISION NOT NULL DEFAULT 50,
  is_required BOOLEAN NOT NULL DEFAULT true,
  field_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.signature_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view zones" ON public.signature_zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage zones" ON public.signature_zones FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Sessions de signature (une par document à signer)
CREATE TABLE public.signature_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.signature_templates(id),
  onboarding_process_id TEXT,
  token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'expired')),
  owner_name TEXT,
  owner_email TEXT,
  property_address TEXT,
  commission_rate NUMERIC,
  field_values JSONB NOT NULL DEFAULT '{}',
  signed_document_url TEXT,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  signer_ip TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.signature_sessions ENABLE ROW LEVEL SECURITY;
-- Authenticated users can manage sessions
CREATE POLICY "Authenticated users can view sessions" ON public.signature_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage sessions" ON public.signature_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Anonymous access for signing (via token)
CREATE POLICY "Public can view sessions by token" ON public.signature_sessions FOR SELECT TO anon USING (true);
CREATE POLICY "Public can update sessions for signing" ON public.signature_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Journal d'événements (audit trail)
CREATE TABLE public.signature_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.signature_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.signature_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view events" ON public.signature_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert events" ON public.signature_events FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Données des zones remplies par le signataire
CREATE TABLE public.signature_zone_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.signature_sessions(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES public.signature_zones(id),
  value TEXT,
  completed_at TIMESTAMPTZ,
  signer_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.signature_zone_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view zone data" ON public.signature_zone_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can manage zone data for signing" ON public.signature_zone_data FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_signature_templates_updated_at BEFORE UPDATE ON public.signature_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_signature_sessions_updated_at BEFORE UPDATE ON public.signature_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
