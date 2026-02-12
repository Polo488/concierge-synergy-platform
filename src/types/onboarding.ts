
export type OnboardingStepStatus = 'locked' | 'todo' | 'in_progress' | 'waiting' | 'completed' | 'blocked';

export type OnboardingStatus = 'in_progress' | 'completed' | 'blocked' | 'cancelled';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export type MandateStatus = 'draft' | 'sent' | 'signed';

export type PlatformStatus = 'pending' | 'published' | 'error';

export interface OnboardingSubTask {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

// Step-specific action data
export interface LeadActionData {
  source: string;
  responsibleName: string;
  responsibleId: string;
  createdAt: string;
  contactCompleted: boolean;
}

export interface AppointmentActionData {
  date?: string;
  time?: string;
  agendaEventId?: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface MandateActionData {
  status: MandateStatus;
  documentContent?: string;
  ownerName?: string;
  propertyAddress?: string;
  commissionRate?: number;
  signatureLink?: string;
  signedAt?: string;
  sentAt?: string;
}

export interface RibActionData {
  iban?: string;
  bic?: string;
  accountHolder?: string;
  validated: boolean;
  validatedAt?: string;
}

export interface PreparationActionData {
  cleaningTaskId?: string;
  cleaningDate?: string;
  cleaningAgent?: string;
  cleaningCompleted: boolean;
  photoSessionId?: string;
  photoDate?: string;
  photoProvider?: string;
  photoCompleted: boolean;
}

export interface PropertyCreationActionData {
  propertyId?: string;
  completionPercent: number;
  requiredFields: { field: string; label: string; completed: boolean }[];
}

export interface PublicationActionData {
  platforms: { name: string; status: PlatformStatus; publishedAt?: string }[];
}

export interface ClosureActionData {
  messageSent: boolean;
  messageSentAt?: string;
  propertyActivated: boolean;
  activatedAt?: string;
}

export type StepActionData =
  | LeadActionData
  | AppointmentActionData
  | MandateActionData
  | RibActionData
  | PreparationActionData
  | PropertyCreationActionData
  | PublicationActionData
  | ClosureActionData;

export interface OnboardingStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: OnboardingStepStatus;
  stepType: 'lead' | 'appointment' | 'mandate' | 'rib' | 'preparation' | 'property_creation' | 'publication' | 'closure';
  assigneeIds: string[];
  assigneeNames: string[];
  subTasks: OnboardingSubTask[];
  actionData?: StepActionData;
  startedAt?: string;
  completedAt?: string;
  dueDate?: string;
  blockedReason?: string;
  notes?: string;
  estimatedDays?: number;
  actualDays?: number;
  linkedModule?: string;
}

export interface OnboardingAuditEntry {
  id: string;
  date: string;
  userId: string;
  userName: string;
  action: string;
  stepId?: string;
  details?: string;
}

export interface OnboardingProcess {
  id: string;
  propertyName: string;
  propertyAddress: string;
  propertyType: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  source: string;
  status: OnboardingStatus;
  assignedToId: string;
  assignedToName: string;
  steps: OnboardingStep[];
  auditTrail: OnboardingAuditEntry[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  templateId: string;
  city?: string;
  group?: string;
  progress: number;
  currentStepIndex: number;
  totalDays?: number;
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  city?: string;
  group?: string;
  steps: Omit<OnboardingStep, 'status' | 'assigneeIds' | 'assigneeNames' | 'startedAt' | 'completedAt' | 'actualDays'>[];
}

export interface OnboardingKPIs {
  totalOnboardings: number;
  activeOnboardings: number;
  completedOnboardings: number;
  blockedOnboardings: number;
  avgCompletionDays: number;
  leadToMandatRate: number;
  avgSignatureDelay: number;
  avgPublicationDelay: number;
  completionRate: number;
  avgDaysPerStep: { stepTitle: string; avgDays: number }[];
  bottlenecks: { stepTitle: string; avgDays: number; count: number }[];
  frictionFreeRate: number;
  leadToPublicationDays: number;
}

export interface OnboardingFilters {
  status: OnboardingStatus | 'all';
  assigneeId: string;
  city: string;
  search: string;
}

export const DEFAULT_STEP_TEMPLATES: Omit<OnboardingStep, 'id' | 'status' | 'assigneeIds' | 'assigneeNames' | 'startedAt' | 'completedAt' | 'actualDays'>[] = [
  {
    order: 1,
    title: 'Création du lead propriétaire',
    description: 'Création d\'un lead avec informations de base et assignation d\'un responsable commercial.',
    stepType: 'lead',
    linkedModule: 'Contacts',
    subTasks: [
      { id: 'lt-1', label: 'Informations de contact complétées', completed: false, required: true },
      { id: 'lt-2', label: 'Source du lead renseignée', completed: false, required: true },
      { id: 'lt-3', label: 'Responsable commercial assigné', completed: false, required: true },
    ],
    estimatedDays: 1,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 2,
    title: 'Rendez-vous propriétaire',
    description: 'Planification et réalisation du rendez-vous avec le propriétaire, synchronisé avec l\'agenda.',
    stepType: 'appointment',
    linkedModule: 'Agenda',
    subTasks: [
      { id: 'rdv-1', label: 'Rendez-vous planifié dans l\'agenda', completed: false, required: true },
      { id: 'rdv-2', label: 'Rendez-vous marqué comme réalisé', completed: false, required: true },
    ],
    estimatedDays: 5,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 3,
    title: 'Mandat de gestion',
    description: 'Création, édition et signature électronique du mandat de gestion.',
    stepType: 'mandate',
    linkedModule: 'Documents',
    subTasks: [
      { id: 'mdt-1', label: 'Mandat rédigé', completed: false, required: true },
      { id: 'mdt-2', label: 'Mandat signé électroniquement', completed: false, required: true },
    ],
    estimatedDays: 7,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 4,
    title: 'RIB propriétaire',
    description: 'Collecte et validation des coordonnées bancaires du propriétaire.',
    stepType: 'rib',
    linkedModule: 'Finance',
    subTasks: [
      { id: 'rib-1', label: 'RIB validé', completed: false, required: true },
    ],
    estimatedDays: 3,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 5,
    title: 'Préparation du logement',
    description: 'Organisation du premier ménage et des photos professionnelles via les modules dédiés.',
    stepType: 'preparation',
    linkedModule: 'Ménage / Agenda',
    subTasks: [
      { id: 'prep-1', label: 'Premier ménage planifié', completed: false, required: true },
      { id: 'prep-2', label: 'Séance photo planifiée', completed: false, required: true },
    ],
    estimatedDays: 10,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 6,
    title: 'Création du bien dans le système',
    description: 'Fiche logement complète dans le channel manager avec tous les champs obligatoires.',
    stepType: 'property_creation',
    linkedModule: 'Propriétés / Channel',
    subTasks: [
      { id: 'crea-1', label: 'Fiche logement complète', completed: false, required: true },
    ],
    estimatedDays: 3,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 7,
    title: 'Diffusion sur les plateformes',
    description: 'Publication du logement sur les plateformes de réservation.',
    stepType: 'publication',
    linkedModule: 'Channel Manager',
    subTasks: [
      { id: 'diff-1', label: 'Au moins une plateforme active', completed: false, required: true },
    ],
    estimatedDays: 2,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 8,
    title: 'Clôture de l\'onboarding',
    description: 'Finalisation, activation du logement et début du suivi opérationnel.',
    stepType: 'closure',
    linkedModule: 'Communication / Stats',
    subTasks: [
      { id: 'clo-1', label: 'Message de fin envoyé', completed: false, required: true },
      { id: 'clo-2', label: 'Logement activé', completed: false, required: true },
    ],
    estimatedDays: 1,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
];
