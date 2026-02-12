
CREATE POLICY "Anyone can upload signature documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'signature-documents');

CREATE POLICY "Anyone can read signature documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'signature-documents');
