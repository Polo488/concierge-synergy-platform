
import { useEffect } from 'react';
import { 
  Receipt, Download, Filter, PlusCircle, 
  Search, CreditCard, ArrowUpDown, BarChart, ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock data
const invoices = [
  {
    id: 'INV-001',
    owner: 'Thomas Dubois',
    property: 'Appartement Haussmannien',
    amount: 1250.75,
    date: '2023-11-01',
    dueDate: '2023-11-15',
    status: 'paid',
    items: [
      { description: 'Commission location', amount: 850.50 },
      { description: 'Ménages (3)', amount: 225.00 },
      { description: 'Intervention maintenance', amount: 175.25 }
    ]
  },
  {
    id: 'INV-002',
    owner: 'Sophie Moreau',
    property: 'Studio Moderne',
    amount: 580.25,
    date: '2023-11-05',
    dueDate: '2023-11-20',
    status: 'pending',
    items: [
      { description: 'Commission location', amount: 430.25 },
      { description: 'Ménages (2)', amount: 150.00 }
    ]
  },
  {
    id: 'INV-003',
    owner: 'Marc Lefevre',
    property: 'Loft Industriel',
    amount: 1875.00,
    date: '2023-11-10',
    dueDate: '2023-11-25',
    status: 'overdue',
    items: [
      { description: 'Commission location', amount: 1350.00 },
      { description: 'Ménages (4)', amount: 300.00 },
      { description: 'Interventions maintenance (2)', amount: 225.00 }
    ]
  },
  {
    id: 'INV-004',
    owner: 'Claire Durand',
    property: 'Maison de Charme',
    amount: 2200.50,
    date: '2023-11-15',
    dueDate: '2023-11-30',
    status: 'draft',
    items: [
      { description: 'Commission location', amount: 1800.50 },
      { description: 'Ménages (3)', amount: 225.00 },
      { description: 'Interventions maintenance (1)', amount: 175.00 }
    ]
  },
  {
    id: 'INV-005',
    owner: 'Philippe Martin',
    property: 'Appartement Contemporain',
    amount: 1120.75,
    date: '2023-11-20',
    dueDate: '2023-12-05',
    status: 'pending',
    items: [
      { description: 'Commission location', amount: 920.75 },
      { description: 'Ménages (2)', amount: 150.00 },
      { description: 'Interventions maintenance (1)', amount: 50.00 }
    ]
  }
];

const revenueData = [
  { month: 'Juin', amount: 4500 },
  { month: 'Juil', amount: 5200 },
  { month: 'Août', amount: 7800 },
  { month: 'Sept', amount: 6400 },
  { month: 'Oct', amount: 7100 },
  { month: 'Nov', amount: 7500 },
];

const Billing = () => {
  useEffect(() => {
    document.title = 'Facturation - Concierge Synergy Platform';
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">Payée</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full">En attente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 rounded-full">En retard</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">Brouillon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des factures et des paiements
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Chiffre d'affaires (mois)" 
          value="7 027,25 €" 
          icon={<Receipt className="h-5 w-5" />}
          change={{ value: 12, type: 'increase' }}
          className="stagger-1"
        />
        <StatCard 
          title="En attente" 
          value="1 701,00 €" 
          icon={<CreditCard className="h-5 w-5" />}
          className="stagger-2"
        />
        <StatCard 
          title="En retard" 
          value="1 875,00 €" 
          icon={<Receipt className="h-5 w-5" />}
          change={{ value: 3, type: 'increase' }}
          className="stagger-3"
        />
        <StatCard 
          title="Taux de récupération" 
          value="85%" 
          icon={<ArrowUp className="h-5 w-5" />}
          change={{ value: 2, type: 'increase' }}
          className="stagger-4"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue chart */}
        <DashboardCard 
          title="Revenus mensuels" 
          className="stagger-1"
          actions={<Button variant="ghost" size="sm">Voir tout</Button>}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
                <Tooltip 
                  formatter={(value) => [`${value} €`, 'Montant']}
                  contentStyle={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 500 }}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        {/* Recent payments */}
        <DashboardCard 
          title="Paiements récents" 
          className="stagger-2"
          actions={<Button variant="ghost" size="sm">Voir tout</Button>}
        >
          <div className="space-y-4">
            {invoices
              .filter(inv => inv.status === 'paid')
              .slice(0, 4)
              .map((invoice, i) => (
                <Card key={i} className="p-4 bg-background/50 border border-border/30 animate-slide-up">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{invoice.owner}</p>
                      <p className="text-sm text-muted-foreground">{invoice.property}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{invoice.amount.toFixed(2)} €</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </DashboardCard>
      </div>
      
      {/* Invoices management */}
      <DashboardCard 
        title="Factures"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Nouvelle facture
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une facture..." className="h-9" />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Facture</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Montant
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="animate-slide-up">
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.owner}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{invoice.property}</TableCell>
                    <TableCell>
                      <div>
                        <div>{invoice.date}</div>
                        <div className="text-xs text-muted-foreground">Échéance: {invoice.dueDate}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.amount.toFixed(2)} €</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Billing;
