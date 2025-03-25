
import { useEffect, useState } from 'react';
import { Wrench, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MaintenanceTask, NewMaintenanceFormData, InventoryItem } from '@/types/maintenance';
import NewMaintenanceDialog from '@/components/maintenance/NewMaintenanceDialog';
import TechnicianAssignDialog from '@/components/maintenance/TechnicianAssignDialog';
import MaintenanceMaterialsDetails from '@/components/maintenance/MaintenanceMaterialsDetails';
import { MaintenanceStats } from '@/components/maintenance/MaintenanceStats';
import { MaintenanceSearchFilters } from '@/components/maintenance/MaintenanceSearchFilters';
import { MaintenanceTaskList } from '@/components/maintenance/MaintenanceTaskList';
import { calculateMaintenanceStats } from '@/utils/maintenanceUtils';
import { getInitialMaintenanceTasks, getMaintenanceInventoryData } from '@/components/maintenance/MaintenanceInventoryData';

const Maintenance = () => {
  useEffect(() => {
    document.title = 'Maintenance - Concierge Synergy Platform';
  }, []);

  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(getMaintenanceInventoryData());

  // Get initial tasks
  const initialTasks = getInitialMaintenanceTasks();

  // State for tasks
  const [pendingTasks, setPendingTasks] = useState<MaintenanceTask[]>(initialTasks.pending);
  const [inProgressTasks, setInProgressTasks] = useState<MaintenanceTask[]>(initialTasks.inProgress);
  const [completedTasks, setCompletedTasks] = useState<MaintenanceTask[]>(initialTasks.completed);
  
  // State for dialogs
  const [newMaintenanceOpen, setNewMaintenanceOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  
  // Calculate statistics
  const stats = calculateMaintenanceStats(pendingTasks, inProgressTasks, completedTasks);

  // Function to update inventory based on material usage
  const updateInventory = (materialQuantities: Record<number, number>, isDeduction: boolean) => {
    setInventoryItems(prevItems => {
      return prevItems.map(item => {
        if (materialQuantities[item.id]) {
          const changeAmount = isDeduction ? -materialQuantities[item.id] : materialQuantities[item.id];
          const newStock = item.stock + changeAmount;
          return {
            ...item,
            stock: newStock,
            status: newStock < item.min ? 'low' : 'ok'
          };
        }
        return item;
      });
    });
  };

  // Handle task operations
  const handleNewMaintenance = (data: NewMaintenanceFormData) => {
    const newTask: MaintenanceTask = {
      id: Date.now(), // Generate a unique ID
      title: data.title,
      property: data.property,
      internalName: data.internalName,
      urgency: data.urgency,
      createdAt: new Date().toISOString().split('T')[0],
      description: data.description,
      materials: data.materials,
      materialQuantities: data.materialQuantities
    };
    
    // Update inventory (reduce stock)
    updateInventory(data.materialQuantities, true);
    
    setPendingTasks(prev => [newTask, ...prev]);
    setNewMaintenanceOpen(false);
    toast.success("Nouvelle intervention créée avec succès");
  };

  // Update the handleAssignTechnician function to accept a scheduled date and notes
  const handleAssignTechnician = (taskId: string | number, technicianName: string, scheduledDate?: string, notes?: string) => {
    const task = pendingTasks.find(task => task.id === taskId);
    
    if (task) {
      // Remove from pending
      setPendingTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Add to in-progress with technician, startedAt, scheduledDate and notes
      const updatedTask: MaintenanceTask = {
        ...task,
        technician: technicianName,
        startedAt: new Date().toISOString().split('T')[0],
        scheduledDate,
        notes
      };
      
      setInProgressTasks(prev => [updatedTask, ...prev]);
      toast.success(`Intervention assignée à ${technicianName}${scheduledDate ? ` pour le ${scheduledDate}` : ''}`);
    }
    
    setAssignDialogOpen(false);
    setSelectedTaskId(null);
  };

  const handleCompleteTask = (taskId: string | number) => {
    const task = inProgressTasks.find(task => task.id === taskId);
    
    if (task) {
      // Remove from in-progress
      setInProgressTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Add to completed with completedAt
      const updatedTask: MaintenanceTask = {
        ...task,
        completedAt: new Date().toISOString().split('T')[0]
      };
      
      setCompletedTasks(prev => [updatedTask, ...prev]);
      toast.success("Intervention marquée comme terminée");
    }
    
    setDetailsDialogOpen(false);
    setSelectedTask(null);
  };

  const openDetailsDialog = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setDetailsDialogOpen(true);
  };

  const handleOpenAssignDialog = (taskId: string | number) => {
    setSelectedTaskId(taskId);
    setAssignDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des interventions techniques dans les logements
        </p>
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
        actions={
          <Dialog open={newMaintenanceOpen} onOpenChange={setNewMaintenanceOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Nouvelle intervention
              </Button>
            </DialogTrigger>
            <NewMaintenanceDialog 
              onSubmit={handleNewMaintenance} 
              onCancel={() => setNewMaintenanceOpen(false)}
              inventoryItems={inventoryItems}
            />
          </Dialog>
        }
      >
        <div className="space-y-4">
          <MaintenanceSearchFilters />
          
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
        </div>
      </DashboardCard>

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
    </div>
  );
};

export default Maintenance;
