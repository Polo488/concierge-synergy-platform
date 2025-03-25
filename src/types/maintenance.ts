
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface MaintenanceTask {
  id: string | number;
  title: string;
  property: string;
  urgency: UrgencyLevel;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  technician?: string;
  description: string;
  materials?: string[];
}

export interface NewMaintenanceFormData {
  title: string;
  property: string;
  urgency: UrgencyLevel;
  description: string;
  materials: string;
}
