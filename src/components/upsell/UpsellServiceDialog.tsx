
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyUpsellItem } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';

interface UpsellServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (service: PropertyUpsellItem) => void;
  service?: PropertyUpsellItem;
}

export function UpsellServiceDialog({ open, onOpenChange, onSave, service }: UpsellServiceDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const isEditing = !!service;

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice((service.price / 100).toString());
    } else {
      setName('');
      setPrice('');
    }
  }, [service, open]);

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
      sold: service?.sold || 0
    };

    onSave(updatedService);
    onOpenChange(false);
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
        </div>
        <DialogFooter>
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
