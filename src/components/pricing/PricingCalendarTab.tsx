
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface PricingCalendarTabProps {
  stayRules: any[];
  blockingRules: any[];
  promotions: any[];
  pricingRules: any[];
}

export function PricingCalendarTab({ stayRules }: PricingCalendarTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu Calendrier</CardTitle>
        <CardDescription>
          Visualisez l'effet de toutes vos règles sur le calendrier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Module en construction</p>
          <p className="text-sm">L'aperçu calendrier des tarifs sera disponible prochainement</p>
        </div>
      </CardContent>
    </Card>
  );
}
