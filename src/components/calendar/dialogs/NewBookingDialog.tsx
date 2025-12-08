
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { CalendarProperty, BookingChannel, CalendarBooking } from '@/types/calendar';
import { CHANNEL_NAMES } from '@/types/calendar';

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: CalendarProperty[];
  preselectedPropertyId?: number;
  preselectedDate?: Date;
  onSubmit: (booking: Omit<CalendarBooking, 'id'>) => void;
}

export const NewBookingDialog: React.FC<NewBookingDialogProps> = ({
  open,
  onOpenChange,
  properties,
  preselectedPropertyId,
  preselectedDate,
  onSubmit,
}) => {
  const [propertyId, setPropertyId] = useState<number | null>(preselectedPropertyId || null);
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [checkIn, setCheckIn] = useState<Date | undefined>(preselectedDate);
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [channel, setChannel] = useState<BookingChannel>('direct');
  const [nightlyRate, setNightlyRate] = useState<number | undefined>();
  const [notes, setNotes] = useState('');

  // Update when preselected values change
  useEffect(() => {
    if (preselectedPropertyId) setPropertyId(preselectedPropertyId);
    if (preselectedDate) setCheckIn(preselectedDate);
  }, [preselectedPropertyId, preselectedDate]);

  // Set nightly rate from property
  useEffect(() => {
    if (propertyId) {
      const property = properties.find(p => p.id === propertyId);
      if (property) {
        setNightlyRate(property.pricePerNight);
      }
    }
  }, [propertyId, properties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId || !guestName || !checkIn || !checkOut) return;

    onSubmit({
      propertyId,
      guestName,
      email,
      phone,
      guestsCount,
      checkIn,
      checkOut,
      channel,
      nightlyRate,
      notes,
      status: 'confirmed',
    });

    // Reset form
    setGuestName('');
    setEmail('');
    setPhone('');
    setGuestsCount(1);
    setCheckIn(undefined);
    setCheckOut(undefined);
    setChannel('direct');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle réservation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property */}
          <div className="space-y-2">
            <Label htmlFor="property">Logement *</Label>
            <Select
              value={propertyId?.toString() || ''}
              onValueChange={(val) => setPropertyId(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un logement" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guest info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Nom du voyageur *</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestsCount">Nb voyageurs</Label>
              <Input
                id="guestsCount"
                type="number"
                min={1}
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date d'arrivée *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkIn && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, 'dd/MM/yyyy') : 'Sélectionner'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Date de départ *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, 'dd/MM/yyyy') : 'Sélectionner'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => checkIn ? date <= checkIn : false}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Channel & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Canal</Label>
              <Select value={channel} onValueChange={(val) => setChannel(val as BookingChannel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHANNEL_NAMES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nightlyRate">Prix/nuit (€)</Label>
              <Input
                id="nightlyRate"
                type="number"
                min={0}
                value={nightlyRate || ''}
                onChange={(e) => setNightlyRate(parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={!propertyId || !guestName || !checkIn || !checkOut}
            >
              Créer la réservation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
