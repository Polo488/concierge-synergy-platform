-- ============================================
-- PROVIDERS (prestataires ménage / maintenance)
-- ============================================
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'demo',
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CLEANING', 'MAINTENANCE', 'OTHER')),
  email TEXT,
  phone TEXT,
  iban TEXT,
  vat_number TEXT,
  default_pricing_mode TEXT NOT NULL DEFAULT 'PER_MISSION' CHECK (default_pricing_mode IN ('PER_MISSION', 'FORFAIT')),
  default_rate NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert providers" ON public.providers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update providers" ON public.providers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete providers" ON public.providers FOR DELETE USING (true);

CREATE TRIGGER trg_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PROVIDER MISSIONS
-- ============================================
CREATE TABLE public.provider_missions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'demo',
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  rental_id TEXT NOT NULL,
  rental_name TEXT,
  mission_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CLEANING', 'MAINTENANCE', 'OTHER')),
  description TEXT,
  pricing_mode TEXT NOT NULL DEFAULT 'PER_MISSION' CHECK (pricing_mode IN ('PER_MISSION', 'FORFAIT')),
  agreed_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'done', 'billed', 'paid')),
  linked_reservation_id TEXT,
  invoice_call_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view missions" ON public.provider_missions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert missions" ON public.provider_missions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update missions" ON public.provider_missions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete missions" ON public.provider_missions FOR DELETE USING (true);

CREATE INDEX idx_missions_provider ON public.provider_missions(provider_id);
CREATE INDEX idx_missions_date ON public.provider_missions(mission_date);

CREATE TRIGGER trg_missions_updated_at
  BEFORE UPDATE ON public.provider_missions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PROVIDER INVOICE CALLS (appels à facturation)
-- ============================================
CREATE TABLE public.provider_invoice_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'demo',
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent_to_provider', 'provider_validated', 'invoice_received', 'paid')),
  access_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  sent_at TIMESTAMPTZ,
  validated_at TIMESTAMPTZ,
  invoice_received_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  provider_invoice_number TEXT,
  provider_invoice_pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_invoice_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invoice calls" ON public.provider_invoice_calls FOR SELECT USING (true);
CREATE POLICY "Anyone can insert invoice calls" ON public.provider_invoice_calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update invoice calls" ON public.provider_invoice_calls FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete invoice calls" ON public.provider_invoice_calls FOR DELETE USING (true);

CREATE INDEX idx_calls_provider ON public.provider_invoice_calls(provider_id);
CREATE INDEX idx_calls_token ON public.provider_invoice_calls(access_token);

CREATE TRIGGER trg_calls_updated_at
  BEFORE UPDATE ON public.provider_invoice_calls
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- AUDIT LOG (immuable)
-- ============================================
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'demo',
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  previous_state JSONB,
  new_state JSONB,
  actor TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view audit log" ON public.audit_log FOR SELECT USING (true);
CREATE POLICY "Anyone can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (true);
-- pas de UPDATE/DELETE : journal immuable

CREATE INDEX idx_audit_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON public.audit_log(created_at DESC);