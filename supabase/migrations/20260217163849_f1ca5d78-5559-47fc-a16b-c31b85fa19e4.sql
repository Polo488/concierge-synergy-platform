
-- Ideas table
CREATE TABLE public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'in_development', 'done')),
  author_name TEXT NOT NULL DEFAULT 'Anonyme',
  author_email TEXT,
  votes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Votes table
CREATE TABLE public.idea_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  voter_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, voter_identifier)
);

-- Enable RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;

-- Ideas: everyone can read, authenticated can manage
CREATE POLICY "Anyone can view ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert ideas" ON public.ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update ideas" ON public.ideas FOR UPDATE USING (true);
CREATE POLICY "Authenticated can delete ideas" ON public.ideas FOR DELETE USING (true);

-- Votes: everyone can read/insert
CREATE POLICY "Anyone can view votes" ON public.idea_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON public.idea_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete votes" ON public.idea_votes FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to sync votes count
CREATE OR REPLACE FUNCTION public.sync_idea_votes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.ideas SET votes_count = (SELECT COUNT(*) FROM public.idea_votes WHERE idea_id = NEW.idea_id) WHERE id = NEW.idea_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.ideas SET votes_count = (SELECT COUNT(*) FROM public.idea_votes WHERE idea_id = OLD.idea_id) WHERE id = OLD.idea_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER sync_votes_count
  AFTER INSERT OR DELETE ON public.idea_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_idea_votes_count();
