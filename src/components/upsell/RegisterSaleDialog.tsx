
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PropertyUpsellItem } from '@/types/property';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useCalendarData } from '@/hooks/useCalendarData';
import { ShoppingCart, Calendar } from 'lucide-react';

interface RegisterSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: PropertyUpsellItem;
  onRegisterSale: (serviceId: number, bookingId?: string) => void;
}

export function RegisterSaleDialog({
  open,
  onOpenChange,
  service,
  onRegisterSale
}: RegisterSaleDialogProps) {
  const [bookingId, setBookingId] = useState<string>('');
  const { properties, bookings } = useCalendarData();

  useEffect(() => {
    if (open && service) {
      // Initialize with the current booking ID if it exists
      setBookingId(service.bookingId || '');
    }
  }, [open, service]);

  if (!service) return null;

  // Get property name
  const getPropertyName = (propertyId?: string) => {
    if (!propertyId) return "Non assigné";
    const property = properties.find(p => p.id.toString() === propertyId);
    return property ? property.name : "Non assigné";
  };

  // Filter bookings that are related to the property of the service (if any)
  const filteredBookings = service.propertyId
    ? bookings.filter(b => b.propertyId.toString() === service.propertyId)
    : [];

  const handleRegisterSale = () => {
    onRegisterSale(service.id, bookingId || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enregistrer une vente</DialogTitle>
          <DialogDescription>
            Enregistrez une vente pour le service "{service.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Service :</span>
              <span>{service.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Prix :</span>
              <span>{(service.price / 100).toLocaleString('fr-FR')} €</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Logement :</span>
              <span>{getPropertyName(service.propertyId)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking">Réservation associée</Label>
            <Select 
              value={bookingId} 
              onValueChange={setBookingId}
              disabled={!service.propertyId || filteredBookings.length === 0}
            >
              <SelectTrigger>
                <SelectValue 
                  placeholder={
                    !service.propertyId 
                      ? "Ce service n'est pas associé à un logement" 
                      : filteredBookings.length === 0 
                        ? "Aucune réservation disponible pour ce logement" 
                        : "Sélectionner une réservation"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune réservation</SelectItem>
                {filteredBookings.map((booking) => (
                  <SelectItem key={booking.id} value={booking.id.toString()}>
                    {booking.guestName} ({format(booking.checkIn, 'dd/MM/yyyy')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {service.propertyId && filteredBookings.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Il n'y a aucune réservation pour ce logement actuellement.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleRegisterSale} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Enregistrer la vente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
