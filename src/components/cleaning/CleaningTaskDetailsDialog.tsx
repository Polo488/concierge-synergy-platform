import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CleaningTask } from "@/types/cleaning";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface CleaningTaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: CleaningTask | null;
  getStatusBadge: (status: string) => JSX.Element | null;
  onEditComments: () => void;
  onUpdateCheckTimes: (checkoutTime: string, checkinTime: string) => void;
  onReportIssue?: (task: CleaningTask) => void;
}

export const CleaningTaskDetailsDialog = ({
  open,
  onOpenChange,
  currentTask,
  getStatusBadge,
  onEditComments,
  onUpdateCheckTimes,
  onReportIssue
}: CleaningTaskDetailsDialogProps) => {
  const [isEditingTimes, setIsEditingTimes] = useState(false);
  const [checkoutTime, setCheckoutTime] = useState("");
  const [checkinTime, setCheckinTime] = useState("");

  // Initialize editing state when dialog opens with a new task
  if (currentTask && open && (checkoutTime !== currentTask.checkoutTime || checkinTime !== currentTask.checkinTime)) {
    setCheckoutTime(currentTask.checkoutTime || "");
    setCheckinTime(currentTask.checkinTime || "");
  }

  const handleStartEditingTimes = () => {
    if (currentTask) {
      setCheckoutTime(currentTask.checkoutTime || "");
      setCheckinTime(currentTask.checkinTime || "");
      setIsEditingTimes(true);
    }
  };

  const handleSaveTimes = () => {
    onUpdateCheckTimes(checkoutTime, checkinTime);
    setIsEditingTimes(false);
  };

  const handleCancelEditingTimes = () => {
    if (currentTask) {
      setCheckoutTime(currentTask.checkoutTime || "");
      setCheckinTime(currentTask.checkinTime || "");
    }
    setIsEditingTimes(false);
  };

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
              
              {!isEditingTimes ? (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Heures:</span>
                  <div className="flex items-center gap-2">
                    <span>Check-out: {currentTask.checkoutTime}</span>
                    <span>•</span>
                    <span>Check-in: {currentTask.checkinTime}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-7 w-7 p-0"
                      onClick={handleStartEditingTimes}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Check-out:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={checkoutTime}
                        onChange={(e) => setCheckoutTime(e.target.value)}
                        className="w-32 h-8"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Check-in:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={checkinTime}
                        onChange={(e) => setCheckinTime(e.target.value)}
                        className="w-32 h-8"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-green-600"
                        onClick={handleSaveTimes}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600"
                        onClick={handleCancelEditingTimes}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
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
        
        <DialogFooter className="gap-2 sm:gap-0">
          {currentTask.status === 'completed' && onReportIssue && (
            <Button 
              variant="destructive"
              className="mr-auto"
              onClick={() => {
                onReportIssue(currentTask);
                onOpenChange(false);
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Signaler un problème
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
