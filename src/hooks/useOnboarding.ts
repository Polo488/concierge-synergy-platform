
import { useState, useMemo, useCallback } from 'react';
import { 
  OnboardingProcess, OnboardingStatus, OnboardingKPIs, 
  OnboardingFilters, OnboardingStepStatus, DEFAULT_STEP_TEMPLATES,
  StepActionData, AppointmentActionData, MandateActionData, 
  RibActionData, PreparationActionData, PropertyCreationActionData,
  PublicationActionData, ClosureActionData, LeadActionData
} from '@/types/onboarding';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createMockProcess = (
  name: string, address: string, owner: string, status: OnboardingStatus,
  currentStep: number, completedSteps: number, daysAgo: number, city: string,
  assignee: string
): OnboardingProcess => {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);
  
  const steps = DEFAULT_STEP_TEMPLATES.map((tpl, i) => {
    let stepStatus: OnboardingStepStatus = 'locked';
    if (i < completedSteps) stepStatus = 'completed';
    else if (i === currentStep) stepStatus = status === 'blocked' ? 'blocked' : 'in_progress';
    else if (i === completedSteps) stepStatus = 'todo';
    
    // Generate action data based on step type and status
    let actionData: StepActionData | undefined;
    if (tpl.stepType === 'lead') {
      actionData = { source: 'Recommandation', responsibleName: assignee, responsibleId: generateId(), createdAt: createdAt.toISOString(), contactCompleted: i < completedSteps } as LeadActionData;
    } else if (tpl.stepType === 'appointment' && i < completedSteps) {
      actionData = { date: new Date(createdAt.getTime() + 5 * 86400000).toISOString().split('T')[0], time: '10:00', status: 'completed', agendaEventId: generateId() } as AppointmentActionData;
    } else if (tpl.stepType === 'mandate' && i < completedSteps) {
      actionData = { status: 'signed', signedAt: new Date(createdAt.getTime() + 12 * 86400000).toISOString() } as MandateActionData;
    } else if (tpl.stepType === 'rib' && i < completedSteps) {
      actionData = { iban: 'FR7612345678901234567890123', accountHolder: owner, bic: 'BNPAFRPP', validated: true, validatedAt: new Date().toISOString() } as RibActionData;
    } else if (tpl.stepType === 'preparation' && i < completedSteps) {
      actionData = { cleaningCompleted: true, cleaningDate: '2025-01-15', cleaningAgent: 'Maria Santos', photoCompleted: true, photoDate: '2025-01-18', photoProvider: 'Studio Lumière' } as PreparationActionData;
    } else if (tpl.stepType === 'property_creation' && i < completedSteps) {
      const fields = [
        { field: 'name', label: 'Nom', completed: true }, { field: 'address', label: 'Adresse', completed: true },
        { field: 'type', label: 'Type', completed: true }, { field: 'photos', label: 'Photos', completed: true },
      ];
      actionData = { completionPercent: 100, requiredFields: fields, propertyId: generateId() } as PropertyCreationActionData;
    } else if (tpl.stepType === 'publication' && i < completedSteps) {
      actionData = { platforms: [{ name: 'Airbnb', status: 'published', publishedAt: new Date().toISOString() }, { name: 'Booking', status: 'published', publishedAt: new Date().toISOString() }] } as PublicationActionData;
    } else if (tpl.stepType === 'closure' && i < completedSteps) {
      actionData = { messageSent: true, messageSentAt: new Date().toISOString(), propertyActivated: true, activatedAt: new Date().toISOString() } as ClosureActionData;
    }

    return {
      ...tpl,
      id: generateId(),
      status: stepStatus,
      assigneeIds: [generateId()],
      assigneeNames: [assignee],
      actionData,
      startedAt: i <= currentStep ? new Date(createdAt.getTime() + i * 3 * 86400000).toISOString() : undefined,
      completedAt: i < completedSteps ? new Date(createdAt.getTime() + (i + 1) * 3 * 86400000).toISOString() : undefined,
      actualDays: i < completedSteps ? Math.floor(Math.random() * 5) + 1 : undefined,
      subTasks: tpl.subTasks.map(st => ({
        ...st,
        id: generateId(),
        completed: i < completedSteps,
        assigneeName: assignee,
      })),
    };
  });

  const progress = Math.round((completedSteps / 8) * 100);

  return {
    id: generateId(),
    propertyName: name,
    propertyAddress: address,
    propertyType: 'T2',
    ownerName: owner,
    ownerEmail: `${owner.toLowerCase().replace(' ', '.')}@email.com`,
    ownerPhone: '06 12 34 56 78',
    source: 'Recommandation',
    status,
    assignedToId: generateId(),
    assignedToName: assignee,
    steps,
    auditTrail: [
      { id: generateId(), date: createdAt.toISOString(), userId: '1', userName: assignee, action: 'Onboarding créé' },
    ],
    createdAt: createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    templateId: 'default',
    city,
    group: 'Lyon Centre',
    progress,
    currentStepIndex: currentStep,
    totalDays: daysAgo,
  };
};

