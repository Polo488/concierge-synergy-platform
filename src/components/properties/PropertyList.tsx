import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ChevronRight, BedDouble, Maximize2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/utils/propertyUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getStatusStyle = (property: Property) => {
  // Use nightsCount as a proxy for status in demo
  if (property.nightsCount > property.nightsLimit * 0.9) {
    return { label: 'En travaux', bg: 'bg-[hsl(45,93%,94%)]', text: 'text-[hsl(30,82%,35%)]' };
  }
  return { label: 'Actif', bg: 'bg-[hsl(142,76%,92%)]', text: 'text-[hsl(142,72%,29%)]' };
};

export const PropertyList = ({ properties, onSelectProperty }: PropertyListProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-2.5">
        {properties.map((property) => {
          const status = getStatusStyle(property);
          return (
            <div
              key={property.id}
              className="bg-card rounded-xl border border-border p-3.5 shadow-sm cursor-pointer active:bg-muted/50 transition-colors"
              onClick={() => onSelectProperty(property)}
            >
              {/* Line 1: Number + Type + Menu */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {property.number}
                  </span>
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[hsl(239,84%,95%)] text-[hsl(239,84%,40%)]">
                    {property.type}
                  </span>
                </div>
                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Line 2: Address */}
              <p className="text-sm font-semibold text-foreground truncate">{property.address}</p>

              {/* Line 3: Owner + Status */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-muted text-[9px] font-bold text-muted-foreground shrink-0">
                    {getInitials(property.owner.name)}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">{property.owner.name}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>

              {/* Line 4: Quick info */}
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <BedDouble className="h-3 w-3" /> {property.bedrooms} ch.
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Maximize2 className="h-3 w-3" /> {property.size}m²
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {property.commission}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop table
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-border">
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-12">N°</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground" style={{ minWidth: 200 }}>Adresse</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-20">Type</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground" style={{ minWidth: 140 }}>Propriétaire</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-24">Commission</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground text-right w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow 
              key={property.id}
              className="cursor-pointer hover:bg-muted/80 h-16 border-b border-border/50"
              onClick={() => onSelectProperty(property)}
            >
              <TableCell className="font-medium text-foreground">{property.number}</TableCell>
              <TableCell className="truncate max-w-[200px]">{property.address}</TableCell>
              <TableCell>
                <Badge className="rounded-full text-[11px]">{property.type}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground truncate max-w-[140px]">{property.owner.name}</TableCell>
              <TableCell className="text-muted-foreground">{property.commission}%</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="gap-1 text-xs">
                  Détails <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
