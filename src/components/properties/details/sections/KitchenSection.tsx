
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';
import { EquipmentList } from './EquipmentList';

interface KitchenSectionProps {
  items: string[];
  isEditing: boolean;
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
}

export const KitchenSection = ({
  items,
  isEditing,
  onAddItem,
  onRemoveItem
}: KitchenSectionProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Cuisine</h3>
        </div>
        
        <EquipmentList
          items={items}
          isEditing={isEditing}
          icon={<UtensilsCrossed className="h-4 w-4 text-muted-foreground" />}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      </CardContent>
    </Card>
  );
};
