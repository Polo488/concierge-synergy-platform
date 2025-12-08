
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  X, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Home, 
  CreditCard,
  Users,
  MessageSquare,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { CalendarBooking, CalendarProperty } from '@/types/calendar';
import { CHANNEL_COLORS, CHANNEL_NAMES, STATUS_LABELS } from '@/types/calendar';
import { ChannelIcon } from '../grid/ChannelIcon';

interface BookingDetailsSheetProps {
  booking: CalendarBooking | null;
  property?: CalendarProperty;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (booking: CalendarBooking) => void;
  onDelete?: (booking: CalendarBooking) => void;
}

export const BookingDetailsSheet: React.FC<BookingDetailsSheetProps> = ({
  booking,
  property,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
  if (!booking) return null;

  const nights = differenceInDays(booking.checkOut, booking.checkIn);
  const channelColor = CHANNEL_COLORS[booking.channel];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Détails de la réservation</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Channel & Status */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: channelColor }}
            >
              <ChannelIcon channel={booking.channel} className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium">{CHANNEL_NAMES[booking.channel]}</p>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                {STATUS_LABELS[booking.status]}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Guest Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Voyageur
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{booking.guestName}</span>
              </div>
              {booking.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${booking.email}`} className="text-primary hover:underline">
                    {booking.email}
                  </a>
                </div>
              )}
              {booking.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${booking.phone}`} className="text-primary hover:underline">
                    {booking.phone}
                  </a>
                </div>
              )}
              {booking.guestsCount && (
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.guestsCount} voyageur{booking.guestsCount > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Séjour
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Arrivée</p>
                <p className="font-medium">
                  {format(booking.checkIn, 'EEE d MMM yyyy', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Départ</p>
                <p className="font-medium">
                  {format(booking.checkOut, 'EEE d MMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{nights} nuit{nights > 1 ? 's' : ''}</span>
            </div>
          </div>

          <Separator />

          {/* Property */}
          {property && (
            <>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Logement
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    {property.thumbnail ? (
                      <img src={property.thumbnail} alt={property.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{property.name}</p>
                    {property.address && (
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Financial */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Montant
            </h4>
            <div className="space-y-2">
              {booking.nightlyRate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix par nuit</span>
                  <span>{booking.nightlyRate}€</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre de nuits</span>
                <span>{nights}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{booking.totalAmount || (booking.nightlyRate ? booking.nightlyRate * nights : '-')}€</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Notes
                </h4>
                <p className="text-sm">{booking.notes}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {onEdit && (
              <Button variant="outline" className="flex-1" onClick={() => onEdit(booking)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" className="flex-1" onClick={() => onDelete(booking)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
