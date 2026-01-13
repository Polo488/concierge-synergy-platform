
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Construction } from 'lucide-react';

interface ChannelRestrictionsTabProps {
  channelRestrictions: any[];
  addChannelRestriction: (restriction: any) => any;
  deleteChannelRestriction: (id: string) => void;
}

export function ChannelRestrictionsTab({ channelRestrictions }: ChannelRestrictionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Restrictions par Canal</CardTitle>
            <CardDescription>
              Configurez les règles spécifiques à chaque OTA (Airbnb, Booking, VRBO...)
            </CardDescription>
          </div>
          <Button disabled className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle restriction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Construction className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">Module en construction</p>
          <p className="text-sm">Les restrictions par canal seront disponibles prochainement</p>
        </div>
      </CardContent>
    </Card>
  );
}
