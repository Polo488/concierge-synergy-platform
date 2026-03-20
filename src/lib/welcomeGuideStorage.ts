import { WelcomeGuideTemplate } from '@/types/welcomeGuide';
import { supabase } from '@/integrations/supabase/client';

// Convert DB row to app type
const rowToTemplate = (row: any): WelcomeGuideTemplate => ({
  id: row.id,
  name: row.name,
  propertyId: row.property_id || undefined,
  propertyName: row.property_name || undefined,
  groupId: row.group_id || undefined,
  steps: (row.steps || []) as WelcomeGuideTemplate['steps'],
  upsells: (row.upsells || []) as WelcomeGuideTemplate['upsells'],
  welcomeMessage: row.welcome_message || '',
  wifiName: row.wifi_name || undefined,
  wifiPassword: row.wifi_password || undefined,
  houseRules: row.house_rules || undefined,
  landingConfig: row.landing_config || undefined,
  isActive: row.is_active,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export const getWelcomeGuideTemplateById = async (id: string): Promise<WelcomeGuideTemplate | null> => {
  const { data, error } = await supabase
    .from('welcome_guide_templates')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToTemplate(data);
};
