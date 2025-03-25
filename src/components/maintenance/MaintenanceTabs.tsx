
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceTaskList } from '@/components/maintenance/MaintenanceTaskList';
import { MaintenanceTask } from '@/types/maintenance';
import { useMaintenanceContext } from '@/contexts/MaintenanceContext';

interface MaintenanceTabsProps {
  onStateChange?: (state: {
    assignDialogOpen: boolean;
    selectedTaskId: string | number | null;
    detailsDialogOpen: boolean;
    selectedTask: MaintenanceTask | null;
  }) => void;
}

export const MaintenanceTabs: React.FC<MaintenanceTabsProps> = ({ onStateChange }) => {
  const { 
    pendingTasks, 
    inProgressTasks, 
    completedTasks, 
    stats, 
    handleCompleteTask 
  } = useMaintenanceContext();
  
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const openDetailsDialog = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setDetailsDialogOpen(true);
    if (onStateChange) {
      onStateChange({
        assignDialogOpen,
        selectedTaskId,
        detailsDialogOpen: true,
        selectedTask: task
      });
    }
  };

  const handleOpenAssignDialog = (taskId: string | number) => {
    setSelectedTaskId(taskId);
    setAssignDialogOpen(true);
    if (onStateChange) {
      onStateChange({
        assignDialogOpen: true,
        selectedTaskId: taskId,
        detailsDialogOpen,
        selectedTask
      });
    }
  };
  
  return (
    <Tabs defaultValue="pending">
      <TabsList className="w-full max-w-md grid grid-cols-3">
        <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
        <TabsTrigger value="inProgress">En cours ({stats.inProgress})</TabsTrigger>
        <TabsTrigger value="completed">Terminées</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="animate-slide-up">
        <MaintenanceTaskList 
          tasks={pendingTasks}
          type="pending"
          onAssign={handleOpenAssignDialog}
          onViewDetails={openDetailsDialog}
          emptyMessage="Aucune intervention en attente"
        />
      </TabsContent>
      
      <TabsContent value="inProgress" className="animate-slide-up">
        <MaintenanceTaskList 
          tasks={inProgressTasks}
          type="inProgress"
          onComplete={handleCompleteTask}
          onViewDetails={openDetailsDialog}
          emptyMessage="Aucune intervention en cours"
        />
      </TabsContent>
      
      <TabsContent value="completed" className="animate-slide-up">
        <MaintenanceTaskList 
          tasks={completedTasks}
          type="completed"
          onViewDetails={openDetailsDialog}
          emptyMessage="Aucune intervention terminée"
        />
      </TabsContent>
    </Tabs>
  );
};
