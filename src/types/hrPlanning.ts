
// HR Planning Types

// Status codes for planning days
export type PlanningStatusCode = 'P' | 'R' | 'C' | 'S' | 'TR' | 'TT' | 'UNK';

export interface PlanningStatus {
  code: PlanningStatusCode;
  label: string;
  color: string; // Tailwind class or HSL value
  bgColor: string; // Background color class
  isWorkingDay: boolean;
}

export const PLANNING_STATUSES: Record<PlanningStatusCode, PlanningStatus> = {
  P: {
    code: 'P',
    label: 'Présent',
    color: 'hsl(142, 60%, 35%)',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    isWorkingDay: true,
  },
  R: {
    code: 'R',
    label: 'Repos',
    color: 'hsl(220, 15%, 55%)',
    bgColor: 'bg-slate-100 dark:bg-slate-800/50',
    isWorkingDay: false,
  },
  C: {
    code: 'C',
    label: 'Congés payés',
    color: 'hsl(200, 70%, 45%)',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    isWorkingDay: false,
  },
  S: {
    code: 'S',
    label: 'Maladie',
    color: 'hsl(0, 60%, 50%)',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    isWorkingDay: false,
  },
  TR: {
    code: 'TR',
    label: 'Formation',
    color: 'hsl(270, 50%, 50%)',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    isWorkingDay: true,
  },
  TT: {
    code: 'TT',
    label: 'Télétravail',
    color: 'hsl(45, 70%, 45%)',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    isWorkingDay: true,
  },
  UNK: {
    code: 'UNK',
    label: 'Non défini',
    color: 'hsl(0, 0%, 60%)',
    bgColor: 'bg-gray-50 dark:bg-gray-800/30',
    isWorkingDay: false,
  },
};

export interface HRTeam {
  id: string;
  name: string;
  displayOrder: number;
  color: string; // Subtle header color
}

export interface HREmployee {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  teamId: string;
  role?: string;
  contractType?: 'CDI' | 'CDD' | 'Alternant' | 'Stage' | 'Freelance';
  weeklyHoursTarget?: number;
  active: boolean;
  defaultWorkPattern?: PlanningStatusCode[];
}

export interface PlanningDay {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: PlanningStatusCode;
  note?: string;
  overtimeMinutes?: number;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  breakMinutes?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeMonthlySummary {
  employeeId: string;
  presentDays: number;
  restDays: number;
  paidLeaveDays: number;
  sickDays: number;
  trainingDays: number;
  remoteDays: number;
  unknownDays: number;
  totalOvertimeMinutes: number;
}

export interface TeamMonthlySummary {
  teamId: string;
  teamName: string;
  employeeCount: number;
  totalOvertimeMinutes: number;
  averagePresence: number;
}

export interface BulkEditPayload {
  employeeId: string;
  dates: string[];
  status: PlanningStatusCode;
  overtimeMinutes?: number;
  note?: string;
}

export interface WorkPattern {
  id: string;
  name: string;
  pattern: PlanningStatusCode[]; // 7 days, starting Monday
  description?: string;
}

export const DEFAULT_WORK_PATTERNS: WorkPattern[] = [
  {
    id: 'standard',
    name: 'Standard (Lun-Ven)',
    pattern: ['P', 'P', 'P', 'P', 'P', 'R', 'R'],
    description: 'Présent du lundi au vendredi, repos le week-end',
  },
  {
    id: 'weekend',
    name: 'Week-end',
    pattern: ['R', 'R', 'R', 'R', 'R', 'P', 'P'],
    description: 'Travail le week-end, repos en semaine',
  },
  {
    id: '4days',
    name: '4 jours',
    pattern: ['P', 'P', 'P', 'P', 'R', 'R', 'R'],
    description: 'Semaine de 4 jours',
  },
  {
    id: 'alternating',
    name: 'Alternance',
    pattern: ['P', 'R', 'P', 'R', 'P', 'R', 'R'],
    description: 'Jours alternés',
  },
];

// Selection state for multi-select
export interface CellSelection {
  employeeId: string;
  date: string;
}

export interface SelectionRange {
  employeeId: string;
  startDate: string;
  endDate: string;
}

// Export types
export type ExportFormat = 'csv' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  includeOvertime: boolean;
  includeNotes: boolean;
  teamIds?: string[];
}
