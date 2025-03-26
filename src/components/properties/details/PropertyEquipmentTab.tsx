
import { useState } from 'react';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { HeatingSection } from './sections/HeatingSection';
import { KitchenSection } from './sections/KitchenSection';
import { BathroomSection } from './sections/BathroomSection';

interface PropertyEquipmentTabProps {
  property: Property;
}

export const PropertyEquipmentTab = ({ property }: PropertyEquipmentTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEquipment, setEditedEquipment] = useState({
    heating: property.equipment.heating,
    kitchen: [...property.equipment.kitchen],
    bathroom: [...property.equipment.bathroom],
  });

  const handleSave = () => {
    // Dans un cas réel, vous enverriez ces données à une API
    toast.success("Équipements mis à jour avec succès");
    setIsEditing(false);
    // En situation réelle, property serait mis à jour avec les valeurs de editedEquipment
  };

  const handleCancel = () => {
    setEditedEquipment({
      heating: property.equipment.heating,
      kitchen: [...property.equipment.kitchen],
      bathroom: [...property.equipment.bathroom],
    });
    setIsEditing(false);
  };

  const updateHeating = (value: string) => {
    setEditedEquipment({
      ...editedEquipment,
      heating: value
    });
  };

  const addKitchenItem = (item: string) => {
    setEditedEquipment({
      ...editedEquipment,
      kitchen: [...editedEquipment.kitchen, item]
    });
  };

  const removeKitchenItem = (index: number) => {
    const updatedItems = [...editedEquipment.kitchen];
    updatedItems.splice(index, 1);
    setEditedEquipment({
      ...editedEquipment,
      kitchen: updatedItems
    });
  };

  const addBathroomItem = (item: string) => {
    setEditedEquipment({
      ...editedEquipment,
      bathroom: [...editedEquipment.bathroom, item]
    });
  };

  const removeBathroomItem = (index: number) => {
    const updatedItems = [...editedEquipment.bathroom];
    updatedItems.splice(index, 1);
    setEditedEquipment({
      ...editedEquipment,
      bathroom: updatedItems
    });
  };

  return (
    <TabsContent value="equipment" className="space-y-4 mt-4">
      <HeatingSection
        heating={editedEquipment.heating}
        isEditing={isEditing}
        onUpdateHeating={updateHeating}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      
      <KitchenSection
        items={editedEquipment.kitchen}
        isEditing={isEditing}
        onAddItem={addKitchenItem}
        onRemoveItem={removeKitchenItem}
      />
      
      <BathroomSection
        items={editedEquipment.bathroom}
        isEditing={isEditing}
        onAddItem={addBathroomItem}
        onRemoveItem={removeBathroomItem}
      />
    </TabsContent>
  );
};
