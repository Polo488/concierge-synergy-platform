
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { useState } from "react";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  selectedDateRange?: DateRange;
  mode?: "single" | "range" | "multiple";
  onSelect?: (date: Date | undefined) => void;
  onRangeSelect?: (range: DateRange | undefined) => void;
}

export const CalendarDialog = ({
  open,
  onOpenChange,
  selectedDate,
  selectedDateRange,
  mode = "single",
  onSelect,
  onRangeSelect
}: CalendarDialogProps) => {
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(selectedDateRange);
  
  const handleSelect = (value: Date | DateRange | undefined) => {
    if (mode === "single" && onSelect && value instanceof Date) {
      onSelect(value);
    } else if (mode === "range" && onRangeSelect && !(value instanceof Date)) {
      setInternalRange(value);
      onRangeSelect(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "single" ? "Sélectionner une date" : "Sélectionner une période"}
          </DialogTitle>
          <DialogDescription>
            {mode === "single" 
              ? "Choisissez une date pour voir les ménages prévus" 
              : "Choisissez une période pour voir les logements disponibles"}
          </DialogDescription>
        </DialogHeader>
        
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect as (date: Date | undefined) => void}
            locale={fr}
            className="mx-auto"
          />
        ) : mode === "range" ? (
          <Calendar
            mode="range"
            selected={internalRange}
            onSelect={handleSelect as (date: DateRange | undefined) => void}
            locale={fr}
            className="mx-auto"
            numberOfMonths={2}
          />
        ) : (
          <Calendar
            mode="multiple"
            selected={[]}
            onSelect={() => {}}
            locale={fr}
            className="mx-auto"
          />
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          {mode === "range" && (
            <Button 
              onClick={() => {
                if (onRangeSelect && internalRange?.from && internalRange?.to) {
                  onRangeSelect(internalRange);
                  onOpenChange(false);
                }
              }}
              disabled={!internalRange?.from || !internalRange?.to}
            >
              Appliquer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
