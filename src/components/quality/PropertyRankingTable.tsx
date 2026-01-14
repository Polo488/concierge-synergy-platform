
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PropertyQualityStats } from '@/types/quality';
import { Star, TrendingDown, TrendingUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyRankingTableProps {
  properties: PropertyQualityStats[];
  onSelectProperty: (propertyId: string) => void;
}

export function PropertyRankingTable({ properties, onSelectProperty }: PropertyRankingTableProps) {
  // Sort by rating ascending (worst first)
  const sortedProperties = [...properties].sort((a, b) => 
    a.average_cleaning_rating_overall - b.average_cleaning_rating_overall
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4) return 'text-lime-500';
    if (rating >= 3.5) return 'text-yellow-500';
    if (rating >= 3) return 'text-orange-500';
    return 'text-red-500';
  };

  const getReworkBadgeVariant = (rate: number): 'default' | 'secondary' | 'destructive' => {
    if (rate > 15) return 'destructive';
    if (rate > 5) return 'secondary';
    return 'default';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          Propriétés par note (croissant)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Propriété</TableHead>
                <TableHead className="text-center">Note globale</TableHead>
                <TableHead className="text-center">Note 30j</TableHead>
                <TableHead className="text-center">Reprises</TableHead>
                <TableHead className="text-center">Ponctualité</TableHead>
                <TableHead className="text-center">Problèmes/séjour</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProperties.map((property, index) => (
                <TableRow key={property.property_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{property.property_name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className={cn("h-4 w-4", getRatingColor(property.average_cleaning_rating_overall))} />
                      <span className={cn("font-semibold", getRatingColor(property.average_cleaning_rating_overall))}>
                        {property.average_cleaning_rating_overall.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {property.average_cleaning_rating_last_30_days > property.average_cleaning_rating_overall ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-sm">
                        {property.average_cleaning_rating_last_30_days.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getReworkBadgeVariant(property.rework_rate)}>
                      {property.rework_rate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "text-sm font-medium",
                      property.on_time_rate >= 90 ? "text-green-500" : "text-orange-500"
                    )}>
                      {property.on_time_rate.toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "text-sm",
                      property.issues_per_stay > 1 ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {property.issues_per_stay.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onSelectProperty(property.property_id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
