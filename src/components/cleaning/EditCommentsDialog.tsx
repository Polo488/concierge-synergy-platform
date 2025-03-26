
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Changed from Input to Textarea
import { CleaningTask } from "@/types/cleaning";

interface EditCommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments: string; // Changed from currentTask
  onCommentsChange: (value: string) => void; // Changed from setTaskComments
  onSave: () => void; // Changed from onSaveComments
}

export const EditCommentsDialog = ({
  open,
  onOpenChange,
  comments,
  onCommentsChange,
  onSave
}: EditCommentsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier les commentaires</DialogTitle>
          <DialogDescription>
            Modifiez les commentaires pour ce ménage
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaires</label>
            <Textarea
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              placeholder="Instructions spéciales..."
              className="min-h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
