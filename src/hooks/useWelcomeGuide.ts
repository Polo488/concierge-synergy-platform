import { useState, useCallback, useEffect } from 'react';
import { WelcomeGuideTemplate, WelcomeGuideSession, WelcomeGuideAnalytics } from '@/types/welcomeGuide';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Convert app type to DB row for upsert
const templateToRow = (t: WelcomeGuideTemplate) => ({
  id: t.id,
  name: t.name,
  property_id: t.propertyId || null,
  property_name: t.propertyName || null,
  group_id: t.groupId || null,
  steps: JSON.parse(JSON.stringify(t.steps)),
  upsells: JSON.parse(JSON.stringify(t.upsells)),
  welcome_message: t.welcomeMessage,
  wifi_name: t.wifiName || null,
  wifi_password: t.wifiPassword || null,
  house_rules: t.houseRules || [],
  landing_config: t.landingConfig ? JSON.parse(JSON.stringify(t.landingConfig)) : null,
  is_active: t.isActive,
});

const MOCK_SESSIONS: WelcomeGuideSession[] = [
  {
    id: 'sess-1', templateId: 'tpl-1', reservationId: 'res-101', guestName: 'Jean Dupont', propertyName: 'Apt Bellecour – T2 Premium', token: 'abc123', checkIn: new Date('2024-06-15'), checkOut: new Date('2024-06-18'),
    completedSteps: ['s1', 's2', 's3', 's4', 's5'], stepTimestamps: {}, upsellsViewed: ['u1', 'u2'], upsellsAccepted: ['u1'], completedAt: new Date('2024-06-15T16:30:00'), createdAt: new Date('2024-06-14'),
  },
  {
    id: 'sess-2', templateId: 'tpl-1', reservationId: 'res-102', guestName: 'Emma Wilson', propertyName: 'Apt Bellecour – T2 Premium', token: 'def456', checkIn: new Date('2024-06-20'), checkOut: new Date('2024-06-23'),
    completedSteps: ['s1', 's2'], stepTimestamps: {}, upsellsViewed: [], upsellsAccepted: [], createdAt: new Date('2024-06-19'),
  },
  {
    id: 'sess-3', templateId: 'tpl-2', reservationId: 'res-103', guestName: 'Marco Rossi', propertyName: 'Studio Marais – Charme', token: 'ghi789', checkIn: new Date('2024-06-22'), checkOut: new Date('2024-06-25'),
    completedSteps: ['s1b', 's2b', 's3b', 's4b', 's5b'], stepTimestamps: {}, upsellsViewed: ['u4', 'u5'], upsellsAccepted: ['u4', 'u5'], completedAt: new Date('2024-06-22T15:00:00'), createdAt: new Date('2024-06-21'),
  },
];

export function useWelcomeGuide() {
  const [templates, setTemplates] = useState<WelcomeGuideTemplate[]>([]);
  const [sessions] = useState<WelcomeGuideSession[]>(MOCK_SESSIONS);
  const [selectedTemplate, setSelectedTemplate] = useState<WelcomeGuideTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Load templates from DB
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('welcome_guide_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading templates:', error);
        toast.error('Erreur de chargement des templates');
      } else {
        setTemplates((data || []).map(rowToTemplate));
      }
      setLoading(false);
    };
    fetchTemplates();
  }, []);

  const analytics: WelcomeGuideAnalytics = {
    totalSessions: sessions.length,
    completionRate: Math.round((sessions.filter(s => s.completedAt).length / sessions.length) * 100),
    averageCompletionTime: 12,
    upsellConversionRate: 45,
    upsellRevenue: 83,
    stepDropoffRates: { 'building_arrival': 5, 'key_access': 12, 'apartment_access': 8, 'welcome': 2, 'upsell': 15 },
  };

  const toggleTemplate = useCallback(async (id: string) => {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    const newActive = !tpl.isActive;
    
    const { error } = await supabase
      .from('welcome_guide_templates')
      .update({ is_active: newActive } as any)
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: newActive } : t));
    }
  }, [templates]);

  const updateTemplate = useCallback(async (updated: WelcomeGuideTemplate) => {
    const row = templateToRow(updated);

    const { error } = await supabase
      .from('welcome_guide_templates')
      .upsert(row as any);

    if (error) {
      console.error('Error saving template:', error);
      toast.error('Erreur lors de la sauvegarde');
    } else {
      setTemplates(prev => {
        const exists = prev.some(t => t.id === updated.id);
        if (exists) {
          return prev.map(t => t.id === updated.id ? { ...updated, updatedAt: new Date() } : t);
        }
        return [{ ...updated, updatedAt: new Date() }, ...prev];
      });
      toast.success('Template sauvegardé');
    }
  }, []);

  return { templates, sessions, analytics, selectedTemplate, setSelectedTemplate, toggleTemplate, updateTemplate, loading };
}
