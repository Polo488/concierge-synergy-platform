
import { useState, useEffect } from 'react';
import { Property, ResidenceType } from '@/types/property';
import { EditableSection } from './EditableSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

interface ResidenceTypeSectionProps {
  property: Property;
}

export const ResidenceTypeSection = ({ property }: ResidenceTypeSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState({
    residenceType: property.residenceType,
    nightsCount: property.nightsCount
  });

  // Calculate percentage for progress bar
  const percentage = Math.min(100, (property.nightsCount / property.nightsLimit) * 100);
  const isNearLimit = percentage >= 90 && property.residenceType === 'principale';
  
  const handleInputChange = (field: keyof typeof editedProperty, value: any) => {
    setEditedProperty(prev => {
      const newState = { ...prev, [field]: value };
      
      // Si on change le type de résidence, on ajuste la limite
      if (field === 'residenceType') {
        // Réinitialiser le compteur si on passe de secondaire à principale
        if (value === 'principale' && prev.residenceType === 'secondaire') {
          return { ...newState, nightsCount: 0 };
        }
      }
      
      return newState;
    });
  };
  
  const handleSave = () => {
    toast.success("Informations de résidence mises à jour avec succès");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProperty({
      residenceType: property.residenceType,
      nightsCount: property.nightsCount
    });
    setIsEditing(false);
  };

  return (
    <EditableSection
      title="Statut de résidence"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <dl className="space-y-4">
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Type de résidence</dt>
            <dd className="font-medium w-1/2">
              <Select 
                value={editedProperty.residenceType} 
                onValueChange={(value: ResidenceType) => handleInputChange('residenceType', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type de résidence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principale">Résidence principale (120 nuits max)</SelectItem>
                  <SelectItem value="secondaire">Résidence secondaire (illimité)</SelectItem>
                </SelectContent>
              </Select>
            </dd>
          </div>
          
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Nuits utilisées</dt>
            <dd className="font-medium w-1/2">
              <Input 
                type="number" 
                value={editedProperty.nightsCount} 
                onChange={(e) => handleInputChange('nightsCount', Number(e.target.value))}
                min={0}
                max={editedProperty.residenceType === 'principale' ? 120 : undefined}
                className="w-full"
              />
            </dd>
          </div>
        </dl>
      ) : (
        <dl className="space-y-4">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Type de résidence</dt>
            <dd className="font-medium">
              {property.residenceType === 'principale' 
                ? 'Résidence principale (120 nuits max)' 
                : 'Résidence secondaire (illimité)'}
            </dd>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Nuits utilisées cette année
              </dt>
              <dd className="font-medium">
                {property.nightsCount} / {property.residenceType === 'principale' ? '120' : '∞'}
              </dd>
            </div>
            
            {property.residenceType === 'principale' && (
              <div className="w-full">
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isNearLimit ? 'bg-red-200' : 'bg-gray-200'}`} 
                />
                {isNearLimit && (
                  <p className="text-xs text-red-500 mt-1">
                    Attention: Proche de la limite légale de 120 nuitées
                  </p>
                )}
              </div>
            )}
          </div>
        </dl>
      )}
    </EditableSection>
  );
};
