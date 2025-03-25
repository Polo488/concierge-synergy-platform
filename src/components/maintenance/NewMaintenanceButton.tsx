
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import NewMaintenanceDialog from '@/components/maintenance/NewMaintenanceDialog';
import { useMaintenanceContext } from '@/contexts/MaintenanceContext';

export const NewMaintenanceButton = () => {
  const { inventoryItems, handleNewMaintenance } = useMaintenanceContext();
  const [newMaintenanceOpen, setNewMaintenanceOpen] = useState(false);

  return (
    <Dialog open={newMaintenanceOpen} onOpenChange={setNewMaintenanceOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Nouvelle intervention
        </Button>
      </DialogTrigger>
      <NewMaintenanceDialog 
        onSubmit={(data) => {
          handleNewMaintenance(data);
          setNewMaintenanceOpen(false);
        }}
        onCancel={() => setNewMaintenanceOpen(false)}
        inventoryItems={inventoryItems}
      />
    </Dialog>
  );
};
