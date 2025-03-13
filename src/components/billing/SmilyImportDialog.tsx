
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowRightIcon, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SmilyImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (params: { startDate?: Date; endDate?: Date }) => void;
  isLoading?: boolean;
}

export function SmilyImportDialog({
  open,
  onOpenChange,
  onImport,
  isLoading = false,
}: SmilyImportDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  const handleImport = () => {
    onImport({ startDate, endDate });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importer des données SMILY</DialogTitle>
          <DialogDescription>
            Sélectionnez une période pour importer les réservations depuis SMILY (BookingSync).
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
            <div className="flex flex-col space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Date de début
              </label>
              <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "d MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setStartCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                Date de fin
              </label>
              <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "d MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Cette action importera :</p>
            <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
              <li>Toutes les réservations dans la période sélectionnée</li>
              <li>Toutes les propriétés associées</li>
              <li>Tous les clients concernés</li>
              <li>Tous les paiements liés aux réservations</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={isLoading || !startDate || !endDate}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importation en cours...
              </>
            ) : (
              'Importer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
