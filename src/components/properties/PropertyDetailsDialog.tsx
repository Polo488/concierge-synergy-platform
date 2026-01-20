
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from '@/components/ui/tabs';
import { Property } from '@/utils/propertyUtils';
import { MaintenanceTask } from '@/types/maintenance';
import { CleaningTask, CleaningIssue } from '@/types/cleaning';
import { MapPin, Home, Key, Camera, Wrench, Sparkles } from 'lucide-react';
import { PropertyInfoTab } from './details/PropertyInfoTab';
import { PropertyEquipmentTab } from './details/PropertyEquipmentTab';
import { PropertyAccessTab } from './details/PropertyAccessTab';
import { PropertyPhotosTab } from './details/PropertyPhotosTab';
import { PropertyPlatformsTab } from './details/PropertyPlatformsTab';
import { PropertyMaintenanceTab } from './details/PropertyMaintenanceTab';
import { PropertyRepasseTab, RepasseEvent } from './details/PropertyRepasseTab';
import { PropertyBannerNote } from './details/PropertyBannerNote';

interface PropertyDetailsDialogProps {
  property: Property | null;
  maintenanceHistory: MaintenanceTask[];
  repasseEvents?: RepasseEvent[];
  onClose: () => void;
  onViewTask?: (task: CleaningTask) => void;
  onViewIssue?: (issue: CleaningIssue) => void;
  onUpdateProperty?: (property: Property) => void;
}

export const PropertyDetailsDialog = ({ 
  property, 
  maintenanceHistory, 
  repasseEvents = [],
  onClose,
  onViewTask,
  onViewIssue,
  onUpdateProperty,
}: PropertyDetailsDialogProps) => {
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState('Toutes');
  const [localProperty, setLocalProperty] = useState<Property | null>(property);
  
  // Sync local state when property prop changes
  useEffect(() => {
    setLocalProperty(property);
  }, [property]);
  
  if (!property || !localProperty) return null;

  const handleBannerNoteSave = (note: string) => {
    const updatedProperty = {
      ...localProperty,
      internalBannerNote: note,
      internalBannerNoteUpdatedAt: new Date().toISOString(),
      internalBannerNoteUpdatedBy: 'Utilisateur actuel', // In real app, get from auth context
    };
    setLocalProperty(updatedProperty);
    onUpdateProperty?.(updatedProperty);
  };
  
  // Filter maintenance tasks for this property
  const getPropertyMaintenanceHistory = () => {
    return maintenanceHistory.filter(task => task.propertyId === property.id);
  };

  // Filter repasse events for this property
  const getPropertyRepasseEvents = (): RepasseEvent[] => {
    return repasseEvents.filter(event => event.task.property === property.id || event.task.property === property.name);
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

        <PropertyBannerNote
          note={localProperty.internalBannerNote}
          updatedAt={localProperty.internalBannerNoteUpdatedAt}
          updatedBy={localProperty.internalBannerNoteUpdatedBy}
          onSave={handleBannerNoteSave}
          canEdit={true}
        />

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-7">
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
            <TabsTrigger value="repasse" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> Repasse
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
          <PropertyRepasseTab 
            propertyId={property.id}
            repasseEvents={getPropertyRepasseEvents()}
            onViewTask={onViewTask}
            onViewIssue={onViewIssue}
          />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
