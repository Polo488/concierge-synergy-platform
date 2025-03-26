
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Euro } from 'lucide-react';
import { DateRange } from '@/hooks/calendar/types';

interface AvailabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateRange?: DateRange;
  availableProperties: any[];
}

export const AvailabilityDialog = ({
  open,
  onOpenChange,
  dateRange,
  availableProperties
}: AvailabilityDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Logements disponibles</DialogTitle>
        </DialogHeader>
        
        {dateRange?.from && dateRange?.to && (
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Période sélectionnée: {format(dateRange.from, 'dd/MM/yyyy')} au {format(dateRange.to, 'dd/MM/yyyy')} 
              ({differenceInDays(dateRange.to, dateRange.from)} nuits)
            </p>
            
            {availableProperties.length > 0 ? (
              <div className="space-y-2">
                {availableProperties.map(property => (
                  <div 
                    key={property.id} 
                    className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="font-medium">{property.name}</span>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{property.capacity} pers.</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Euro className="h-3.5 w-3.5" />
                            <span>{property.pricePerNight}€/nuit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Aucun logement disponible pour cette période</p>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
