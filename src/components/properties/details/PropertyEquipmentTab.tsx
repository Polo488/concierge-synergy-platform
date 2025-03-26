
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';
import { Thermometer, UtensilsCrossed, Waves } from 'lucide-react';

interface PropertyEquipmentTabProps {
  property: Property;
}

export const PropertyEquipmentTab = ({ property }: PropertyEquipmentTabProps) => {
  return (
    <TabsContent value="equipment" className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Chauffage et climatisation</h3>
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <span>{property.equipment.heating}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Cuisine</h3>
          <ul className="grid gap-2 md:grid-cols-2">
            {property.equipment.kitchen.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Salle de bain</h3>
          <ul className="grid gap-2 md:grid-cols-2">
            {property.equipment.bathroom.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
