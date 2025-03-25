
import { MaintenanceTask, UrgencyLevel } from "@/types/maintenance";

export const getUrgencyBadge = (urgency: UrgencyLevel) => {
  switch(urgency) {
    case 'low':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case 'medium':
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case 'high':
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case 'critical':
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "";
  }
};

export const getUrgencyLabel = (urgency: UrgencyLevel): string => {
  switch(urgency) {
    case 'low':
      return "Faible";
    case 'medium':
      return "Moyenne";
    case 'high':
      return "Élevée";
    case 'critical':
      return "Critique";
    default:
      return urgency;
  }
};

// Helper to calculate maintenance statistics
export const calculateMaintenanceStats = (
  pendingTasks: MaintenanceTask[],
  inProgressTasks: MaintenanceTask[],
  completedTasks: MaintenanceTask[]
) => {
  return {
    pending: pendingTasks.length,
    inProgress: inProgressTasks.length,
    critical: pendingTasks.filter(task => task.urgency === 'critical').length,
    completedThisMonth: completedTasks.length
  };
};
