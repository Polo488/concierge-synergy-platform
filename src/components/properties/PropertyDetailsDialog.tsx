
import { useState, useEffect, useRef } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog';
import { 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from '@/components/ui/tabs';
import { Property } from '@/utils/propertyUtils';
import { MaintenanceTask } from '@/types/maintenance';
import { CleaningTask, CleaningIssue } from '@/types/cleaning';
import { MapPin, Key, Wrench, Sparkles, X } from 'lucide-react';
import { PropertyInfoTab } from './details/PropertyInfoTab';
import { PropertyEquipmentTab } from './details/PropertyEquipmentTab';
import { PropertyAccessTab } from './details/PropertyAccessTab';
import { PropertyPhotosTab } from './details/PropertyPhotosTab';
import { PropertyPlatformsTab } from './details/PropertyPlatformsTab';
import { PropertyMaintenanceTab } from './details/PropertyMaintenanceTab';
import { PropertyRepasseTab, RepasseEvent } from './details/PropertyRepasseTab';
import { PropertyBannerNote } from './details/PropertyBannerNote';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setLocalProperty(property);
  }, [property]);
  
  if (!property || !localProperty) return null;

  const handleBannerNoteSave = (note: string) => {
    const updatedProperty = {
      ...localProperty,
      internalBannerNote: note,
      internalBannerNoteUpdatedAt: new Date().toISOString(),
      internalBannerNoteUpdatedBy: 'Utilisateur actuel',
    };
    setLocalProperty(updatedProperty);
    onUpdateProperty?.(updatedProperty);
  };
  
  const getPropertyMaintenanceHistory = () => {
    return maintenanceHistory.filter(task => task.propertyId === property.id);
  };

  const getPropertyRepasseEvents = (): RepasseEvent[] => {
    return repasseEvents.filter(event => event.task.property === property.id || event.task.property === property.name);
  };

  const filteredPhotos = property.photos.filter(photo => 
    selectedPhotoCategory === 'Toutes' || photo.category === selectedPhotoCategory
  );

  // Mobile: custom bottom sheet
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/40 z-[499]"
          onClick={onClose}
        />
        {/* Bottom sheet */}
        <div className="fixed bottom-0 left-0 right-0 h-[92vh] bg-[hsl(var(--background))] rounded-t-[20px] z-[500] overflow-y-auto overflow-x-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-[hsl(var(--background))] z-10">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
          </div>

          {/* Header */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[11px] font-bold whitespace-nowrap flex-shrink-0">
                  N°{property.number}
                </span>
                <span className="text-lg font-bold text-foreground truncate">
                  {property.name}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-[13px] text-muted-foreground truncate">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
              <span className="truncate">{property.address}</span>
            </div>
          </div>

          {/* Banner note */}
          <div className="px-4">
            <PropertyBannerNote
              note={localProperty.internalBannerNote}
              updatedAt={localProperty.internalBannerNoteUpdatedAt}
              updatedBy={localProperty.internalBannerNoteUpdatedBy}
              onSave={handleBannerNoteSave}
              canEdit={true}
            />
          </div>

          {/* Tabs with scrollable tab list */}
          <Tabs defaultValue="info" className="flex-1 flex flex-col">
            <div className="relative">
              <TabsList className="flex w-full overflow-x-auto overflow-y-hidden bg-transparent border-b border-border p-0 h-auto rounded-none gap-0 justify-start" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                <TabsTrigger value="info" className="whitespace-nowrap flex-shrink-0 px-3.5 py-2.5 text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground bg-transparent">
                  Informations
                </TabsTrigger>
                <TabsTrigger value="equipment" className="whitespace-nowrap flex-shrink-0 px-3.5 py-2.5 text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground bg-transparent">
                  Équipements
                </TabsTrigger>
                <TabsTrigger value="access" className="whitespace-nowrap flex-shrink-0 px-3.5 py-2.5 text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground bg-transparent flex items-center gap-1">
                  <Key className="h-3.5 w-3.5" /> Accès
                </TabsTrigger>
                <TabsTrigger value="photos" className="whitespace-nowrap flex-shrink-0 px-3.5 py-2.5 text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground bg-transparent">
                  Photos
                </TabsTrigger>
                <TabsTrigger value="platforms" className="whitespace-nowrap flex-shrink-0 px-3.5 py-2.5 text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground bg-transparent">
                  Plateformes
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="whitespace-nowrap flex-shrink-0 px-3.5 py-2.5 text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground bg-transparent flex items-center gap-1">
                  <Wrench className="h-3.5 w-3.5" /> Maintenance
                </TabsTrigger>
                <TabsTrigger value="repasse" className="whitespace-nowrap flex-shrink-0 px-3.5 py-2.5 text-[13px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground bg-transparent flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Repasse
                </TabsTrigger>
              </TabsList>
              {/* Fade gradient on right edge */}
              <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-r from-transparent to-background pointer-events-none" />
            </div>
            
            <div className="flex-1 px-4 pb-8">
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
            </div>
          </Tabs>
        </div>
      </>
    );
  }

  // Desktop: standard dialog
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
