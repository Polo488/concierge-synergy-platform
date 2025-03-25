
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import TechnicianAssignDialog from '@/components/maintenance/TechnicianAssignDialog';
import MaintenanceMaterialsDetails from '@/components/maintenance/MaintenanceMaterialsDetails';
import { MaintenanceTask } from '@/types/maintenance';
import { useMaintenanceContext } from '@/contexts/MaintenanceContext';

interface MaintenanceDialogsProps {
  assignDialogOpen: boolean;
  setAssignDialogOpen: (open: boolean) => void;
  selectedTaskId: string | number | null;
  setSelectedTaskId: (id: string | number | null) => void;
  detailsDialogOpen: boolean;
  setDetailsDialogOpen: (open: boolean) => void;
  selectedTask: MaintenanceTask | null;
  setSelectedTask: (task: MaintenanceTask | null) => void;
}

export const MaintenanceDialogs: React.FC<MaintenanceDialogsProps> = ({
  assignDialogOpen,
  setAssignDialogOpen,
  selectedTaskId,
  setSelectedTaskId,
  detailsDialogOpen,
  setDetailsDialogOpen,
  selectedTask,
  setSelectedTask
}) => {
  const { handleAssignTechnician, handleCompleteTask } = useMaintenanceContext();

  return (
    <>
      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={(open) => {
        if (!open) setSelectedTaskId(null);
        setAssignDialogOpen(open);
      }}>
        {selectedTaskId && (
          <TechnicianAssignDialog 
            taskId={selectedTaskId}
            onSubmit={handleAssignTechnician}
            onCancel={() => {
              setAssignDialogOpen(false);
              setSelectedTaskId(null);
            }}
          />
        )}
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        {selectedTask && (
          <MaintenanceMaterialsDetails 
            task={selectedTask}
            onClose={() => {
              setDetailsDialogOpen(false);
              setSelectedTask(null);
            }}
            onMarkComplete={handleCompleteTask}
          />
        )}
      </Dialog>
    </>
  );
};
