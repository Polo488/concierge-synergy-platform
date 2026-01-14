
import { QualityTag } from './quality';

export type CleaningStatus = 'todo' | 'inProgress' | 'completed' | 'scheduled';

export interface CleaningTaskRating {
  rating: number;
  comment: string;
  tags: QualityTag[];
  reworkRequired: boolean;
  reworkReason: string;
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
}
