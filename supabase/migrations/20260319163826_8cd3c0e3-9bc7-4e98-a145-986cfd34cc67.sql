
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
CREATE POLICY "Anyone can upload welcome guide images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'welcome-guide-images');

DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
CREATE POLICY "Anyone can delete welcome guide images" ON storage.objects
FOR DELETE USING (bucket_id = 'welcome-guide-images');
