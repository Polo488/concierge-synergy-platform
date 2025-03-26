
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Changed from Input to Textarea
import { CleaningTask } from "@/types/cleaning";

interface ProblemReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  description: string; // Changed from currentTask and problemDescription
  onDescriptionChange: (value: string) => void; // Changed from setProblemDescription
  onSubmit: () => void; // Changed from onReport
}

export const ProblemReportDialog = ({
  open,
  onOpenChange,
  description,
  onDescriptionChange,
  onSubmit
}: ProblemReportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un problème</DialogTitle>
          <DialogDescription>
            Décrivez le problème rencontré pendant le ménage
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Décrivez le problème..."
              className="min-h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button variant="destructive" onClick={onSubmit}>Signaler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
