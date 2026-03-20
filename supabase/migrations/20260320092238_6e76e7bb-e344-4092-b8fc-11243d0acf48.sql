
CREATE TABLE public.welcome_guide_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  property_id TEXT,
  property_name TEXT,
  group_id TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  upsells JSONB NOT NULL DEFAULT '[]'::jsonb,
  welcome_message TEXT NOT NULL DEFAULT '',
  wifi_name TEXT,
  wifi_password TEXT,
  house_rules JSONB DEFAULT '[]'::jsonb,
  landing_config JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.welcome_guide_templates ENABLE ROW LEVEL SECURITY;

-- Public read (guests need to see templates via token/public page)
CREATE POLICY "Anyone can read welcome guide templates"
  ON public.welcome_guide_templates FOR SELECT
  USING (true);

-- Anyone can insert (no auth required for now)
CREATE POLICY "Anyone can insert welcome guide templates"
  ON public.welcome_guide_templates FOR INSERT
  WITH CHECK (true);

-- Anyone can update
CREATE POLICY "Anyone can update welcome guide templates"
  ON public.welcome_guide_templates FOR UPDATE
  USING (true);

-- Anyone can delete
CREATE POLICY "Anyone can delete welcome guide templates"
  ON public.welcome_guide_templates FOR DELETE
  USING (true);

-- Auto-update updated_at
CREATE TRIGGER update_welcome_guide_templates_updated_at
  BEFORE UPDATE ON public.welcome_guide_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
