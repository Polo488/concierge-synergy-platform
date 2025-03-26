
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyUpsellItem } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import { Link as LinkIcon } from 'lucide-react';

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
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salesLink, setSalesLink] = useState('');
  const isEditing = !!service;

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice((service.price / 100).toString());
      setSalesLink(service.salesLink || '');
    } else {
      setName('');
      setPrice('');
      setSalesLink('');
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
      sold: service?.sold || 0,
      salesLink: salesLink.trim() || undefined
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
