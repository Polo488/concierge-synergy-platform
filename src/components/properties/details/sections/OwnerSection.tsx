
import { Property } from '@/utils/propertyUtils';
import { Input } from '@/components/ui/input';
import { EditableSection } from './EditableSection';
import { useState } from 'react';
import { toast } from 'sonner';

interface OwnerSectionProps {
  property: Property;
}

export const OwnerSection = ({ property }: OwnerSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOwner, setEditedOwner] = useState({
    name: property.owner.name,
    email: property.owner.email,
    phone: property.owner.phone,
  });

  const handleSave = () => {
    // Dans un cas réel, vous enverriez ces données à une API
    toast.success("Informations du propriétaire mises à jour avec succès");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedOwner({
      name: property.owner.name,
      email: property.owner.email,
      phone: property.owner.phone,
    });
    setIsEditing(false);
  };

  return (
    <EditableSection
      title="Propriétaire"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <dl className="space-y-3">
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Nom</dt>
            <dd className="font-medium w-1/2">
              <Input 
                value={editedOwner.name} 
                onChange={(e) => setEditedOwner({ ...editedOwner, name: e.target.value })}
                className="w-full"
              />
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium w-1/2">
              <Input 
                type="email"
                value={editedOwner.email} 
                onChange={(e) => setEditedOwner({ ...editedOwner, email: e.target.value })}
                className="w-full"
              />
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-muted-foreground">Téléphone</dt>
            <dd className="font-medium w-1/2">
              <Input 
                value={editedOwner.phone} 
                onChange={(e) => setEditedOwner({ ...editedOwner, phone: e.target.value })}
                className="w-full"
              />
            </dd>
          </div>
        </dl>
      ) : (
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Nom</dt>
            <dd className="font-medium">{property.owner.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{property.owner.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Téléphone</dt>
            <dd className="font-medium">{property.owner.phone}</dd>
          </div>
        </dl>
      )}
    </EditableSection>
  );
};
