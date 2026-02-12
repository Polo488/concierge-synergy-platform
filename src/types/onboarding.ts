
export type OnboardingStepStatus = 'locked' | 'todo' | 'in_progress' | 'waiting' | 'completed' | 'blocked';

export type OnboardingStatus = 'in_progress' | 'completed' | 'blocked' | 'cancelled';

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

export interface OnboardingStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: OnboardingStepStatus;
  assigneeIds: string[];
  assigneeNames: string[];
  subTasks: OnboardingSubTask[];
  startedAt?: string;
  completedAt?: string;
  dueDate?: string;
  blockedReason?: string;
  notes?: string;
  // KPIs
  estimatedDays?: number;
  actualDays?: number;
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
  // Computed
  progress: number; // 0-100
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
  bottlenecks: { stepTitle: string; avgDays: number; count: number }[];
}

export interface OnboardingFilters {
  status: OnboardingStatus | 'all';
  assigneeId: string;
  city: string;
  search: string;
}

// Step templates (the 7 standard steps)
export const DEFAULT_STEP_TEMPLATES: Omit<OnboardingStep, 'id' | 'status' | 'assigneeIds' | 'assigneeNames' | 'startedAt' | 'completedAt' | 'actualDays'>[] = [
  {
    order: 1,
    title: 'Création du lead propriétaire',
    description: 'Création d\'un lead avec informations de base et assignation d\'un responsable commercial.',
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
    description: 'Planification et réalisation du rendez-vous avec le propriétaire.',
    subTasks: [
      { id: 'rdv-1', label: 'Date et heure du rendez-vous fixées', completed: false, required: true },
      { id: 'rdv-2', label: 'Rendez-vous synchronisé avec l\'agenda', completed: false, required: true },
      { id: 'rdv-3', label: 'Rendez-vous marqué comme réalisé', completed: false, required: true },
    ],
    estimatedDays: 5,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 3,
    title: 'Mandat',
    description: 'Création, envoi et signature du mandat de gestion.',
    subTasks: [
      { id: 'mdt-1', label: 'Mandat créé et complété', completed: false, required: true },
      { id: 'mdt-2', label: 'Lien de signature envoyé au propriétaire', completed: false, required: true },
      { id: 'mdt-3', label: 'Mandat signé par le propriétaire', completed: false, required: true },
    ],
    estimatedDays: 7,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 4,
    title: 'Préparation du logement',
    description: 'Organisation du premier ménage et des photos professionnelles.',
    subTasks: [
      { id: 'prep-1', label: 'Premier ménage organisé', completed: false, required: true },
      { id: 'prep-2', label: 'Séance photo planifiée', completed: false, required: true },
      { id: 'prep-3', label: 'Photos reçues et validées', completed: false, required: true },
    ],
    estimatedDays: 10,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 5,
    title: 'Création du bien dans le système',
    description: 'Fiche logement complète dans le channel manager avec tous les champs obligatoires.',
    subTasks: [
      { id: 'crea-1', label: 'Fiche logement créée', completed: false, required: true },
      { id: 'crea-2', label: 'Tous les champs obligatoires remplis', completed: false, required: true },
      { id: 'crea-3', label: 'Photos uploadées', completed: false, required: true },
      { id: 'crea-4', label: 'RIB propriétaire reçu et vérifié', completed: false, required: true },
    ],
    estimatedDays: 3,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 6,
    title: 'Diffusion sur les plateformes',
    description: 'Connexion aux plateformes et validation avant mise en ligne.',
    subTasks: [
      { id: 'diff-1', label: 'Connexion Airbnb configurée', completed: false, required: true },
      { id: 'diff-2', label: 'Connexion Booking configurée', completed: false, required: true },
      { id: 'diff-3', label: 'Check-list de validation complétée', completed: false, required: true },
      { id: 'diff-4', label: 'Annonce publiée', completed: false, required: true },
    ],
    estimatedDays: 2,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
  {
    order: 7,
    title: 'Clôture de l\'onboarding',
    description: 'Finalisation et passage du logement en statut actif.',
    subTasks: [
      { id: 'clo-1', label: 'Message de fin envoyé au propriétaire', completed: false, required: true },
      { id: 'clo-2', label: 'Logement passé en statut actif', completed: false, required: true },
    ],
    estimatedDays: 1,
    dueDate: undefined,
    blockedReason: undefined,
    notes: undefined,
  },
];
