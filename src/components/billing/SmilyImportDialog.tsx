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
import { useBookingSync } from '@/hooks/useBookingSync';
import { toast } from '@/hooks/use-toast';
import { ImportedDataSummary } from '@/components/billing/ImportedDataSummary';
import { BookingSyncImportResult } from '@/types/bookingSync';

interface SmilyImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: (result: BookingSyncImportResult) => void;
}

export function SmilyImportDialog({
  open,
  onOpenChange,
  onImportSuccess,
}: SmilyImportDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  const [importedData, setImportedData] = useState<BookingSyncImportResult | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  const { 
    startImport, 
    importQuery,
    isAuthenticated,
    setIsConfiguring 
  } = useBookingSync();
  
  const handleImport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Dates manquantes",
        description: "Veuillez sélectionner une date de début et de fin.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAuthenticated) {
      toast({
        title: "Non authentifié",
        description: "Veuillez configurer vos identifiants SMILY avant d'importer des données.",
        variant: "destructive",
      });
      setIsConfiguring(true);
      onOpenChange(false);
      return;
    }
    
    try {
      setShowSummary(false);
      startImport({ startDate, endDate });
      
      // On attend que la requête soit terminée
      await importQuery.refetch();
      
      if (importQuery.isError) {
        toast({
          title: "Erreur lors de l'import",
          description: importQuery.error instanceof Error ? importQuery.error.message : "Une erreur est survenue",
          variant: "destructive",
        });
      } else if (importQuery.isSuccess && importQuery.data) {
        toast({
          title: "Import réussi",
          description: "Les données ont été importées avec succès depuis SMILY.",
        });
        
        // Set the imported data so we can display it
        setImportedData(importQuery.data);
        setShowSummary(true);
        
        if (onImportSuccess) {
          onImportSuccess(importQuery.data);
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Erreur lors de l'import",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    // When closing the dialog, reset the display state but keep the imported data
    setShowSummary(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[500px]", showSummary && importedData && "sm:max-w-[800px]")}>
        <DialogHeader>
          <DialogTitle>Importer des données SMILY</DialogTitle>
          <DialogDescription>
            {!showSummary ? 
              "Sélectionnez une période pour importer les réservations depuis SMILY (BookingSync)." :
              "L'importation a été réalisée avec succès. Voici un récapitulatif des données importées."
            }
          </DialogDescription>
        </DialogHeader>
        
        {!showSummary ? (
          <>
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
                onClick={handleCloseDialog}
                disabled={importQuery.isLoading}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={importQuery.isLoading || !startDate || !endDate}
              >
                {importQuery.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importation en cours...
                  </>
                ) : (
                  'Importer'
                )}
              </Button>
            </DialogFooter>
          </>
        ) : importedData ? (
          <>
            <ImportedDataSummary data={importedData} />
            <DialogFooter className="mt-4">
              <Button onClick={handleCloseDialog}>
                Fermer
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
