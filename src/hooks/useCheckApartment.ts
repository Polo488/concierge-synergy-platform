
import { useState, useCallback, useMemo } from 'react';
import {
  PropertyCheck,
  InspectionSections,
  InspectionSectionKey,
  InspectionStatus,
  CheckAction,
  PropertyChangeLog,
  createEmptyInspection,
} from '@/types/checkApartment';
import { toast } from 'sonner';

// Mock properties for selection
const MOCK_PROPERTIES = [
  { id: 'prop-1', name: 'Studio Marais', address: '15 Rue des Rosiers, 75004 Paris' },
  { id: 'prop-2', name: 'T2 Bastille', address: '8 Rue de la Roquette, 75011 Paris' },
  { id: 'prop-3', name: 'T3 Montmartre', address: '22 Rue Lepic, 75018 Paris' },
  { id: 'prop-4', name: 'Loft Oberkampf', address: '45 Rue Oberkampf, 75011 Paris' },
  { id: 'prop-5', name: 'T2 Saint-Germain', address: '10 Rue de Seine, 75006 Paris' },
];

// Mock historical checks
const MOCK_CHECKS: PropertyCheck[] = [
  {
    id: 'chk-1',
    propertyId: 'prop-1',
    propertyName: 'Studio Marais',
    propertyAddress: '15 Rue des Rosiers, 75004 Paris',
    inspectorId: '1',
    inspectorName: 'Admin User',
    performedAt: '2026-02-28T10:30:00',
    completedAt: '2026-02-28T11:15:00',
    status: 'completed',
    sections: createEmptyInspection(),
    healthScore: 85,
    issuesDetected: 2,
    actionsCreated: 1,
    timeSpentMinutes: 45,
    nextRecommendedDate: '2026-03-28',
    createdActions: [
      {
        id: 'act-1',
        checkId: 'chk-1',
        sectionKey: 'wallsPaintDamage',
        actionType: 'maintenance',
        title: 'Retouche peinture chambre',
        description: 'Éclats de peinture au-dessus de la fenêtre',
        priority: 'medium',
        status: 'pending',
        createdAt: '2026-02-28T11:00:00',
        propertyId: 'prop-1',
        propertyName: 'Studio Marais',
      }
    ],
    propertyChanges: [],
  },
  {
    id: 'chk-2',
    propertyId: 'prop-2',
    propertyName: 'T2 Bastille',
    propertyAddress: '8 Rue de la Roquette, 75011 Paris',
    inspectorId: '2',
    inspectorName: 'Marie Dupont',
    performedAt: '2026-02-25T14:00:00',
    completedAt: '2026-02-25T15:20:00',
    status: 'completed',
    sections: createEmptyInspection(),
    healthScore: 72,
    issuesDetected: 4,
    actionsCreated: 3,
    timeSpentMinutes: 80,
    nextRecommendedDate: '2026-03-25',
    createdActions: [],
    propertyChanges: [],
  },
  {
    id: 'chk-3',
    propertyId: 'prop-3',
    propertyName: 'T3 Montmartre',
    propertyAddress: '22 Rue Lepic, 75018 Paris',
    inspectorId: '1',
    inspectorName: 'Admin User',
    scheduledDate: '2026-03-10',
    performedAt: '',
    status: 'scheduled',
    sections: createEmptyInspection(),
    healthScore: 0,
    issuesDetected: 0,
    actionsCreated: 0,
    createdActions: [],
    propertyChanges: [],
  },
];

