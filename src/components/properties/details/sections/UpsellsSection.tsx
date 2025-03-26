
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, TrendingUp, ExternalLink, Link } from 'lucide-react';
import { Property } from '@/utils/propertyUtils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface UpsellsSectionProps {
  property: Property;
}

export const UpsellsSection = ({ property }: UpsellsSectionProps) => {
  const { toast } = useToast();
  
  if (!property.upsells) return null;
  
  const { available, totalRevenue } = property.upsells;
  const totalSold = available.reduce((acc, item) => acc + item.sold, 0);
  
  const copyLinkToClipboard = (serviceLink: string) => {
    navigator.clipboard.writeText(serviceLink);
    toast({
      title: "Lien copié",
      description: "Le lien de vente a été copié dans le presse-papier."
    });
  };
  
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
                  <div className="font-medium text-sm flex items-center gap-2">
                    {upsell.name}
                    {upsell.salesLink && (
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => copyLinkToClipboard(upsell.salesLink!)}
                          title="Copier le lien"
                        >
                          <Link className="h-3 w-3" />
                        </Button>
                        <a 
                          href={upsell.salesLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
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
