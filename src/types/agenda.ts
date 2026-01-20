
export interface AgendaEntry {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  authorId: string;
  authorName: string;
  linkedPropertyIds: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type AgendaViewMode = 'day' | 'week' | 'month' | 'list';

export interface AgendaFilters {
  searchQuery: string;
  propertyIds: string[];
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
