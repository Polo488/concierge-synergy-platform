
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, TrendingUp } from 'lucide-react';
import { Property } from '@/utils/propertyUtils';
import { Progress } from '@/components/ui/progress';

interface UpsellsSectionProps {
  property: Property;
}

export const UpsellsSection = ({ property }: UpsellsSectionProps) => {
  if (!property.upsells) return null;
  
  const { available, totalRevenue } = property.upsells;
  const totalSold = available.reduce((acc, item) => acc + item.sold, 0);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Upsells et Services
          </h3>
          <span className="text-sm font-medium">
            Revenus: {totalRevenue}€
          </span>
        </div>
        
        <div className="space-y-4">
          {available.map((upsell) => {
            const percentage = totalSold ? Math.round((upsell.sold / totalSold) * 100) : 0;
            return (
              <div key={upsell.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">{upsell.name}</div>
                  <div className="text-sm">{upsell.price}€ × {upsell.sold} = {upsell.price * upsell.sold}€</div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground w-10">{percentage}%</span>
                </div>
              </div>
            );
          })}
          
          {totalSold === 0 && (
            <div className="flex items-center gap-2 justify-center py-4 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Aucune vente enregistrée pour ce logement</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
