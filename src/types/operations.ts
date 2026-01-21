
// Shared types for operational objects created from messaging or other sources

export type OperationSource = 'manual' | 'guest_message' | 'quality_check' | 'system';

export interface OperationSourceInfo {
  source: OperationSource;
  conversationId?: string;
  reservationId?: string;
  propertyId?: string;
  guestId?: string;
  guestName?: string;
  createdBy?: string;
  createdAt: string;
}

// Extended maintenance task with source tracking
export interface MaintenanceTaskSource {
  source: OperationSource;
  conversationId?: string;
  reservationId?: string;
  guestId?: string;
  guestName?: string;
  originalMessagePreview?: string;
}

// Extended cleaning issue with source tracking
export interface CleaningIssueSource {
  source: OperationSource;
  conversationId?: string;
  reservationId?: string;
  guestId?: string;
  guestName?: string;
  originalMessagePreview?: string;
}

// Repasse task source information
export interface RepasseTaskSource {
  source: OperationSource;
  conversationId?: string;
  reservationId?: string;
  guestId?: string;
  guestName?: string;
  linkedIssueId?: number;
  linkedCleaningTaskId?: number;
}

// Unified linked task info that can navigate back to source
export interface LinkedOperationalTask {
  id: string;
  type: 'maintenance' | 'cleaning_issue' | 'repasse' | 'agenda_note';
  title: string;
  status: string;
  propertyId: string;
  propertyName: string;
  reservationId?: string;
  conversationId: string;
  createdAt: Date;
  source: OperationSource;
  // Bidirectional navigation
  canNavigateToTask: boolean;
  canNavigateToConversation: boolean;
}

// Form data for creating maintenance from messaging
export interface MessagingMaintenanceFormData {
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  propertyId: string;
  propertyName: string;
  conversationId: string;
  reservationId?: string;
  guestId?: string;
  guestName?: string;
  prefilledMessage?: string;
}

// Form data for creating cleaning issue from messaging
export interface MessagingCleaningIssueFormData {
  issueTypes: string[];
  description: string;
  propertyId: string;
  propertyName: string;
  conversationId: string;
  reservationId?: string;
  guestId?: string;
  guestName?: string;
  linkedCleaningTaskId?: number;
  repasseRequired: boolean;
  photos: string[];
  prefilledMessage?: string;
}

// Stats tracking for messaging-originated tasks
export interface MessagingOperationsStats {
  maintenanceFromMessaging: number;
  cleaningIssuesFromMessaging: number;
  repassesFromMessaging: number;
  issuesPerProperty: Record<string, number>;
  issuesPerReservation: Record<string, number>;
}
