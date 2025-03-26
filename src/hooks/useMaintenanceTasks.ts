
import { useState } from 'react';
import { MaintenanceTask, NewMaintenanceFormData, InventoryItem } from '@/types/maintenance';
import { toast } from 'sonner';
import { getInitialMaintenanceTasks, getMaintenanceInventoryData } from '@/components/maintenance/MaintenanceInventoryData';
import { calculateMaintenanceStats } from '@/utils/maintenanceUtils';

export const useMaintenanceTasks = () => {
  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(getMaintenanceInventoryData());

  // Get initial tasks
  const initialTasks = getInitialMaintenanceTasks();

  // State for tasks
  const [pendingTasks, setPendingTasks] = useState<MaintenanceTask[]>(initialTasks.pending);
  const [inProgressTasks, setInProgressTasks] = useState<MaintenanceTask[]>(initialTasks.inProgress);
  const [completedTasks, setCompletedTasks] = useState<MaintenanceTask[]>(initialTasks.completed);
  
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
      materialQuantities: data.materialQuantities,
      scheduledDate: data.scheduledDate // Include the scheduled date
    };
    
    // Update inventory (reduce stock)
    updateInventory(data.materialQuantities, true);
    
    setPendingTasks(prev => [newTask, ...prev]);
    
    // Customize the success message based on whether a scheduled date was provided
    if (data.scheduledDate) {
      toast.success(`Nouvelle intervention créée et programmée pour le ${data.scheduledDate}`);
    } else {
      toast.success("Nouvelle intervention créée avec succès");
    }
    
    return newTask;
  };

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
      return updatedTask;
    }
    
    return null;
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
      return updatedTask;
    }
    
    return null;
  };

  return {
    inventoryItems,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    stats,
    handleNewMaintenance,
    handleAssignTechnician,
    handleCompleteTask,
    updateInventory
  };
};
