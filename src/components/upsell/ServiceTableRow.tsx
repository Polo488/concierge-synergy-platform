
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { PropertyUpsellItem } from '@/types/property';
import { Calendar, ExternalLink, Home, Link, Pencil, ShoppingCart, Trash2 } from 'lucide-react';
import { useCalendarData } from '@/hooks/useCalendarData';
import { format } from 'date-fns';

interface ServiceTableRowProps {
  service: PropertyUpsellItem;
  onEdit: (service: PropertyUpsellItem) => void;
  onDelete: (service: PropertyUpsellItem) => void;
  onRegisterSale: (service: PropertyUpsellItem) => void;
  onCopyLink: (service: PropertyUpsellItem) => void;
}

export function ServiceTableRow({
  service,
  onEdit,
  onDelete,
  onRegisterSale,
  onCopyLink
}: ServiceTableRowProps) {
  const { properties, bookings } = useCalendarData();

  // Helper function to get property name
  const getPropertyName = (propertyId?: string) => {
    if (!propertyId) return null;
    const property = properties.find(p => p.id.toString() === propertyId);
    return property ? property.name : null;
  };

  // Helper function to get booking details
  const getBookingDetails = (bookingId?: string) => {
    if (!bookingId) return null;
    const booking = bookings.find(b => b.id.toString() === bookingId);
    if (!booking) return null;
    return {
      guestName: booking.guestName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut
    };
  };

  const propertyName = getPropertyName(service.propertyId);
  const bookingDetails = getBookingDetails(service.bookingId);

  return (
    <TableRow key={service.id}>
      <TableCell className="font-medium">{service.name}</TableCell>
      <TableCell>{(service.price / 100).toLocaleString('fr-FR')} €</TableCell>
      <TableCell>{service.sold} fois</TableCell>
      <TableCell>
        <div className="space-y-1">
          {propertyName && (
            <div className="flex items-center gap-1 text-sm">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{propertyName}</span>
            </div>
          )}
          {bookingDetails && (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span title={`${format(bookingDetails.checkIn, 'dd/MM/yyyy')} - ${format(bookingDetails.checkOut, 'dd/MM/yyyy')}`}>
                {bookingDetails.guestName}
              </span>
            </div>
          )}
          {!propertyName && !bookingDetails && (
            <span className="text-muted-foreground text-sm">Non assigné</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {service.salesLink ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onCopyLink(service)}
              title="Copier le lien"
            >
              <Link className="h-4 w-4 mr-1" />
            </Button>
            <a 
              href={service.salesLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Aucun lien</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onRegisterSale(service)}
            title="Enregistrer une vente"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(service)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => onDelete(service)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
