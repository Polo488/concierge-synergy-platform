
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Euro, Calendar, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import type { CalendarProperty, BookingChannel } from '@/types/calendar';
import type { SelectionRange } from '@/hooks/calendar/useMultiDaySelection';

interface PriceEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectionRange: SelectionRange | null;
  property: CalendarProperty | undefined;
  currentPrice: number;
  onSubmit: (newPrice: number, channel: BookingChannel | 'all') => Promise<void>;
}

type ChannelOption = BookingChannel | 'all';

const CHANNEL_OPTIONS: { value: ChannelOption; label: string }[] = [
  { value: 'all', label: 'Tous les canaux' },
  { value: 'airbnb', label: 'Airbnb uniquement' },
  { value: 'booking', label: 'Booking.com uniquement' },
  { value: 'vrbo', label: 'VRBO uniquement' },
  { value: 'direct', label: 'Réservations directes' },
];

export const PriceEditModal: React.FC<PriceEditModalProps> = ({
  open,
  onOpenChange,
  selectionRange,
  property,
  currentPrice,
  onSubmit,
}) => {
  const [newPrice, setNewPrice] = useState<string>(currentPrice.toString());
  const [selectedChannel, setSelectedChannel] = useState<ChannelOption>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setNewPrice(currentPrice.toString());
      setSelectedChannel('all');
      setIsSubmitting(false);
    }
  }, [open, currentPrice]);

  if (!selectionRange || !property) return null;

  const startDate = format(selectionRange.startDate, 'dd MMM yyyy', { locale: fr });
  const endDate = format(selectionRange.endDate, 'dd MMM yyyy', { locale: fr });
  const isSingleDay = startDate === endDate;
  const dayCount = Math.ceil((selectionRange.endDate.getTime() - selectionRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const handleSubmit = async () => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Veuillez entrer un prix valide');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(price, selectedChannel);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des prix');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-primary" />
            Modifier le tarif
          </DialogTitle>
          <DialogDescription>
            Définissez un nouveau prix par nuit pour la période sélectionnée
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selection summary */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{property.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {isSingleDay ? (
                  startDate
                ) : (
                  <>
                    {startDate} → {endDate}
                    <span className="text-muted-foreground ml-1">({dayCount} nuits)</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Euro className="w-4 h-4 text-muted-foreground" />
              <span>Prix actuel: <strong>{currentPrice}€</strong> / nuit</span>
            </div>
          </div>

          {/* New price input */}
          <div className="space-y-2">
            <Label htmlFor="new-price">Nouveau prix par nuit (€)</Label>
            <div className="relative">
              <Input
                id="new-price"
                type="number"
                min="0"
                step="1"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="pr-8"
                placeholder="Ex: 75"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
            </div>
          </div>

          {/* Channel selection */}
          <div className="space-y-3">
            <Label>Appliquer à</Label>
            <RadioGroup
              value={selectedChannel}
              onValueChange={(value) => setSelectedChannel(value as ChannelOption)}
              className="space-y-2"
            >
              {CHANNEL_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`channel-${option.value}`} />
                  <Label htmlFor={`channel-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Appliquer & synchroniser
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
