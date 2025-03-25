
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CleaningTask } from "@/types/cleaning";

interface ProblemReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: CleaningTask | null;
  problemDescription: string;
  setProblemDescription: (value: string) => void;
  onReport: () => void;
}

export const ProblemReportDialog = ({
  open,
  onOpenChange,
  currentTask,
  problemDescription,
  setProblemDescription,
  onReport
}: ProblemReportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un problème</DialogTitle>
          <DialogDescription>
            Décrivez le problème rencontré pendant le ménage de {currentTask?.property}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Décrivez le problème..."
              className="h-32"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button variant="destructive" onClick={onReport}>Signaler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
