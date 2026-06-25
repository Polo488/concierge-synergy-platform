import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ChevronRight, BedDouble, Maximize2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/utils/propertyUtils';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import {
  usePropertyColumns,
  ALL_PROPERTY_COLUMNS,
  PropertyColumnKey,
} from '@/hooks/usePropertyColumns';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getStatusStyle = (property: Property) => {
  if (property.nightsCount > property.nightsLimit * 0.9) {
    return { label: 'En travaux', bg: 'bg-[hsl(45,93%,94%)]', text: 'text-[hsl(30,82%,35%)]' };
  }
  return { label: 'Actif', bg: 'bg-[hsl(142,76%,92%)]', text: 'text-[hsl(142,72%,29%)]' };
};

const COLUMN_META: Record<PropertyColumnKey, { width?: string; minWidth?: number; align?: 'right' | 'left' }> = {
  number: { width: 'w-12' },
  address: { minWidth: 200 },
  type: { width: 'w-20' },
  owner: { minWidth: 140 },
  commission: { width: 'w-24' },
  nights: { width: 'w-20' },
  bedrooms: { width: 'w-20' },
  size: { width: 'w-20' },
  status: { width: 'w-24' },
};

function renderCell(key: PropertyColumnKey, property: Property) {
  switch (key) {
    case 'number':
      return <span className="font-medium text-foreground">{property.number}</span>;
    case 'address':
      return <span className="truncate block max-w-[200px]">{property.address}</span>;
    case 'type':
      return <Badge className="rounded-full text-[11px]">{property.type}</Badge>;
    case 'owner':
      return <span className="text-muted-foreground truncate block max-w-[140px]">{property.owner.name}</span>;
    case 'commission':
      return <span className="text-muted-foreground">{property.commission}%</span>;
    case 'nights':
      return <span className="text-muted-foreground">{property.nightsCount}</span>;
    case 'bedrooms':
      return <span className="text-muted-foreground">{property.bedrooms}</span>;
    case 'size':
      return <span className="text-muted-foreground">{property.size}m²</span>;
    case 'status': {
      const s = getStatusStyle(property);
      return (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${s.bg} ${s.text}`}>
          {s.label}
        </span>
      );
    }
  }
}

export const PropertyList = ({ properties, onSelectProperty }: PropertyListProps) => {
  const isMobile = useIsMobile() || useIsTablet();
  const { config } = usePropertyColumns();

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
              <p className="text-sm font-semibold text-foreground truncate">{property.address}</p>
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

  // Desktop table with configurable columns
  const visibleKeys = config.order.filter(k => config.visible.includes(k));

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-border">
            {visibleKeys.map(key => {
              const def = ALL_PROPERTY_COLUMNS.find(c => c.key === key)!;
              const meta = COLUMN_META[key];
              return (
                <TableHead
                  key={key}
                  className={`text-[11px] uppercase tracking-wider text-muted-foreground ${meta?.width ?? ''}`}
                  style={meta?.minWidth ? { minWidth: meta.minWidth } : undefined}
                >
                  {def.label}
                </TableHead>
              );
            })}
            <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground text-right w-20">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow
              key={property.id}
              className="cursor-pointer hover:bg-muted/80 h-16 border-b border-border/50"
              onClick={() => onSelectProperty(property)}
            >
              {visibleKeys.map(key => (
                <TableCell key={key}>{renderCell(key, property)}</TableCell>
              ))}
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
