
import { Property } from '@/utils/propertyUtils';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EditableSection } from './EditableSection';
import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface LinenConsumablesSectionProps {
  property: Property;
}

export const LinenConsumablesSection = ({ property }: LinenConsumablesSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLinens, setEditedLinens] = useState({
    bedding: [...property.linens.bedding],
    towels: [...property.linens.towels],
    consumables: [...property.linens.consumables],
  });

  const [newBeddingItem, setNewBeddingItem] = useState('');
  const [newTowelItem, setNewTowelItem] = useState('');
  const [newConsumableItem, setNewConsumableItem] = useState('');

  const handleSave = () => {
    toast.success("Linge et consommables mis à jour avec succès");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLinens({
      bedding: [...property.linens.bedding],
      towels: [...property.linens.towels],
      consumables: [...property.linens.consumables],
    });
    setNewBeddingItem('');
    setNewTowelItem('');
    setNewConsumableItem('');
    setIsEditing(false);
  };

  const addBeddingItem = () => {
    if (newBeddingItem.trim()) {
      setEditedLinens({
        ...editedLinens,
        bedding: [...editedLinens.bedding, newBeddingItem.trim()]
      });
      setNewBeddingItem('');
    }
  };

  const addTowelItem = () => {
    if (newTowelItem.trim()) {
      setEditedLinens({
        ...editedLinens,
        towels: [...editedLinens.towels, newTowelItem.trim()]
      });
      setNewTowelItem('');
    }
  };

  const addConsumableItem = () => {
    if (newConsumableItem.trim()) {
      setEditedLinens({
        ...editedLinens,
        consumables: [...editedLinens.consumables, newConsumableItem.trim()]
      });
      setNewConsumableItem('');
    }
  };

  const removeBeddingItem = (index: number) => {
    const updatedItems = [...editedLinens.bedding];
    updatedItems.splice(index, 1);
    setEditedLinens({ ...editedLinens, bedding: updatedItems });
  };

  const removeTowelItem = (index: number) => {
    const updatedItems = [...editedLinens.towels];
    updatedItems.splice(index, 1);
    setEditedLinens({ ...editedLinens, towels: updatedItems });
  };

  const removeConsumableItem = (index: number) => {
    const updatedItems = [...editedLinens.consumables];
    updatedItems.splice(index, 1);
    setEditedLinens({ ...editedLinens, consumables: updatedItems });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <EditableSection
          title="Linge et consommables"
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-2">Linge de lit</h4>
              {isEditing ? (
                <div className="space-y-3">
                  <ul className="space-y-2">
                    {editedLinens.bedding.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="flex-1">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBeddingItem(index)}
                          className="h-7 w-7 p-0 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Input
                      value={newBeddingItem}
                      onChange={(e) => setNewBeddingItem(e.target.value)}
                      placeholder="Ajouter un élément"
                      className="flex-1"
                    />
                    <Button
                      onClick={addBeddingItem}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="list-disc ml-4 space-y-1 text-sm">
                  {property.linens.bedding.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Serviettes</h4>
              {isEditing ? (
                <div className="space-y-3">
                  <ul className="space-y-2">
                    {editedLinens.towels.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="flex-1">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTowelItem(index)}
                          className="h-7 w-7 p-0 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Input
                      value={newTowelItem}
                      onChange={(e) => setNewTowelItem(e.target.value)}
                      placeholder="Ajouter un élément"
                      className="flex-1"
                    />
                    <Button
                      onClick={addTowelItem}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="list-disc ml-4 space-y-1 text-sm">
                  {property.linens.towels.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Consommables</h4>
              {isEditing ? (
                <div className="space-y-3">
                  <ul className="space-y-2">
                    {editedLinens.consumables.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="flex-1">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeConsumableItem(index)}
                          className="h-7 w-7 p-0 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Input
                      value={newConsumableItem}
                      onChange={(e) => setNewConsumableItem(e.target.value)}
                      placeholder="Ajouter un élément"
                      className="flex-1"
                    />
                    <Button
                      onClick={addConsumableItem}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="list-disc ml-4 space-y-1 text-sm">
                  {property.linens.consumables.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </EditableSection>
      </CardContent>
    </Card>
  );
};
