
import { useState, useCallback, useMemo } from 'react';
import { SignatureTemplate, SignatureZone, SignatureSession, SignatureEvent, SignatureZoneData } from '@/types/signature';

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateToken = () => Math.random().toString(36).substr(2, 16) + Date.now().toString(36);

// Mock templates
const mockTemplates: SignatureTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Mandat de gestion standard',
    description: 'Template par défaut pour les mandats de gestion locative courte durée.',
    documentUrl: undefined,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    isActive: true,
    zones: [
      { id: 'z1', templateId: 'tpl-1', zoneType: 'text', label: 'Nom du propriétaire', role: 'owner', pageNumber: 1, xPosition: 50, yPosition: 180, width: 250, height: 30, isRequired: true, fieldKey: 'owner_name', sortOrder: 1 },
      { id: 'z2', templateId: 'tpl-1', zoneType: 'text', label: 'Adresse du bien', role: 'owner', pageNumber: 1, xPosition: 50, yPosition: 220, width: 350, height: 30, isRequired: true, fieldKey: 'property_address', sortOrder: 2 },
      { id: 'z3', templateId: 'tpl-1', zoneType: 'text', label: 'Taux de commission', role: 'conciergerie', pageNumber: 1, xPosition: 50, yPosition: 380, width: 100, height: 30, isRequired: true, fieldKey: 'commission_rate', sortOrder: 3 },
      { id: 'z4', templateId: 'tpl-1', zoneType: 'date', label: 'Date de signature', role: 'owner', pageNumber: 1, xPosition: 50, yPosition: 550, width: 150, height: 30, isRequired: true, sortOrder: 4 },
      { id: 'z5', templateId: 'tpl-1', zoneType: 'signature', label: 'Signature propriétaire', role: 'owner', pageNumber: 1, xPosition: 50, yPosition: 600, width: 250, height: 80, isRequired: true, sortOrder: 5 },
      { id: 'z6', templateId: 'tpl-1', zoneType: 'signature', label: 'Signature conciergerie', role: 'conciergerie', pageNumber: 1, xPosition: 350, yPosition: 600, width: 250, height: 80, isRequired: true, sortOrder: 6 },
      { id: 'z7', templateId: 'tpl-1', zoneType: 'initials', label: 'Initiales propriétaire', role: 'owner', pageNumber: 1, xPosition: 550, yPosition: 750, width: 60, height: 40, isRequired: true, sortOrder: 7 },
    ],
  },
];

const mockSessions: SignatureSession[] = [];
const mockEvents: SignatureEvent[] = [];

export function useSignature() {
  const [templates, setTemplates] = useState<SignatureTemplate[]>(mockTemplates);
  const [sessions, setSessions] = useState<SignatureSession[]>(mockSessions);
  const [events, setEvents] = useState<SignatureEvent[]>(mockEvents);
  const [zoneDataMap, setZoneDataMap] = useState<Record<string, SignatureZoneData[]>>({});

  // Template CRUD
  const createTemplate = useCallback((name: string, description?: string) => {
    const tpl: SignatureTemplate = {
      id: generateId(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      zones: [],
    };
    setTemplates(prev => [...prev, tpl]);
    return tpl;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<SignatureTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  // Zone management
  const addZone = useCallback((templateId: string, zone: Omit<SignatureZone, 'id' | 'templateId'>) => {
    const newZone: SignatureZone = { ...zone, id: generateId(), templateId };
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, zones: [...t.zones, newZone], updatedAt: new Date().toISOString() } : t
    ));
    return newZone;
  }, []);

  const updateZone = useCallback((templateId: string, zoneId: string, updates: Partial<SignatureZone>) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? {
        ...t,
        zones: t.zones.map(z => z.id === zoneId ? { ...z, ...updates } : z),
        updatedAt: new Date().toISOString(),
      } : t
    ));
  }, []);

  const removeZone = useCallback((templateId: string, zoneId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? {
        ...t,
        zones: t.zones.filter(z => z.id !== zoneId),
        updatedAt: new Date().toISOString(),
      } : t
    ));
  }, []);

  // Session management
  const createSession = useCallback((
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

    const session: SignatureSession = {
      id: generateId(),
      templateId,
      onboardingProcessId,
      token: generateToken(),
      status: 'draft',
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      propertyAddress: data.propertyAddress,
      commissionRate: data.commissionRate,
      fieldValues,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSessions(prev => [...prev, session]);

    const event: SignatureEvent = {
      id: generateId(),
      sessionId: session.id,
      eventType: 'created',
      actor: 'Noé Conciergerie',
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [...prev, event]);

    return session;
  }, [templates]);

  const sendSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, status: 'sent' as const, sentAt: new Date().toISOString(), updatedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() } : s
    ));
    setEvents(prev => [...prev, {
      id: generateId(), sessionId, eventType: 'sent', actor: 'Noé Conciergerie', createdAt: new Date().toISOString(),
    }]);
  }, []);

  const viewSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId && s.status === 'sent' ? { ...s, status: 'viewed' as const, viewedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : s
    ));
    setEvents(prev => [...prev, {
      id: generateId(), sessionId, eventType: 'viewed', actor: 'Propriétaire', createdAt: new Date().toISOString(),
    }]);
  }, []);

  const completeZone = useCallback((sessionId: string, zoneId: string, value: string) => {
    const zd: SignatureZoneData = {
      id: generateId(),
      sessionId,
      zoneId,
      value,
      completedAt: new Date().toISOString(),
      signerIp: '192.168.1.1',
    };
    setZoneDataMap(prev => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] || []), zd],
    }));
    setEvents(prev => [...prev, {
      id: generateId(), sessionId, eventType: 'field_filled', actor: 'Propriétaire',
      metadata: { zoneId }, createdAt: new Date().toISOString(),
    }]);
  }, []);

  const signSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? {
        ...s,
        status: 'signed' as const,
        signedAt: new Date().toISOString(),
        signerIp: '192.168.1.1',
        updatedAt: new Date().toISOString(),
      } : s
    ));
    setEvents(prev => [...prev, {
      id: generateId(), sessionId, eventType: 'signed', actor: 'Propriétaire',
      ipAddress: '192.168.1.1', createdAt: new Date().toISOString(),
    }]);
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
