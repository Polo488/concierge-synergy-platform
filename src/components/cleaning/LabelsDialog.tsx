
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer } from "lucide-react";
import { CleaningTask } from "@/types/cleaning";

interface LabelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labelType: "standard" | "detailed" | "qrcode";
  onLabelTypeChange: (type: "standard" | "detailed" | "qrcode") => void; // Added onLabelTypeChange
  selectedTasks: CleaningTask[];
  onPrint: () => void;
}

export const LabelsDialog = ({
  open,
  onOpenChange,
  labelType,
  onLabelTypeChange,
  selectedTasks,
  onPrint
}: LabelsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Générer des étiquettes</DialogTitle>
          <DialogDescription>
            Sélectionnez les ménages pour lesquels vous souhaitez générer des étiquettes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type d'étiquette</label>
            <Select value={labelType} onValueChange={(value: any) => onLabelTypeChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="detailed">Détaillée</SelectItem>
                <SelectItem value="qrcode">QR Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Ménages sélectionnés</label>
              <span className="text-xs text-muted-foreground">
                {selectedTasks.length} sélectionné(s)
              </span>
            </div>
            
            <div className="border rounded-md h-64 overflow-y-auto p-2">
              {selectedTasks.length > 0 ? (
                <ul className="space-y-1">
                  {selectedTasks.map((task) => (
                    <li key={task.id} className="text-sm py-1 px-2 border-b last:border-b-0">
                      {task.property}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Aucun ménage sélectionné
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onPrint} className="gap-1" disabled={selectedTasks.length === 0}>
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
