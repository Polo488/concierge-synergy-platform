
import React, { createContext, useContext, ReactNode } from 'react';
import { MaintenanceTask, InventoryItem } from '@/types/maintenance';
import { useMaintenanceTasks } from '@/hooks/useMaintenanceTasks';
import { NewMaintenanceFormData } from '@/types/maintenance';

interface MaintenanceContextType {
  inventoryItems: InventoryItem[];
  pendingTasks: MaintenanceTask[];
  inProgressTasks: MaintenanceTask[];
  completedTasks: MaintenanceTask[];
  stats: {
    pending: number;
    inProgress: number;
    critical: number;
    completedThisMonth: number;
  };
  handleNewMaintenance: (data: NewMaintenanceFormData) => MaintenanceTask;
  handleAssignTechnician: (taskId: string | number, technicianName: string, scheduledDate?: string, notes?: string) => MaintenanceTask | null;
  handleCompleteTask: (taskId: string | number) => MaintenanceTask | null;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const maintenanceState = useMaintenanceTasks();
  
  return (
    <MaintenanceContext.Provider value={maintenanceState}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenanceContext = () => {
  const context = useContext(MaintenanceContext);
  
  if (context === undefined) {
    throw new Error("useMaintenanceContext must be used within a MaintenanceProvider");
  }
  
  return context;
};
