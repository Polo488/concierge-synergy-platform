import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, MapPin, Calendar } from 'lucide-react';
import { MonthlySnapshot } from '@/types/location';

interface MonthlySnapshotCardProps {
  snapshot: MonthlySnapshot;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR', 
    maximumFractionDigits: 0 
  }).format(value);
}

export function MonthlySnapshotCard({ snapshot }: MonthlySnapshotCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium capitalize">{snapshot.month}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenus</p>
            <p className="text-lg font-semibold">{formatCurrency(snapshot.revenue)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Occupation</p>
            <p className="text-lg font-semibold">{snapshot.occupancy.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prix/nuit moy.</p>
            <p className="text-lg font-semibold">{formatCurrency(snapshot.avgNightlyRate)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Top ville
            </p>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" />
              <p className="text-sm font-medium truncate">{snapshot.topCity}</p>
            </div>
            {snapshot.topArea && (
              <p className="text-[10px] text-muted-foreground truncate">{snapshot.topArea}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}