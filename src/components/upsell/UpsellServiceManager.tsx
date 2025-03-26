
import { useState } from 'react';
import { PropertyUpsellItem } from '@/types/property';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Plus } from 'lucide-react';
import { UpsellServiceDialog } from './UpsellServiceDialog';
import { useToast } from '@/components/ui/use-toast';
import { useCalendarData } from '@/hooks/useCalendarData';
import { ServiceTable } from './ServiceTable';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { RegisterSaleDialog } from './RegisterSaleDialog';

interface UpsellServiceManagerProps {
  services: PropertyUpsellItem[];
  onServiceUpdate: (services: PropertyUpsellItem[]) => void;
}

export function UpsellServiceManager({ services, onServiceUpdate }: UpsellServiceManagerProps) {
  const { toast } = useToast();
  const { properties, bookings } = useCalendarData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registerSaleDialogOpen, setRegisterSaleDialogOpen] = useState(false);
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

  const handleRegisterSaleClick = (service: PropertyUpsellItem) => {
    setSelectedService(service);
    setRegisterSaleDialogOpen(true);
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

  const handleRegisterSale = (serviceId: number, bookingId?: string) => {
    const updatedServices = services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          sold: service.sold + 1,
          bookingId: bookingId || service.bookingId
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
    
    setRegisterSaleDialogOpen(false);
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
        <ServiceTable 
          services={services}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRegisterSale={handleRegisterSaleClick}
          onCopyLink={copyLinkToClipboard}
        />
      </DashboardCard>

      <UpsellServiceDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveService}
        service={selectedService}
      />

      <RegisterSaleDialog
        open={registerSaleDialogOpen}
        onOpenChange={setRegisterSaleDialogOpen}
        service={selectedService}
        onRegisterSale={handleRegisterSale}
      />

      <DeleteServiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedService={selectedService}
        onDelete={handleDeleteService}
      />
    </>
  );
}