const mockProcesses: OnboardingProcess[] = [
  createMockProcess('Apt Bellecour 3P', '12 Place Bellecour, Lyon 2e', 'Marie Dupont', 'in_progress', 3, 3, 18, 'Lyon', 'Sophie Martin'),
  createMockProcess('Studio Part-Dieu', '45 Rue de la Part-Dieu, Lyon 3e', 'Jean Moreau', 'in_progress', 1, 1, 8, 'Lyon', 'Thomas Bernard'),
  createMockProcess('T4 Croix-Rousse', '8 Montée de la Grande Côte, Lyon 1er', 'Pierre Blanc', 'blocked', 2, 2, 25, 'Lyon', 'Sophie Martin'),
  createMockProcess('Loft Confluence', '22 Quai Perrache, Lyon 2e', 'Claire Roux', 'completed', 7, 8, 45, 'Lyon', 'Thomas Bernard'),
  createMockProcess('T2 Vieux Lyon', '5 Rue Saint-Jean, Lyon 5e', 'Antoine Faure', 'completed', 7, 8, 32, 'Lyon', 'Sophie Martin'),
  createMockProcess('Apt Tête d\'Or', '18 Boulevard des Belges, Lyon 6e', 'Isabelle Girard', 'in_progress', 4, 4, 22, 'Lyon', 'Lucas Petit'),
  createMockProcess('Studio Villeurbanne', '30 Cours Émile Zola, Villeurbanne', 'Marc Leroy', 'in_progress', 0, 0, 2, 'Villeurbanne', 'Thomas Bernard'),
];

