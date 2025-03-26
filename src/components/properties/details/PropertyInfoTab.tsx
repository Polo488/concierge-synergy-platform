
import { useState } from 'react';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';
import { PropertyDetailsSection } from './sections/PropertyDetailsSection';
import { OwnerSection } from './sections/OwnerSection';
import { LinenConsumablesSection } from './sections/LinenConsumablesSection';
import { AmenitiesSection } from './sections/AmenitiesSection';
import { BedSizesSection } from './sections/BedSizesSection';
import { UpsellsSection } from './sections/UpsellsSection';
import { ResidenceTypeSection } from './sections/ResidenceTypeSection';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface PropertyInfoTabProps {
  property: Property;
}

export const PropertyInfoTab = ({ property }: PropertyInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState<Partial<Property>>({
    type: property.type,
    classification: property.classification,
    size: property.size,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    commission: property.commission,
  });
  const [bedSizes, setBedSizes] = useState<string[]>(property.bedSizes || []);

  const handleUpdateBedSizes = (newBedSizes: string[]) => {
    setBedSizes(newBedSizes);
  };

  const handleSaveBedSizes = () => {
    toast.success("Tailles des lits mises à jour avec succès");
  };

  return (
    <TabsContent value="info" className="space-y-4 mt-4">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <PropertyDetailsSection 
              property={property}
              isEditing={isEditing}
              editedProperty={editedProperty}
              setIsEditing={setIsEditing}
              setEditedProperty={setEditedProperty}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <OwnerSection property={property} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <ResidenceTypeSection property={property} />
        </CardContent>
      </Card>
      
      <BedSizesSection 
        bedSizes={bedSizes}
        isEditing={isEditing}
        onSave={handleSaveBedSizes}
        onCancel={() => setBedSizes(property.bedSizes || [])}
        onUpdateBedSizes={handleUpdateBedSizes}
      />
      
      <LinenConsumablesSection property={property} />
      
      <AmenitiesSection property={property} />
      
      <UpsellsSection property={property} />
    </TabsContent>
  );
};
