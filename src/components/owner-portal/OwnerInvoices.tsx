
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  number: string;
  date: string;
  property: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

const MOCK_INVOICES: Invoice[] = [
  { id: '1', number: 'FAC-2026-0042', date: '2026-02-01', property: 'Appartement Marais', amount: 850, status: 'pending', description: 'Commission de gestion – Février 2026' },
  { id: '2', number: 'FAC-2026-0028', date: '2026-01-01', property: 'Appartement Marais', amount: 920, status: 'paid', description: 'Commission de gestion – Janvier 2026' },
  { id: '3', number: 'FAC-2025-0198', date: '2025-12-01', property: 'Appartement Marais', amount: 1100, status: 'paid', description: 'Commission de gestion – Décembre 2025' },
  { id: '4', number: 'FAC-2025-0175', date: '2025-11-01', property: 'Appartement Marais', amount: 780, status: 'paid', description: 'Commission de gestion – Novembre 2025' },
  { id: '5', number: 'FAC-2025-0160', date: '2025-10-01', property: 'Studio Montmartre', amount: 450, status: 'paid', description: 'Frais de mise en service' },
];

const statusConfig = {
  paid: { label: 'Payée', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  pending: { label: 'En attente', className: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  overdue: { label: 'En retard', className: 'bg-red-500/10 text-red-600 border-red-200' },
};

export function OwnerInvoices() {
  const [filterProperty, setFilterProperty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const properties = [...new Set(MOCK_INVOICES.map(i => i.property))];

  const filtered = MOCK_INVOICES.filter(inv => {
    if (filterProperty !== 'all' && inv.property !== filterProperty) return false;
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    if (search && !inv.number.toLowerCase().includes(search.toLowerCase()) && !inv.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Factures</h1>
        <p className="text-muted-foreground mt-1">Consultez et téléchargez vos factures</p>
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterProperty} onValueChange={setFilterProperty}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Tous les biens" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les biens</SelectItem>
                {properties.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payée</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(inv => {
                  const status = statusConfig[inv.status];
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-sm font-medium">{inv.number}</TableCell>
                      <TableCell>{new Date(inv.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{inv.property}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{inv.description}</TableCell>
                      <TableCell className="text-right font-semibold">{inv.amount.toLocaleString('fr-FR')}€</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-xs", status.className)}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info('Aperçu de la facture ' + inv.number)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success('Téléchargement de ' + inv.number)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
