import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'welcome-guide-images';

export async function uploadWelcomeGuideImage(file: File, stepId: string): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${stepId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
