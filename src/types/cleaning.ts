
export type CleaningStatus = 'todo' | 'inProgress' | 'completed' | 'scheduled';

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