export function useOnboarding() {
  const [processes, setProcesses] = useState<OnboardingProcess[]>(mockProcesses);
  const [filters, setFilters] = useState<OnboardingFilters>({
    status: 'all', assigneeId: '', city: '', search: '',
  });
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  const filteredProcesses = useMemo(() => {
    return processes.filter(p => {
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.propertyName.toLowerCase().includes(q) && 
            !p.ownerName.toLowerCase().includes(q) &&
            !p.propertyAddress.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [processes, filters]);

  const selectedProcess = useMemo(() => 
    processes.find(p => p.id === selectedProcessId) || null,
    [processes, selectedProcessId]
  );

  const kpis: OnboardingKPIs = useMemo(() => {
    const completed = processes.filter(p => p.status === 'completed');
    const active = processes.filter(p => p.status === 'in_progress');
    const blocked = processes.filter(p => p.status === 'blocked');
    
    return {
      totalOnboardings: processes.length,
      activeOnboardings: active.length,
      completedOnboardings: completed.length,
      blockedOnboardings: blocked.length,
      avgCompletionDays: completed.length > 0 ? Math.round(completed.reduce((acc, p) => acc + (p.totalDays || 0), 0) / completed.length) : 0,
      leadToMandatRate: processes.length > 0 ? Math.round((processes.filter(p => p.currentStepIndex >= 3).length / processes.length) * 100) : 0,
      avgSignatureDelay: 5,
      avgPublicationDelay: 3,
      completionRate: processes.length > 0 ? Math.round((completed.length / processes.length) * 100) : 0,
      avgDaysPerStep: DEFAULT_STEP_TEMPLATES.map((tpl, i) => ({
        stepTitle: tpl.title,
        avgDays: Math.round(Math.random() * 5 + 1),
      })),
      bottlenecks: [
        { stepTitle: 'Mandat de gestion', avgDays: 7.2, count: 3 },
        { stepTitle: 'Préparation du logement', avgDays: 9.5, count: 2 },
        { stepTitle: 'Diffusion sur les plateformes', avgDays: 3.1, count: 1 },
      ],
      frictionFreeRate: completed.length > 0 ? Math.round((completed.filter(p => !p.steps.some(s => s.status === 'blocked')).length / completed.length) * 100) : 0,
      leadToPublicationDays: completed.length > 0 ? Math.round(completed.reduce((acc, p) => acc + (p.totalDays || 0), 0) / completed.length) - 3 : 0,
    };
  }, [processes]);

  // Action-based step update (replaces checkbox toggling)
  const updateStepAction = useCallback((processId: string, stepId: string, actionData: StepActionData) => {
    setProcesses(prev => prev.map(p => {
      if (p.id !== processId) return p;
      
      const newSteps = p.steps.map(s => {
        if (s.id !== stepId) return s;
        
        // Determine if step is completed based on action data
        const isCompleted = checkStepCompletion(s.stepType, actionData);
        
        // Auto-complete subtasks if step action is done
        const newSubTasks = s.subTasks.map(st => ({
          ...st,
          completed: isCompleted ? true : st.completed,
          completedAt: isCompleted && !st.completedAt ? new Date().toISOString() : st.completedAt,
        }));
        
        return {
          ...s,
          actionData,
          subTasks: newSubTasks,
          status: isCompleted ? 'completed' as OnboardingStepStatus : s.status === 'locked' ? 'locked' : 'in_progress' as OnboardingStepStatus,
          completedAt: isCompleted ? new Date().toISOString() : undefined,
        };
      });

      // Unlock next step
      for (let i = 0; i < newSteps.length - 1; i++) {
        if (newSteps[i].status === 'completed' && newSteps[i + 1].status === 'locked') {
          newSteps[i + 1].status = 'todo';
        }
      }

      const completedCount = newSteps.filter(s => s.status === 'completed').length;
      const allCompleted = completedCount === newSteps.length;
      const currentIdx = newSteps.findIndex(s => s.status !== 'completed');

      return {
        ...p,
        steps: newSteps,
        progress: Math.round((completedCount / newSteps.length) * 100),
        currentStepIndex: currentIdx === -1 ? newSteps.length - 1 : currentIdx,
        status: allCompleted ? 'completed' : p.status,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const createOnboarding = useCallback((data: {
    propertyName: string; propertyAddress: string; ownerName: string;
    ownerEmail: string; ownerPhone: string; source: string; city: string;
    assigneeName: string;
  }) => {
    const newProcess = createMockProcess(
      data.propertyName, data.propertyAddress, data.ownerName,
      'in_progress', 0, 0, 0, data.city, data.assigneeName
    );
    newProcess.steps[0].status = 'todo';
    newProcess.ownerEmail = data.ownerEmail;
    newProcess.ownerPhone = data.ownerPhone;
    newProcess.source = data.source;
    // Set lead action data from creation form
    newProcess.steps[0].actionData = {
      source: data.source,
      responsibleName: data.assigneeName,
      responsibleId: generateId(),
      createdAt: new Date().toISOString(),
      contactCompleted: !!(data.ownerName && data.ownerEmail),
    } as LeadActionData;
    setProcesses(prev => [newProcess, ...prev]);
    return newProcess.id;
  }, []);

  const cities = useMemo(() => 
    [...new Set(processes.map(p => p.city).filter(Boolean))] as string[],
    [processes]
  );

  return {
    processes: filteredProcesses,
    allProcesses: processes,
    selectedProcess,
    setSelectedProcessId,
    filters,
    setFilters,
    kpis,
    updateStepAction,
    createOnboarding,
    cities,
  };
}

function checkStepCompletion(stepType: string, data: StepActionData): boolean {
  switch (stepType) {
    case 'lead': {
      const d = data as LeadActionData;
      return d.contactCompleted && !!d.source && !!d.responsibleName;
    }
    case 'appointment': {
      const d = data as AppointmentActionData;
      return d.status === 'completed';
    }
    case 'mandate': {
      const d = data as MandateActionData;
      return d.status === 'signed';
    }
    case 'rib': {
      const d = data as RibActionData;
      return d.validated;
    }
    case 'preparation': {
      const d = data as PreparationActionData;
      return d.cleaningCompleted && d.photoCompleted;
    }
    case 'property_creation': {
      const d = data as PropertyCreationActionData;
      return d.completionPercent === 100;
    }
    case 'publication': {
      const d = data as PublicationActionData;
      return d.platforms.some(p => p.status === 'published');
    }
    case 'closure': {
      const d = data as ClosureActionData;
      return d.messageSent && d.propertyActivated;
    }
    default:
      return false;
  }
}
