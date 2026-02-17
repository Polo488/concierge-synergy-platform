
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, TrendingUp, Euro, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface MonthlyRevenue {
  month: string;
  grossRevenue: number;
  commission: number;
  commissionRate: number;
  netRevenue: number;
}

const MOCK_REVENUE: MonthlyRevenue[] = [
  { month: '2026-02', grossRevenue: 3420, commission: 684, commissionRate: 20, netRevenue: 2736 },
  { month: '2026-01', grossRevenue: 3850, commission: 770, commissionRate: 20, netRevenue: 3080 },
  { month: '2025-12', grossRevenue: 4200, commission: 840, commissionRate: 20, netRevenue: 3360 },
  { month: '2025-11', grossRevenue: 2900, commission: 580, commissionRate: 20, netRevenue: 2320 },
  { month: '2025-10', grossRevenue: 3100, commission: 620, commissionRate: 20, netRevenue: 2480 },
  { month: '2025-09', grossRevenue: 3600, commission: 720, commissionRate: 20, netRevenue: 2880 },
];

const formatMonth = (m: string) => {
  const [y, mo] = m.split('-');
  const date = new Date(parseInt(y), parseInt(mo) - 1);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

export function OwnerRevenue() {
  const totalGross = MOCK_REVENUE.reduce((s, r) => s + r.grossRevenue, 0);
  const totalCommission = MOCK_REVENUE.reduce((s, r) => s + r.commission, 0);
  const totalNet = MOCK_REVENUE.reduce((s, r) => s + r.netRevenue, 0);

  const handleExport = () => {
    const headers = 'Mois;Revenus bruts;Commission;Net versé\n';
    const rows = MOCK_REVENUE.map(r => `${formatMonth(r.month)};${r.grossRevenue};${r.commission};${r.netRevenue}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenus-proprietaire.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export CSV téléchargé');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenus</h1>
          <p className="text-muted-foreground mt-1">Suivi mensuel de vos revenus locatifs</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Euro className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalGross.toLocaleString('fr-FR')}€</p>
                <p className="text-xs text-muted-foreground">Revenus bruts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Percent className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalCommission.toLocaleString('fr-FR')}€</p>
                <p className="text-xs text-muted-foreground">Commission totale</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{totalNet.toLocaleString('fr-FR')}€</p>
                <p className="text-xs text-muted-foreground">Net versé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mois</TableHead>
                <TableHead className="text-right">Revenus bruts</TableHead>
                <TableHead className="text-right">Commission (20%)</TableHead>
                <TableHead className="text-right font-semibold">Net versé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REVENUE.map(rev => (
                <TableRow key={rev.month}>
                  <TableCell className="font-medium capitalize">{formatMonth(rev.month)}</TableCell>
                  <TableCell className="text-right">{rev.grossRevenue.toLocaleString('fr-FR')}€</TableCell>
                  <TableCell className="text-right text-muted-foreground">{rev.commission.toLocaleString('fr-FR')}€</TableCell>
                  <TableCell className="text-right font-semibold">{rev.netRevenue.toLocaleString('fr-FR')}€</TableCell>
                </TableRow>
              ))}
              {/* Total */}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalGross.toLocaleString('fr-FR')}€</TableCell>
                <TableCell className="text-right">{totalCommission.toLocaleString('fr-FR')}€</TableCell>
                <TableCell className="text-right">{totalNet.toLocaleString('fr-FR')}€</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
