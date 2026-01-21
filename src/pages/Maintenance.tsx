
import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MaintenanceStats } from '@/components/maintenance/MaintenanceStats';
import { MaintenanceSearchFilters } from '@/components/maintenance/MaintenanceSearchFilters';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import { MaintenanceTask } from '@/types/maintenance';
import { NewMaintenanceButton } from '@/components/maintenance/NewMaintenanceButton';
import { MaintenanceTabs } from '@/components/maintenance/MaintenanceTabs';
import { MaintenanceDialogs } from '@/components/maintenance/MaintenanceDialogs';
import { useMaintenanceContext } from '@/contexts/MaintenanceContext';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';

// This component wraps the MaintenanceContent with the MaintenanceProvider context
const Maintenance = () => {
  useEffect(() => {
    document.title = 'Maintenance - Concierge Synergy Platform';
  }, []);

  return (
    <MaintenanceProvider>
      <MaintenanceContent />
    </MaintenanceProvider>
  );
};

// The actual content, which uses the maintenance context
const MaintenanceContent = () => {
  const { stats } = useMaintenanceContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Handle state changes from the tabs component
  const handleTabsStateChange = (state: {
    assignDialogOpen: boolean;
    selectedTaskId: string | number | null;
    detailsDialogOpen: boolean;
    selectedTask: MaintenanceTask | null;
  }) => {
    setAssignDialogOpen(state.assignDialogOpen);
    setSelectedTaskId(state.selectedTaskId);
    setDetailsDialogOpen(state.detailsDialogOpen);
    setSelectedTask(state.selectedTask);
  };

  return (
    <div className="space-y-8">
      <TutorialTrigger moduleId="maintenance" />
      <div className="flex items-center justify-between" data-tutorial="maintenance-header">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des interventions techniques dans les logements
          </p>
        </div>
        <TutorialButton moduleId="maintenance" />
      </div>
      
      {/* Statistics */}
      <MaintenanceStats 
        pendingCount={stats.pending}
        inProgressCount={stats.inProgress}
        criticalCount={stats.critical}
        completedCount={stats.completedThisMonth}
      />
      
      {/* Maintenance management */}
      <DashboardCard 
        title="Interventions"
        actions={<NewMaintenanceButton />}
      >
        <div className="space-y-4">
          <div data-tutorial="maintenance-filters">
            <MaintenanceSearchFilters />
          </div>
          <div data-tutorial="maintenance-card">
            <MaintenanceTabs onStateChange={handleTabsStateChange} />
          </div>
        </div>
      </DashboardCard>

      {/* Dialogs */}
      <MaintenanceDialogs 
        assignDialogOpen={assignDialogOpen}
        setAssignDialogOpen={setAssignDialogOpen}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
};

export default Maintenance;
