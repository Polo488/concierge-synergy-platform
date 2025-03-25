
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TechnicianAssignDialogProps {
  taskId: string | number;
  onSubmit: (taskId: string | number, technicianName: string) => void;
  onCancel: () => void;
}

const TechnicianAssignDialog = ({ taskId, onSubmit, onCancel }: TechnicianAssignDialogProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  
  // Mock technicians list
  const technicians = [
    "Martin Dupont",
    "Sophie Moreau",
    "Lucas Bernard",
    "Julie Laurent",
    "Thomas Petit"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTechnician) {
      toast.error("Veuillez sélectionner un technicien");
      return;
    }
    
    onSubmit(taskId, selectedTechnician);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Assigner un technicien</DialogTitle>
          <DialogDescription>
            Choisissez un technicien pour cette intervention
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="technician">Technicien</Label>
            <Select 
              value={selectedTechnician} 
              onValueChange={setSelectedTechnician}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un technicien" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Assigner</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default TechnicianAssignDialog;
