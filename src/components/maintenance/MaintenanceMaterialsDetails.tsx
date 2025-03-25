
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MaintenanceTask } from "@/types/maintenance";
import { toast } from "sonner";

interface MaintenanceMaterialsDetailsProps {
  task: MaintenanceTask;
  onClose: () => void;
  onMarkComplete: (taskId: string | number) => void;
}

const MaintenanceMaterialsDetails = ({ task, onClose, onMarkComplete }: MaintenanceMaterialsDetailsProps) => {
  const handleMarkComplete = () => {
    onMarkComplete(task.id);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Détails de l'intervention</DialogTitle>
        <DialogDescription>
          Matériel utilisé pour cette intervention
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <h3 className="font-medium text-base mb-2">{task.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{task.property}</p>
          <p className="text-sm mb-4">{task.description}</p>
        </div>

        {task.technician && (
          <div>
            <p className="text-sm font-medium mb-1">Technicien assigné:</p>
            <p className="text-sm">{task.technician}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Matériel nécessaire:</p>
          {task.materials && task.materials.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {task.materials.map((material) => (
                <Badge key={material.id} variant="outline" className="rounded-full">
                  {material.name} {task.materialQuantities?.[material.id] > 1 ? 
                    `(${task.materialQuantities[material.id]} unités)` : ''}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun matériel spécifié</p>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Créé le:</span> {task.createdAt}
          </p>
          {task.startedAt && (
            <p>
              <span className="font-medium">Commencé le:</span> {task.startedAt}
            </p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Fermer
        </Button>
        {!task.completedAt && (
          <Button type="button" onClick={handleMarkComplete}>
            Marquer comme terminée
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default MaintenanceMaterialsDetails;
