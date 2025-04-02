
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Euro } from 'lucide-react';
import { DateRange } from '@/hooks/calendar/types';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('availability.title')}</DialogTitle>
          <DialogDescription>
            {t('availability.description')}
          </DialogDescription>
        </DialogHeader>
        
        {dateRange?.from && dateRange?.to ? (
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              {t('availability.period')} {format(dateRange.from, 'dd/MM/yyyy')} au {format(dateRange.to, 'dd/MM/yyyy')} 
              ({differenceInDays(dateRange.to, dateRange.from)} {t('availability.nights')})
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
                            <span>{property.capacity} {t('property.persons')}.</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Euro className="h-3.5 w-3.5" />
                            <span>{property.pricePerNight}€/nuit</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{t('availability.available')}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">{t('availability.no.properties')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">{t('availability.select.date.range')}</p>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t('close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
