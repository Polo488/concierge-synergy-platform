
import { useState } from 'react';
import { PropertyUpsellItem } from '@/types/property';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Plus, Pencil, Trash2, Link, ExternalLink, ShoppingCart } from 'lucide-react';
import { UpsellServiceDialog } from './UpsellServiceDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

interface UpsellServiceManagerProps {
  services: PropertyUpsellItem[];
  onServiceUpdate: (services: PropertyUpsellItem[]) => void;
}

export function UpsellServiceManager({ services, onServiceUpdate }: UpsellServiceManagerProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<PropertyUpsellItem | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedService(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (service: PropertyUpsellItem) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleDeleteClick = (service: PropertyUpsellItem) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const handleSaveService = (updatedService: PropertyUpsellItem) => {
    let updatedServices: PropertyUpsellItem[];
    
    if (selectedService) {
      // Edit existing service
      updatedServices = services.map(service => 
        service.id === selectedService.id ? updatedService : service
      );
      toast({
        title: "Service modifié",
        description: `Le service "${updatedService.name}" a été mis à jour.`,
      });
    } else {
      // Add new service
      updatedServices = [...services, updatedService];
      toast({
        title: "Service ajouté",
        description: `Le service "${updatedService.name}" a été ajouté.`,
      });
    }
    
    onServiceUpdate(updatedServices);
  };

  const handleDeleteService = () => {
    if (!selectedService) return;
    
    const updatedServices = services.filter(service => service.id !== selectedService.id);
    onServiceUpdate(updatedServices);
    
    toast({
      title: "Service supprimé",
      description: `Le service "${selectedService.name}" a été supprimé.`,
    });
    
    setDeleteDialogOpen(false);
  };

  const handleRegisterSale = (serviceId: number) => {
    const updatedServices = services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          sold: service.sold + 1
        };
      }
      return service;
    });
    
    onServiceUpdate(updatedServices);
    
    const service = services.find(s => s.id === serviceId);
    if (service) {
      toast({
        title: "Vente enregistrée",
        description: `Une vente du service "${service.name}" a été enregistrée.`,
      });
    }
  };
  
  const copyLinkToClipboard = (service: PropertyUpsellItem) => {
    if (service.salesLink) {
      navigator.clipboard.writeText(service.salesLink);
      toast({
        title: "Lien copié",
        description: "Le lien de vente a été copié dans le presse-papier."
      });
    }
  };

  return (
    <>
      <DashboardCard 
        title="Gestion des services" 
        actions={
          <Button onClick={handleAddClick} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Ajouter un service
          </Button>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du service</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Vendu</TableHead>
              <TableHead>Lien de vente</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{(service.price / 100).toLocaleString('fr-FR')} €</TableCell>
                  <TableCell>{service.sold} fois</TableCell>
                  <TableCell>
                    {service.salesLink ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyLinkToClipboard(service)}
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
                        onClick={() => handleRegisterSale(service.id)}
                        title="Enregistrer une vente"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditClick(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  Aucun service disponible. Cliquez sur "Ajouter un service" pour commencer.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DashboardCard>

      <UpsellServiceDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveService}
        service={selectedService}
        onRegisterSale={handleRegisterSale}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le service "{selectedService?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
