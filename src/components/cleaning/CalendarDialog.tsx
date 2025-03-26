
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onSelect: (date: Date | undefined) => void; // Changed from onDateChange to onSelect
}

export const CalendarDialog = ({
  open,
  onOpenChange,
  selectedDate,
  onSelect
}: CalendarDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sélectionner une date</DialogTitle>
          <DialogDescription>
            Choisissez une date pour voir les ménages prévus
          </DialogDescription>
        </DialogHeader>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          locale={fr}
          className="mx-auto"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
