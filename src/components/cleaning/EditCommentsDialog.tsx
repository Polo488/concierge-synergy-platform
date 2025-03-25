
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CleaningTask } from "@/types/cleaning";

interface EditCommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: CleaningTask | null;
  taskComments: string;
  setTaskComments: (value: string) => void;
  onSaveComments: () => void;
}

export const EditCommentsDialog = ({
  open,
  onOpenChange,
  currentTask,
  taskComments,
  setTaskComments,
  onSaveComments
}: EditCommentsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier les commentaires</DialogTitle>
          <DialogDescription>
            Modifiez les commentaires pour {currentTask?.property}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaires</label>
            <Input
              value={taskComments}
              onChange={(e) => setTaskComments(e.target.value)}
              placeholder="Instructions spéciales..."
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onSaveComments}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
