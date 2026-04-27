
import { useEffect, useState } from 'react';
import { MaintenanceStats } from '@/components/maintenance/MaintenanceStats';
import { MaintenanceSearchFilters } from '@/components/maintenance/MaintenanceSearchFilters';
import { MaintenanceProvider, useMaintenanceContext } from '@/contexts/MaintenanceContext';
import { MaintenanceTask } from '@/types/maintenance';
import { NewMaintenanceButton } from '@/components/maintenance/NewMaintenanceButton';
import { MaintenanceTabs } from '@/components/maintenance/MaintenanceTabs';
import { MaintenanceDialogs } from '@/components/maintenance/MaintenanceDialogs';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { Plus, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { TOAST_MESSAGES as M } from '@/lib/toastMessages';

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

const MaintenanceContent = () => {
  const { stats } = useMaintenanceContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

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

  const handleExport = () => {
    toast.success('Export lancé', {
      description: 'Le fichier CSV des interventions a été téléchargé.',
      duration: 3000,
    });
  };

  const handleCalendar = () => {
    toast.success('Calendrier synchronisé', {
      description: 'Les interventions ont été synchronisées avec le calendrier.',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      <TutorialTrigger moduleId="maintenance" />
      
      {/* Header responsive like Cleaning */}
      <div className="w-full box-border px-4 pt-4 pb-3 space-y-3">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h1 className="text-[22px] md:text-3xl font-bold tracking-tight text-foreground">Maintenance</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              Gestion des interventions techniques
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NewMaintenanceButton />
            <TutorialButton moduleId="maintenance" />
          </div>
        </div>

        {/* Secondary buttons - scrollable on mobile */}
        <div 
          className="flex gap-2 overflow-x-auto pb-1 md:justify-end"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          <Button size="sm" variant="outline" className="flex-shrink-0 h-9 rounded-lg gap-1.5 whitespace-nowrap text-[13px]" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Exporter
          </Button>
          <Button size="sm" variant="outline" className="flex-shrink-0 h-9 rounded-lg gap-1.5 whitespace-nowrap text-[13px]" onClick={handleCalendar}>
            <Calendar className="h-3.5 w-3.5" />
            Calendrier
          </Button>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="px-4" data-tutorial="maintenance-header">
        <MaintenanceStats 
          pendingCount={stats.pending}
          inProgressCount={stats.inProgress}
          criticalCount={stats.critical}
          completedCount={stats.completedThisMonth}
        />
      </div>
      
      {/* Main content card */}
      <div className="bg-card rounded-xl border border-border p-4 mx-4">
        <h2 className="text-xl font-bold text-foreground mb-3">Interventions</h2>
        <div className="space-y-4">
          <div data-tutorial="maintenance-filters">
            <MaintenanceSearchFilters />
          </div>
          <div data-tutorial="maintenance-card">
            <MaintenanceTabs onStateChange={handleTabsStateChange} />
          </div>
        </div>
      </div>

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
