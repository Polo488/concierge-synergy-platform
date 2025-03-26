
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X, Thermometer, UtensilsCrossed, Waves, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

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
  const [newKitchenItem, setNewKitchenItem] = useState('');
  const [newBathroomItem, setNewBathroomItem] = useState('');

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
    setNewKitchenItem('');
    setNewBathroomItem('');
    setIsEditing(false);
  };

  const addKitchenItem = () => {
    if (newKitchenItem.trim()) {
      setEditedEquipment({
        ...editedEquipment,
        kitchen: [...editedEquipment.kitchen, newKitchenItem.trim()]
      });
      setNewKitchenItem('');
    }
  };

  const addBathroomItem = () => {
    if (newBathroomItem.trim()) {
      setEditedEquipment({
        ...editedEquipment,
        bathroom: [...editedEquipment.bathroom, newBathroomItem.trim()]
      });
      setNewBathroomItem('');
    }
  };

  const removeKitchenItem = (index: number) => {
    const updatedItems = [...editedEquipment.kitchen];
    updatedItems.splice(index, 1);
    setEditedEquipment({
      ...editedEquipment,
      kitchen: updatedItems
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
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Chauffage et climatisation</h3>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  className="h-8 px-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Annuler
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                  className="h-8 px-2"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="h-8 px-2"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              <Input 
                value={editedEquipment.heating} 
                onChange={(e) => setEditedEquipment({...editedEquipment, heating: e.target.value})}
                className="w-full"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              <span>{property.equipment.heating}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Cuisine</h3>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <ul className="space-y-2">
                {editedEquipment.kitchen.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeKitchenItem(index)}
                      className="h-7 w-7 p-0 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  value={newKitchenItem}
                  onChange={(e) => setNewKitchenItem(e.target.value)}
                  placeholder="Ajouter un équipement"
                  className="flex-1"
                />
                <Button
                  onClick={addKitchenItem}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2">
              {property.equipment.kitchen.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Salle de bain</h3>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <ul className="space-y-2">
                {editedEquipment.bathroom.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBathroomItem(index)}
                      className="h-7 w-7 p-0 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  value={newBathroomItem}
                  onChange={(e) => setNewBathroomItem(e.target.value)}
                  placeholder="Ajouter un équipement"
                  className="flex-1"
                />
                <Button
                  onClick={addBathroomItem}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2">
              {property.equipment.bathroom.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-muted-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
