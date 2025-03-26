
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

interface EquipmentListProps {
  items: string[];
  isEditing: boolean;
  icon: React.ReactNode;
  onAddItem?: (item: string) => void;
  onRemoveItem?: (index: number) => void;
  gridCols?: number;
}

export const EquipmentList = ({
  items,
  isEditing,
  icon,
  onAddItem,
  onRemoveItem,
  gridCols = 2
}: EquipmentListProps) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() && onAddItem) {
      onAddItem(newItem.trim());
      setNewItem('');
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {icon}
              <span className="flex-1">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem && onRemoveItem(index)}
                className="h-7 w-7 p-0 text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Ajouter un équipement"
            className="flex-1"
          />
          <Button
            onClick={handleAddItem}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul className={`grid gap-2 ${gridCols ? `md:grid-cols-${gridCols}` : ''}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2">
          {icon}
          {item}
        </li>
      ))}
    </ul>
  );
};
