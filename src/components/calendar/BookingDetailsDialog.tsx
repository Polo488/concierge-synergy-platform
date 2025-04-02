
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from '@/hooks/calendar/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: Booking | null;
}

export const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
  open,
  onOpenChange,
  selectedBooking
}) => {
  const { language, t } = useLanguage();
  
  if (!selectedBooking) return null;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">{t('status.confirmed')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">{t('status.pending')}</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">{t('status.completed')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('booking.details')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">
              {language === 'fr' ? 'Réservation' : 'Booking'} #{selectedBooking.id}
            </h3>
            <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
          </div>
          
          <div>
            <p className="font-medium text-sm">{t('booking.client')}</p>
            <p className="mt-1">{selectedBooking.guestName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-sm">{t('booking.arrival')}</p>
              <p className="mt-1">{format(selectedBooking.checkIn, 'dd/MM/yyyy')}</p>
            </div>
            <div>
              <p className="font-medium text-sm">{t('booking.departure')}</p>
              <p className="mt-1">{format(selectedBooking.checkOut, 'dd/MM/yyyy')}</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium text-sm">{t('booking.duration')}</p>
            <p className="mt-1">
              {Math.ceil((selectedBooking.checkOut.getTime() - selectedBooking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} {t('booking.nights')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t('close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
