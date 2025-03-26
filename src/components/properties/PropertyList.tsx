
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/utils/propertyUtils';

interface PropertyListProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const PropertyList = ({ properties, onSelectProperty }: PropertyListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">N°</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Propriétaire</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow 
              key={property.id}
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => onSelectProperty(property)}
            >
              <TableCell className="font-medium">{property.number}</TableCell>
              <TableCell>{property.address}</TableCell>
              <TableCell>
                <Badge className="rounded-full">{property.type}</Badge>
              </TableCell>
              <TableCell>{property.owner.name}</TableCell>
              <TableCell>{property.commission}%</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="gap-1">
                  Détails <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
