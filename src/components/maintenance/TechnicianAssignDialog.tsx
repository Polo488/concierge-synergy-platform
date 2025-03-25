
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface TechnicianAssignDialogProps {
  taskId: string | number;
  onSubmit: (taskId: string | number, technicianName: string, scheduledDate?: string, notes?: string) => void;
  onCancel: () => void;
}

const TechnicianAssignDialog = ({ taskId, onSubmit, onCancel }: TechnicianAssignDialogProps) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState<string>("");
  
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
    
    const formattedDate = scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : undefined;
    onSubmit(taskId, selectedTechnician, formattedDate, notes);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Assigner un technicien</DialogTitle>
          <DialogDescription>
            Choisissez un technicien pour cette intervention et planifiez la date
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
          
          <div className="space-y-2">
            <Label htmlFor="scheduled-date">Date de l'intervention (optionnel)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="scheduled-date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "dd MMMM yyyy", { locale: fr }) : 
                    <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  locale={fr}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Commentaires (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Ajouter des détails ou instructions supplémentaires..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
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
