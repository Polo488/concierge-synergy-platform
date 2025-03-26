
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CleaningTask } from "@/types/cleaning";

interface CleaningTaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: CleaningTask | null;
  getStatusBadge: (status: string) => JSX.Element | null;
  onEditComments: () => void;
}

export const CleaningTaskDetailsDialog = ({
  open,
  onOpenChange,
  currentTask,
  getStatusBadge,
  onEditComments
}: CleaningTaskDetailsDialogProps) => {
  if (!currentTask) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails du ménage</DialogTitle>
          <DialogDescription>
            {currentTask.property}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Informations principales</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut:</span>
                <span>{getStatusBadge(currentTask.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out:</span>
                <span>{currentTask.checkoutTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in:</span>
                <span>{currentTask.checkinTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agent:</span>
                <span>{currentTask.cleaningAgent || "Non assigné"}</span>
              </div>
              {currentTask.startTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Démarré à:</span>
                  <span>{currentTask.startTime}</span>
                </div>
              )}
              {currentTask.endTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terminé à:</span>
                  <span>{currentTask.endTime}</span>
                </div>
              )}
              {currentTask.comments && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Commentaires:</span>
                  <div className="border p-3 rounded-lg mt-1 bg-muted">
                    {currentTask.comments}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-1 self-end"
                    onClick={onEditComments}
                  >
                    Modifier
                  </Button>
                </div>
              )}
              {!currentTask.comments && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commentaires:</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onEditComments}
                  >
                    Ajouter
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Détails</h3>
            <div className="space-y-3">
              {currentTask.linens && currentTask.linens.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Linge et literie:</p>
                  <div className="flex flex-wrap gap-1">
                    {currentTask.linens.map((item: string, i: number) => (
                      <Badge key={i} variant="outline" className="rounded-full">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {currentTask.consumables && currentTask.consumables.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Consommables:</p>
                  <div className="flex flex-wrap gap-1">
                    {currentTask.consumables.map((item: string, i: number) => (
                      <Badge key={i} variant="outline" className="rounded-full bg-green-50">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
