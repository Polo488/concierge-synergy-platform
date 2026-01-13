
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Construction } from 'lucide-react';

interface PromotionsTabProps {
  promotions: any[];
  addPromotion: (promo: any) => any;
  deletePromotion: (id: string) => void;
}

export function PromotionsTab({ promotions }: PromotionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Promotions Automatisées</CardTitle>
            <CardDescription>
              Créez des campagnes promotionnelles avec conditions d'activation
            </CardDescription>
          </div>
          <Button disabled className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle promotion
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Module en construction</p>
          <p className="text-sm">Les promotions automatisées seront disponibles prochainement</p>
        </div>
      </CardContent>
    </Card>
  );
}
