
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
  items: string[];
  consumables: string[];
  bedding: string[];
  comments: string;
}

export interface NewCleaningTask {
  property: string;
  checkoutTime: string;
  checkinTime: string;
  status: CleaningStatus;
  cleaningAgent: string;
  date: string;
  items: string[];
  consumables: string[];
  bedding: string[];
  comments: string;
}
