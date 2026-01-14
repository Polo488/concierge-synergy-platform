
import { QualityTag } from './quality';

export type CleaningStatus = 'todo' | 'inProgress' | 'completed' | 'scheduled';

// Issue source: where the issue was reported from
export type CleaningIssueSource = 'cleaning_task' | 'reservation' | 'quality_check';

// Issue type categories
export type CleaningIssueType = 
  | 'dust'
  | 'bathroom'
  | 'linen'
  | 'kitchen'
  | 'smell'
  | 'floors'
  | 'missing_items'
  | 'windows'
  | 'appliances'
  | 'damage'
  | 'guest_complaint'
  | 'other';

// Cleaning Issue entity
export interface CleaningIssue {
  id: number;
  propertyId: string;
  propertyName: string;
  linkedTaskId?: number;
  linkedAgentId?: string;
  linkedAgentName?: string;
  linkedReservationId?: string;
  source: CleaningIssueSource;
  issueType: CleaningIssueType;
  description: string;
  photos: string[];
  repasseRequired: boolean;
  repasseTaskId?: number;
  status: 'open' | 'resolved';
  createdAt: string;
  createdBy: string;
  resolvedAt?: string;
}

export interface CleaningTaskRating {
  rating: number;
  comment: string;
  tags: QualityTag[];
  repasseRequired: boolean;
  repasseReason: string;
  ratedAt: string;
  ratedBy: string;
}

export interface CleaningTask {
  id: number;
  property: string;
  checkoutTime?: string;
  checkinTime?: string;
  status: CleaningStatus;
  cleaningAgent: string | null;
  startTime: string;
  endTime: string;
  date?: string;
  linens: string[];
  consumables: string[];
  comments: string;
  problems: string[];
  qualityRating?: CleaningTaskRating;
  taskType?: 'standard' | 'repasse';
  linkedIssueId?: number;
  originalTaskId?: number;
}

export interface NewCleaningTask {
  property: string;
  checkoutTime: string;
  checkinTime: string;
  status: CleaningStatus;
  cleaningAgent: string;
  date: string;
  linens: string[];
  consumables: string[];
  comments: string;
  taskType?: 'standard' | 'repasse';
  linkedIssueId?: number;
  originalTaskId?: number;
}
