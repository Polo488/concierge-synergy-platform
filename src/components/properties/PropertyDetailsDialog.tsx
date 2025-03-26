
import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from '@/components/ui/tabs';
import { Property } from '@/utils/propertyUtils';
import { MaintenanceTask } from '@/types/maintenance';
import { MapPin, Home, Key, Camera, Wrench } from 'lucide-react';
import { PropertyInfoTab } from './details/PropertyInfoTab';
import { PropertyEquipmentTab } from './details/PropertyEquipmentTab';
import { PropertyAccessTab } from './details/PropertyAccessTab';
import { PropertyPhotosTab } from './details/PropertyPhotosTab';
import { PropertyPlatformsTab } from './details/PropertyPlatformsTab';
import { PropertyMaintenanceTab } from './details/PropertyMaintenanceTab';

interface PropertyDetailsDialogProps {
  property: Property | null;
  maintenanceHistory: MaintenanceTask[];
  onClose: () => void;
}

export const PropertyDetailsDialog = ({ 
  property, 
  maintenanceHistory, 
  onClose 
}: PropertyDetailsDialogProps) => {
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState('Toutes');
  
  if (!property) return null;
  
  // Filter maintenance tasks for this property
  const getPropertyMaintenanceHistory = () => {
    return maintenanceHistory.filter(task => task.propertyId === property.id);
  };

  // Filter photos by category
  const filteredPhotos = property.photos.filter(photo => 
    selectedPhotoCategory === 'Toutes' || photo.category === selectedPhotoCategory
  );

  return (
    <Dialog open={!!property} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-normal">
              N°{property.number}
            </span>
            {property.name}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {property.address}
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-1">
              <Key className="h-4 w-4" /> Accès
            </TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="platforms">Plateformes</TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-1">
              <Wrench className="h-4 w-4" /> Maintenance
            </TabsTrigger>
          </TabsList>
          
          <PropertyInfoTab property={property} />
          <PropertyEquipmentTab property={property} />
          <PropertyAccessTab property={property} />
          <PropertyPhotosTab 
            photos={filteredPhotos}
            selectedCategory={selectedPhotoCategory}
            onCategoryChange={setSelectedPhotoCategory}
            allCategories={Array.from(new Set(property.photos.map(p => p.category)))}
          />
          <PropertyPlatformsTab property={property} />
          <PropertyMaintenanceTab maintenance={getPropertyMaintenanceHistory()} />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
