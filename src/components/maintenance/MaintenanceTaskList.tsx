
import React from 'react';
import { MaintenanceTask } from '@/types/maintenance';
import { MaintenanceTaskCard } from './MaintenanceTaskCard';

interface MaintenanceTaskListProps {
  tasks: MaintenanceTask[];
  type: 'pending' | 'inProgress' | 'completed';
  onAssign?: (taskId: string | number) => void;
  onComplete?: (taskId: string | number) => void;
  onViewDetails: (task: MaintenanceTask) => void;
  emptyMessage?: string;
}

export const MaintenanceTaskList = ({
  tasks,
  type,
  onAssign,
  onComplete,
  onViewDetails,
  emptyMessage = "Aucune intervention trouvée"
}: MaintenanceTaskListProps) => {
  return (
    <div className="space-y-4 mt-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <MaintenanceTaskCard 
            key={task.id} 
            task={task} 
            type={type}
            onAssign={onAssign}
            onComplete={onComplete}
            onViewDetails={onViewDetails}
          />
        ))
      ) : (
        <div className="text-center p-4">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};