export function useCheckApartment() {
  const [checks, setChecks] = useState<PropertyCheck[]>(MOCK_CHECKS);
  const [activeCheck, setActiveCheck] = useState<PropertyCheck | null>(null);

  const properties = MOCK_PROPERTIES;

  const createCheck = useCallback((propertyId: string, inspectorName: string, scheduledDate?: string) => {
    const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
    if (!property) return;

    const newCheck: PropertyCheck = {
      id: `chk-${Date.now()}`,
      propertyId: property.id,
      propertyName: property.name,
      propertyAddress: property.address,
      inspectorId: '1',
      inspectorName,
      scheduledDate,
      performedAt: scheduledDate ? '' : new Date().toISOString(),
      status: scheduledDate ? 'scheduled' : 'in_progress',
      sections: createEmptyInspection(),
      healthScore: 0,
      issuesDetected: 0,
      actionsCreated: 0,
      createdActions: [],
      propertyChanges: [],
    };

    setChecks(prev => [newCheck, ...prev]);
    if (!scheduledDate) {
      setActiveCheck(newCheck);
    }
    toast.success('Inspection créée', {
      description: `${property.name} - ${scheduledDate ? 'Planifiée' : 'En cours'}`,
    });
    return newCheck;
  }, []);

  const updateSection = useCallback((
    checkId: string,
    sectionKey: InspectionSectionKey,
    data: Partial<{ status: InspectionStatus; notes: string; photos: string[]; videos: string[] }>
  ) => {
    setChecks(prev => prev.map(check => {
      if (check.id !== checkId) return check;
      const updatedSections = {
        ...check.sections,
        [sectionKey]: { ...check.sections[sectionKey], ...data },
      };
      return { ...check, sections: updatedSections };
    }));
    if (activeCheck?.id === checkId) {
      setActiveCheck(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: { ...prev.sections, [sectionKey]: { ...prev.sections[sectionKey], ...data } },
        };
      });
    }
  }, [activeCheck]);

  const calculateHealthScore = useCallback((sections: InspectionSections): number => {
    const keys = Object.keys(sections) as InspectionSectionKey[];
    let score = 0;
    keys.forEach(key => {
      const s = sections[key];
      if (s.status === 'good') score += 10;
      else if (s.status === 'needs_attention') score += 5;
      // urgent = 0
    });
    return score;
  }, []);

  const completeCheck = useCallback((checkId: string) => {
    setChecks(prev => prev.map(check => {
      if (check.id !== checkId) return check;
      const healthScore = calculateHealthScore(check.sections);
      const issuesDetected = Object.values(check.sections).filter(
        s => s.status !== 'good'
      ).length;
      return {
        ...check,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        healthScore,
        issuesDetected,
        timeSpentMinutes: check.performedAt
          ? Math.round((Date.now() - new Date(check.performedAt).getTime()) / 60000)
          : 0,
        nextRecommendedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    }));
    setActiveCheck(null);
    toast.success('Inspection terminée');
  }, [calculateHealthScore]);

  const createActionFromSection = useCallback((
    checkId: string,
    sectionKey: InspectionSectionKey,
    actionType: CheckAction['actionType'],
    title: string,
    priority: CheckAction['priority']
  ) => {
    const check = checks.find(c => c.id === checkId);
    if (!check) return;

    const newAction: CheckAction = {
      id: `act-${Date.now()}`,
      checkId,
      sectionKey,
      actionType,
      title,
      description: check.sections[sectionKey].notes,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      propertyId: check.propertyId,
      propertyName: check.propertyName,
    };

    setChecks(prev => prev.map(c => {
      if (c.id !== checkId) return c;
      return {
        ...c,
        createdActions: [...c.createdActions, newAction],
        actionsCreated: c.actionsCreated + 1,
      };
    }));

    toast.success('Action créée', {
      description: `${title} - ${check.propertyName}`,
    });
  }, [checks]);

  const getChecksByProperty = useCallback((propertyId: string) => {
    return checks.filter(c => c.propertyId === propertyId);
  }, [checks]);

  const stats = useMemo(() => {
    const completed = checks.filter(c => c.status === 'completed');
    const avgScore = completed.length > 0
      ? Math.round(completed.reduce((sum, c) => sum + c.healthScore, 0) / completed.length)
      : 0;
    const totalIssues = completed.reduce((sum, c) => sum + c.issuesDetected, 0);
    const totalActions = completed.reduce((sum, c) => sum + c.actionsCreated, 0);
    const scheduled = checks.filter(c => c.status === 'scheduled').length;

    return { avgScore, totalIssues, totalActions, completedCount: completed.length, scheduled };
  }, [checks]);

  return {
    checks,
    activeCheck,
    setActiveCheck,
    properties,
    createCheck,
    updateSection,
    completeCheck,
    createActionFromSection,
    getChecksByProperty,
    stats,
  };
}
