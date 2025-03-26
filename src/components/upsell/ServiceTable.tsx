
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PropertyUpsellItem } from '@/types/property';
import { ServiceTableRow } from './ServiceTableRow';

interface ServiceTableProps {
  services: PropertyUpsellItem[];
  onEdit: (service: PropertyUpsellItem) => void;
  onDelete: (service: PropertyUpsellItem) => void;
  onRegisterSale: (service: PropertyUpsellItem) => void;
  onCopyLink: (service: PropertyUpsellItem) => void;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
  onRegisterSale,
  onCopyLink
}: ServiceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom du service</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Vendu</TableHead>
          <TableHead>Logement / Réservation</TableHead>
          <TableHead>Lien de vente</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceTableRow
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
              onRegisterSale={onRegisterSale}
              onCopyLink={onCopyLink}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
              Aucun service disponible. Cliquez sur "Ajouter un service" pour commencer.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
