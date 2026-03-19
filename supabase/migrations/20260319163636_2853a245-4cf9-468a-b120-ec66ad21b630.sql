
INSERT INTO storage.buckets (id, name, public)
VALUES ('welcome-guide-images', 'welcome-guide-images', true);

CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'welcome-guide-images');

CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'welcome-guide-images');

CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'welcome-guide-images');
