
import { Card, CardContent } from '@/components/ui/card';
import { Waves } from 'lucide-react';
import { EquipmentList } from './EquipmentList';

interface BathroomSectionProps {
  items: string[];
  isEditing: boolean;
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
}

export const BathroomSection = ({
  items,
  isEditing,
  onAddItem,
  onRemoveItem
}: BathroomSectionProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Salle de bain</h3>
        </div>
        
        <EquipmentList
          items={items}
          isEditing={isEditing}
          icon={<Waves className="h-4 w-4 text-muted-foreground" />}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      </CardContent>
    </Card>
  );
};
