
import { CleaningStatus, CleaningTask } from '@/types/cleaning';

export const sortTasksByDateTime = (tasks: CleaningTask[]): CleaningTask[] => {
  return [...tasks].sort((a, b) => {
    // Sort by date first if available
    if (a.date && b.date) {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
    }
    
    // Then sort by time
    const aTime = a.startTime || '';
    const bTime = b.startTime || '';
    return aTime.localeCompare(bTime);
  });
};

export const getStatusLabel = (status: CleaningStatus): string => {
  switch (status) {
    case 'todo':
      return 'À faire';
    case 'inProgress':
      return 'En cours';
    case 'completed':
      return 'Terminé';
    case 'scheduled':
      return 'Planifié';
    default:
      return status;
  }
};

export const getStatusBadgeClass = (status: CleaningStatus): string => {
  switch (status) {
    case 'todo':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'inProgress':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'scheduled':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return '';
  }
};
