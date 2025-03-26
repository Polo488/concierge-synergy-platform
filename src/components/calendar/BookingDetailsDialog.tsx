
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking } from '@/hooks/calendar/types';

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
  if (!selectedBooking) return null;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">Terminé</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">
              Réservation #{selectedBooking.id}
            </h3>
            <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
          </div>
          
          <div>
            <p className="font-medium text-sm">Client:</p>
            <p className="mt-1">{selectedBooking.guestName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-sm">Arrivée:</p>
              <p className="mt-1">{format(selectedBooking.checkIn, 'dd/MM/yyyy')}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Départ:</p>
              <p className="mt-1">{format(selectedBooking.checkOut, 'dd/MM/yyyy')}</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium text-sm">Durée:</p>
            <p className="mt-1">
              {Math.ceil((selectedBooking.checkOut.getTime() - selectedBooking.checkIn.getTime()) / (1000 * 60 * 60 * 24))} nuits
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
