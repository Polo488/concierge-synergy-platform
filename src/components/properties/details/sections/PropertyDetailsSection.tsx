
import { useState } from 'react';
import { Property } from '@/utils/propertyUtils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditableSection } from './EditableSection';
import { toast } from 'sonner';

interface PropertyDetailsSectionProps {
  property: Property;
  isEditing: boolean;
  editedProperty: Partial<Property>;
  setIsEditing: (value: boolean) => void;
  setEditedProperty: (value: Partial<Property>) => void;
}

export const PropertyDetailsSection = ({ 
  property,
  isEditing,
  editedProperty,
  setIsEditing,
  setEditedProperty
}: PropertyDetailsSectionProps) => {
  
  const handleInputChange = (field: string, value: string | number) => {
    setEditedProperty({
      ...editedProperty,
      [field]: value,
    });
  };
  
  const handleSave = () => {
    toast.success("Informations du logement mises à jour avec succès");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProperty({
      type: property.type,
      size: property.size,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      commission: property.commission,
    });
    setIsEditing(false);
  };

  return (
    <EditableSection
      title="Détails du logement"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      {isEditing ? (
        // Mode édition
        <dl className="space-y-3">
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Type</dt>
            <dd className="font-medium w-1/2">
              <Select 
                value={editedProperty.type || ''} 
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type de bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Appartement">Appartement</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Loft">Loft</SelectItem>
                  <SelectItem value="Maison">Maison</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Surface</dt>
            <dd className="font-medium w-1/2">
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={editedProperty.size || ''} 
                  onChange={(e) => handleInputChange('size', Number(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2">m²</span>
              </div>
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Chambres</dt>
            <dd className="font-medium w-1/2">
              <Input 
                type="number" 
                value={editedProperty.bedrooms || ''} 
                onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                className="w-full"
              />
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Salles de bain</dt>
            <dd className="font-medium w-1/2">
              <Input 
                type="number" 
                value={editedProperty.bathrooms || ''} 
                onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                className="w-full"
              />
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Commission</dt>
            <dd className="font-medium w-1/2">
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={editedProperty.commission || ''} 
                  onChange={(e) => handleInputChange('commission', Number(e.target.value))}
                  className="w-full"
                />
                <span className="ml-2">%</span>
              </div>
            </dd>
          </div>
        </dl>
      ) : (
        // Mode affichage
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Type</dt>
            <dd className="font-medium">{property.type}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Surface</dt>
            <dd className="font-medium">{property.size} m²</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Chambres</dt>
            <dd className="font-medium">{property.bedrooms}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Salles de bain</dt>
            <dd className="font-medium">{property.bathrooms}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Commission</dt>
            <dd className="font-medium">{property.commission}%</dd>
          </div>
        </dl>
      )}
    </EditableSection>
  );
};
