
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CleaningTask } from "@/types/cleaning";

interface CleaningAgentAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTask: CleaningTask | null;
  selectedAgent: string;
  setSelectedAgent: (value: string) => void;
  cleaningAgents: string[];
  onAssign: () => void;
}

export const CleaningAgentAssignDialog = ({
  open,
  onOpenChange,
  currentTask,
  selectedAgent,
  setSelectedAgent,
  cleaningAgents,
  onAssign
}: CleaningAgentAssignDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assigner un agent</DialogTitle>
          <DialogDescription>
            Choisissez un agent de ménage pour {currentTask?.property}
          </DialogDescription>
        </DialogHeader>
        
        <Select value={selectedAgent || "non_assigne"} onValueChange={setSelectedAgent}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="non_assigne">Non assigné</SelectItem>
            {cleaningAgents.map((agent) => (
              <SelectItem key={agent} value={agent}>
                {agent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onAssign}>Assigner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
