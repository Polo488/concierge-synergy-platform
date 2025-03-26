
import { Property } from '@/utils/propertyUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EditableSection } from './EditableSection';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface AmenitiesSectionProps {
  property: Property;
}

export const AmenitiesSection = ({ property }: AmenitiesSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmenities, setEditedAmenities] = useState([...property.amenities]);
  const [newAmenity, setNewAmenity] = useState('');

  const handleSave = () => {
    toast.success("Aménités mises à jour avec succès");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAmenities([...property.amenities]);
    setNewAmenity('');
    setIsEditing(false);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !editedAmenities.includes(newAmenity.trim())) {
      setEditedAmenities([...editedAmenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setEditedAmenities(editedAmenities.filter(item => item !== amenity));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <EditableSection
          title="Aménités"
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        >
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {editedAmenities.map((amenity, index) => (
                  <Badge key={index} className="rounded-full flex items-center gap-1">
                    {amenity}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAmenity(amenity)}
                      className="h-5 w-5 p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Ajouter une aménité"
                  className="flex-1"
                />
                <Button
                  onClick={addAmenity}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, index) => (
                <Badge key={index} className="rounded-full">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
        </EditableSection>
      </CardContent>
    </Card>
  );
};
