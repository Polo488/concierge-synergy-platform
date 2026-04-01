
CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL DEFAULT 0,
  likes TEXT,
  missing TEXT,
  priority TEXT,
  author_name TEXT,
  author_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback"
  ON public.feedbacks
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read feedback"
  ON public.feedbacks
  FOR SELECT
  TO public
  USING (true);
