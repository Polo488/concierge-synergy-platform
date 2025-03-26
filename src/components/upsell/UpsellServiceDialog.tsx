
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyUpsellItem } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import { Link as LinkIcon, Briefcase, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCalendarData } from '@/hooks/useCalendarData';
import { format } from 'date-fns';

interface UpsellServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (service: PropertyUpsellItem) => void;
  service?: PropertyUpsellItem;
  onRegisterSale?: (serviceId: number) => void;
}

export function UpsellServiceDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  service, 
  onRegisterSale 
}: UpsellServiceDialogProps) {
  const { toast } = useToast();
  const { properties, bookings } = useCalendarData();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salesLink, setSalesLink] = useState('');
  const [propertyId, setPropertyId] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');
  const isEditing = !!service;

  // Get filtered bookings based on selected property
  const filteredBookings = bookings.filter(b => 
    !propertyId || b.propertyId.toString() === propertyId
  );

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice((service.price / 100).toString());
      setSalesLink(service.salesLink || '');
      setPropertyId(service.propertyId || '');
      setBookingId(service.bookingId || '');
    } else {
      setName('');
      setPrice('');
      setSalesLink('');
      setPropertyId('');
      setBookingId('');
    }
  }, [service, open]);

  // Reset booking selection when property changes
  useEffect(() => {
    if (propertyId && bookingId) {
      const bookingExists = filteredBookings.some(b => b.id.toString() === bookingId);
      if (!bookingExists) {
        setBookingId('');
      }
    }
  }, [propertyId, filteredBookings, bookingId]);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir le nom du service",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Prix invalide",
        description: "Veuillez saisir un prix valide",
        variant: "destructive",
      });
      return;
    }

    const updatedService: PropertyUpsellItem = {
      id: service?.id || Math.floor(Math.random() * 10000),
      name: name.trim(),
      price: Math.round(priceValue * 100),
      sold: service?.sold || 0,
      salesLink: salesLink.trim() || undefined,
      propertyId: propertyId || undefined,
      bookingId: bookingId || undefined
    };

    onSave(updatedService);
    onOpenChange(false);
  };

  const handleRegisterSale = () => {
    if (service && onRegisterSale) {
      onRegisterSale(service.id);
      onOpenChange(false);
    }
  };

  // Helper function to get property name by id
  const getPropertyName = (id: string) => {
    const property = properties.find(p => p.id.toString() === id);
    return property ? property.name : 'Inconnu';
  };

  // Helper function to format booking details
  const formatBookingDetails = (booking: any) => {
    if (!booking) return 'Inconnu';
    return `${booking.guestName} (${format(booking.checkIn, 'dd/MM/yyyy')} - ${format(booking.checkOut, 'dd/MM/yyyy')})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le service' : 'Ajouter un service'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Petit-déjeuner"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 15"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property">Logement associé</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un logement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="booking">Réservation associée</Label>
            <Select 
              value={bookingId} 
              onValueChange={setBookingId}
              disabled={!propertyId}
            >
              <SelectTrigger>
                <SelectValue placeholder={propertyId ? "Sélectionner une réservation" : "Sélectionnez d'abord un logement"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                {filteredBookings.map((booking) => (
                  <SelectItem key={booking.id} value={booking.id.toString()}>
                    {booking.guestName} ({format(booking.checkIn, 'dd/MM/yyyy')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salesLink">Lien de vente</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="salesLink"
                value={salesLink}
                onChange={(e) => setSalesLink(e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              {salesLink && (
                <a 
                  href={salesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-transparent hover:bg-secondary text-muted-foreground"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isEditing && onRegisterSale && (
            <Button 
              variant="outline" 
              onClick={handleRegisterSale}
              className="sm:mr-auto"
            >
              Enregistrer une vente
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
