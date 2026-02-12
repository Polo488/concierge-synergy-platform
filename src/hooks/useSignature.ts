
import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SignatureTemplate, SignatureZone, SignatureSession, SignatureEvent, SignatureZoneData } from '@/types/signature';
import type { Json } from '@/integrations/supabase/types';

const generateToken = () => Math.random().toString(36).substr(2, 16) + Date.now().toString(36);

function mapTemplate(row: any, zones: SignatureZone[]): SignatureTemplate {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    documentUrl: row.document_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isActive: row.is_active,
    zones: zones.filter(z => z.templateId === row.id),
  };
}

function mapZone(row: any): SignatureZone {
  return {
    id: row.id,
    templateId: row.template_id,
    zoneType: row.zone_type as any,
    label: row.label,
    role: row.role as any,
    pageNumber: row.page_number,
    xPosition: row.x_position,
    yPosition: row.y_position,
    width: row.width,
    height: row.height,
    isRequired: row.is_required,
    fieldKey: row.field_key ?? undefined,
    sortOrder: row.sort_order,
  };
}

function mapSession(row: any): SignatureSession {
  return {
    id: row.id,
    templateId: row.template_id,
    onboardingProcessId: row.onboarding_process_id ?? undefined,
    token: row.token,
    status: row.status as any,
    ownerName: row.owner_name ?? undefined,
    ownerEmail: row.owner_email ?? undefined,
    propertyAddress: row.property_address ?? undefined,
    commissionRate: row.commission_rate != null ? Number(row.commission_rate) : undefined,
    fieldValues: (row.field_values as Record<string, string>) ?? {},
    signedDocumentUrl: row.signed_document_url ?? undefined,
    sentAt: row.sent_at ?? undefined,
    viewedAt: row.viewed_at ?? undefined,
    signedAt: row.signed_at ?? undefined,
    expiresAt: row.expires_at ?? undefined,
    signerIp: row.signer_ip ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEvent(row: any): SignatureEvent {
  return {
    id: row.id,
    sessionId: row.session_id,
    eventType: row.event_type,
    actor: row.actor ?? undefined,
    ipAddress: row.ip_address ?? undefined,
    userAgent: row.user_agent ?? undefined,
    metadata: (row.metadata as Record<string, unknown>) ?? undefined,
    createdAt: row.created_at,
  };
}

function mapZoneData(row: any): SignatureZoneData {
  return {
    id: row.id,
    sessionId: row.session_id,
    zoneId: row.zone_id,
    value: row.value ?? undefined,
    completedAt: row.completed_at ?? undefined,
    signerIp: row.signer_ip ?? undefined,
  };
}

export function useSignature() {
  const [templates, setTemplates] = useState<SignatureTemplate[]>([]);
  const [sessions, setSessions] = useState<SignatureSession[]>([]);
  const [events, setEvents] = useState<SignatureEvent[]>([]);
  const [allZones, setAllZones] = useState<SignatureZone[]>([]);
  const [zoneDataMap, setZoneDataMap] = useState<Record<string, SignatureZoneData[]>>({});
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      const [tRes, zRes, sRes, eRes, zdRes] = await Promise.all([
        supabase.from('signature_templates').select('*').order('created_at', { ascending: false }),
        supabase.from('signature_zones').select('*').order('sort_order'),
        supabase.from('signature_sessions').select('*').order('created_at', { ascending: false }),
        supabase.from('signature_events').select('*').order('created_at', { ascending: false }),
        supabase.from('signature_zone_data').select('*'),
      ]);

      const zones = (zRes.data || []).map(mapZone);
      setAllZones(zones);
      setTemplates((tRes.data || []).map(r => mapTemplate(r, zones)));
      setSessions((sRes.data || []).map(mapSession));
      setEvents((eRes.data || []).map(mapEvent));

      const zdMap: Record<string, SignatureZoneData[]> = {};
      (zdRes.data || []).forEach(r => {
        const d = mapZoneData(r);
        if (!zdMap[d.sessionId]) zdMap[d.sessionId] = [];
        zdMap[d.sessionId].push(d);
      });
      setZoneDataMap(zdMap);
      setLoading(false);
    }
    load();
  }, []);

  // Template CRUD
  const createTemplate = useCallback(async (name: string, description?: string, documentUrl?: string) => {
    const insertData: any = { name, description };
    if (documentUrl) insertData.document_url = documentUrl;
    const { data, error } = await supabase.from('signature_templates').insert(insertData).select().single();
    if (error || !data) return null;
    const tpl = mapTemplate(data, []);
    setTemplates(prev => [tpl, ...prev]);
    return tpl;
  }, []);

  const updateTemplate = useCallback(async (id: string, updates: Partial<SignatureTemplate>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.documentUrl !== undefined) dbUpdates.document_url = updates.documentUrl;
    await supabase.from('signature_templates').update(dbUpdates).eq('id', id);
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    await supabase.from('signature_zones').delete().eq('template_id', id);
    await supabase.from('signature_templates').delete().eq('id', id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  // Zone management
  const addZone = useCallback(async (templateId: string, zone: Omit<SignatureZone, 'id' | 'templateId'>) => {
    const { data, error } = await supabase.from('signature_zones').insert({
      template_id: templateId,
      zone_type: zone.zoneType,
      label: zone.label,
      role: zone.role,
      page_number: zone.pageNumber,
      x_position: zone.xPosition,
      y_position: zone.yPosition,
      width: zone.width,
      height: zone.height,
      is_required: zone.isRequired,
      field_key: zone.fieldKey,
      sort_order: zone.sortOrder,
    }).select().single();
    if (error || !data) return null;
    const newZone = mapZone(data);
    setAllZones(prev => [...prev, newZone]);
    setTemplates(prev => prev.map(t =>
      t.id === templateId ? { ...t, zones: [...t.zones, newZone], updatedAt: new Date().toISOString() } : t
    ));
    return newZone;
  }, []);

  const updateZone = useCallback(async (templateId: string, zoneId: string, updates: Partial<SignatureZone>) => {
    const dbUpdates: any = {};
    if (updates.xPosition !== undefined) dbUpdates.x_position = updates.xPosition;
    if (updates.yPosition !== undefined) dbUpdates.y_position = updates.yPosition;
    if (updates.width !== undefined) dbUpdates.width = updates.width;
    if (updates.height !== undefined) dbUpdates.height = updates.height;
    if (updates.label !== undefined) dbUpdates.label = updates.label;
    if (updates.zoneType !== undefined) dbUpdates.zone_type = updates.zoneType;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.isRequired !== undefined) dbUpdates.is_required = updates.isRequired;
    if (updates.fieldKey !== undefined) dbUpdates.field_key = updates.fieldKey;
    if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;
    await supabase.from('signature_zones').update(dbUpdates).eq('id', zoneId);
    setTemplates(prev => prev.map(t =>
      t.id === templateId ? {
        ...t,
        zones: t.zones.map(z => z.id === zoneId ? { ...z, ...updates } : z),
        updatedAt: new Date().toISOString(),
      } : t
    ));
  }, []);

  const removeZone = useCallback(async (templateId: string, zoneId: string) => {
    await supabase.from('signature_zones').delete().eq('id', zoneId);
    setTemplates(prev => prev.map(t =>
      t.id === templateId ? {
        ...t,
        zones: t.zones.filter(z => z.id !== zoneId),
        updatedAt: new Date().toISOString(),
      } : t
    ));
  }, []);

  // Session management
  const createSession = useCallback(async (
    templateId: string,
    onboardingProcessId: string,
    data: { ownerName: string; ownerEmail: string; propertyAddress: string; commissionRate: number }
  ) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    const fieldValues: Record<string, string> = {};
    template.zones.forEach(z => {
      if (z.fieldKey === 'owner_name') fieldValues[z.id] = data.ownerName;
      if (z.fieldKey === 'property_address') fieldValues[z.id] = data.propertyAddress;
      if (z.fieldKey === 'commission_rate') fieldValues[z.id] = `${data.commissionRate}%`;
    });

    const { data: row, error } = await supabase.from('signature_sessions').insert({
      template_id: templateId,
      onboarding_process_id: onboardingProcessId,
      token: generateToken(),
      status: 'draft',
      owner_name: data.ownerName,
      owner_email: data.ownerEmail,
      property_address: data.propertyAddress,
      commission_rate: data.commissionRate,
      field_values: fieldValues as unknown as Json,
    }).select().single();

    if (error || !row) return null;
    const session = mapSession(row);
    setSessions(prev => [session, ...prev]);

    // Create event
    await supabase.from('signature_events').insert({
      session_id: session.id,
      event_type: 'created',
      actor: 'Noé Conciergerie',
    });

    return session;
  }, [templates]);

  const sendSession = useCallback(async (sessionId: string) => {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 30 * 86400000).toISOString();
    await supabase.from('signature_sessions').update({
      status: 'sent', sent_at: now, expires_at: expires,
    }).eq('id', sessionId);
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, status: 'sent' as const, sentAt: now, expiresAt: expires, updatedAt: now } : s
    ));
    await supabase.from('signature_events').insert({
      session_id: sessionId, event_type: 'sent', actor: 'Noé Conciergerie',
    });
  }, []);

  const viewSession = useCallback(async (sessionId: string) => {
    const now = new Date().toISOString();
    await supabase.from('signature_sessions').update({
      status: 'viewed', viewed_at: now,
    }).eq('id', sessionId);
    setSessions(prev => prev.map(s =>
      s.id === sessionId && s.status === 'sent' ? { ...s, status: 'viewed' as const, viewedAt: now, updatedAt: now } : s
    ));
    await supabase.from('signature_events').insert({
      session_id: sessionId, event_type: 'viewed', actor: 'Propriétaire',
    });
  }, []);

  const completeZone = useCallback(async (sessionId: string, zoneId: string, value: string) => {
    const { data: row } = await supabase.from('signature_zone_data').insert({
      session_id: sessionId,
      zone_id: zoneId,
      value,
      completed_at: new Date().toISOString(),
      signer_ip: '0.0.0.0',
    }).select().single();

    if (row) {
      const zd = mapZoneData(row);
      setZoneDataMap(prev => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] || []), zd],
      }));
    }
    await supabase.from('signature_events').insert({
      session_id: sessionId, event_type: 'field_filled', actor: 'Propriétaire',
      metadata: { zoneId } as unknown as Json,
    });
  }, []);

  const signSession = useCallback(async (sessionId: string) => {
    const now = new Date().toISOString();
    await supabase.from('signature_sessions').update({
      status: 'signed', signed_at: now, signer_ip: '0.0.0.0',
    }).eq('id', sessionId);
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, status: 'signed' as const, signedAt: now, signerIp: '0.0.0.0', updatedAt: now } : s
    ));
    await supabase.from('signature_events').insert({
      session_id: sessionId, event_type: 'signed', actor: 'Propriétaire', ip_address: '0.0.0.0',
    });
  }, []);

  const getSessionByToken = useCallback((token: string) => {
    return sessions.find(s => s.token === token) || null;
  }, [sessions]);

  const getSessionByOnboarding = useCallback((onboardingProcessId: string) => {
    return sessions.find(s => s.onboardingProcessId === onboardingProcessId) || null;
  }, [sessions]);

  const getSessionEvents = useCallback((sessionId: string) => {
    return events.filter(e => e.sessionId === sessionId);
  }, [events]);

  const getSessionZoneData = useCallback((sessionId: string) => {
    return zoneDataMap[sessionId] || [];
  }, [zoneDataMap]);

  // KPIs
  const signatureKPIs = useMemo(() => {
    const signed = sessions.filter(s => s.status === 'signed');
    const sent = sessions.filter(s => s.status !== 'draft');
    const avgDelay = signed.length > 0
      ? signed.reduce((acc, s) => {
          const sentDate = s.sentAt ? new Date(s.sentAt).getTime() : 0;
          const signedDate = s.signedAt ? new Date(s.signedAt).getTime() : 0;
          return acc + (signedDate - sentDate) / 86400000;
        }, 0) / signed.length
      : 0;

    return {
      totalSessions: sessions.length,
      signedCount: signed.length,
      signatureRate: sent.length > 0 ? Math.round((signed.length / sent.length) * 100) : 0,
      avgSignatureDelay: Math.round(avgDelay * 10) / 10,
      pendingCount: sessions.filter(s => s.status === 'sent' || s.status === 'viewed').length,
    };
  }, [sessions]);

  return {
    templates,
    sessions,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    addZone,
    updateZone,
    removeZone,
    createSession,
    sendSession,
    viewSession,
    completeZone,
    signSession,
    getSessionByToken,
    getSessionByOnboarding,
    getSessionEvents,
    getSessionZoneData,
    signatureKPIs,
  };
}
