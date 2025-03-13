
import { useEffect, useState } from 'react';
import { 
  Receipt, Download, Filter, PlusCircle, 
  Search, CreditCard, ArrowUpDown, BarChart, ArrowUp,
  FileText, RefreshCw, CheckCircle, AlertTriangle, FileSpreadsheet,
  Settings
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SmilyImportDialog } from '@/components/billing/SmilyImportDialog';
import { HospitableConfigDialog } from '@/components/billing/HospitableConfigDialog';
import { HospitableImportDialog } from '@/components/billing/HospitableImportDialog';
import { useHospitable } from '@/hooks/useHospitable';
import { HospitableImportedDataSummary } from '@/components/billing/HospitableImportedDataSummary';

// Mock data
const invoicesData = [
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

// SMILY API mock integration
interface SmilyImportParams {
  startDate: string;
  endDate: string;
  apiKey?: string;
}

interface PlatformImportParams {
  platform: 'airbnb' | 'booking' | 'stripe';
  startDate: string;
  endDate: string;
  file?: File;
  apiKey?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errorCount: number;
  unassignedCount: number;
}

// Booking interface
interface Booking {
  id: string;
  rentalId: string;
  platform: string;
  property: string;
  guest: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  platformFee: number;
  cleaningFee: number;
  commissionRate: number;
  commission: number;
  touristTax: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isAssigned: boolean;
  importDate: string;
}

// BA (Bordereau d'Achat) and Invoice interfaces
interface BA {
  id: string;
  bookingId: string;
  property: string;
  recipient: string;
  isEntity: boolean; // true if recipient is an entity, false if it's an owner
  amount: number;
  date: string;
  status: 'draft' | 'locked' | 'validated' | 'processed';
  invoiceId?: string;
}

interface InvoiceLine {
  description: string;
  amount: number;
  type: 'commission' | 'cleaning' | 'inventory' | 'other';
}

interface Invoice {
  id: string;
  bookingId?: string;
  property: string;
  client?: string;
  owner?: string;  // Add owner property to match invoicesData
  date: string;
  dueDate: string;
  lines?: InvoiceLine[];
  items?: Array<{ description: string, amount: number }>;  // Add items property to match invoicesData
  total?: number;
  amount?: number;  // Add amount property to match invoicesData
  status: 'draft' | 'locked' | 'validated' | 'sent' | 'paid' | 'pending' | 'overdue';
  relatedBAs?: string[]; // IDs of related BAs
}

// Mock data for SMILY imports
const mockBookings: Booking[] = [
  {
    id: "BNB-2023-001",
    rentalId: "RENT-001",
    platform: "Airbnb",
    property: "Appartement Bellecour",
    guest: "Marie Dupont",
    checkIn: "2023-11-01",
    checkOut: "2023-11-08",
    amount: 840.00,
    platformFee: 25.20,
    cleaningFee: 75.00,
    commissionRate: 20,
    commission: 153.00,
    touristTax: 14.00,
    status: "completed",
    isAssigned: true,
    importDate: "2023-10-15"
  },
  {
    id: "BNB-2023-002",
    rentalId: "RENT-002",
    platform: "Booking",
    property: "Studio Part-Dieu",
    guest: "Lucas Martin",
    checkIn: "2023-11-10",
    checkOut: "2023-11-15",
    amount: 450.00,
    platformFee: 13.50,
    cleaningFee: 60.00,
    commissionRate: 18,
    commission: 70.20,
    touristTax: 10.00,
    status: "completed",
    isAssigned: true,
    importDate: "2023-10-20"
  },
  {
    id: "BNB-2023-003",
    rentalId: "RENT-003",
    platform: "Airbnb",
    property: "Loft Croix-Rousse",
    guest: "Sophie Bertrand",
    checkIn: "2023-11-20",
    checkOut: "2023-11-25",
    amount: 625.00,
    platformFee: 18.75,
    cleaningFee: 90.00,
    commissionRate: 20,
    commission: 107.00,
    touristTax: 10.00,
    status: "confirmed",
    isAssigned: true,
    importDate: "2023-10-25"
  },
  {
    id: "BNB-2023-004",
    rentalId: "UNKNOWN",
    platform: "Booking",
    property: "Unknown",
    guest: "Thomas Roux",
    checkIn: "2023-12-01",
    checkOut: "2023-12-05",
    amount: 520.00,
    platformFee: 15.60,
    cleaningFee: 65.00,
    commissionRate: 18,
    commission: 82.08,
    touristTax: 8.00,
    status: "pending",
    isAssigned: false,
    importDate: "2023-11-01"
  }
];

// Mock data for BAs
const mockBAs: BA[] = [
  {
    id: "BA-2023-001",
    bookingId: "BNB-2023-001",
    property: "Appartement Bellecour",
    recipient: "BNB Lyon",
    isEntity: true,
    amount: 814.80, // Amount after platform fee
    date: "2023-11-09",
    status: "validated"
  },
  {
    id: "BA-2023-002",
    bookingId: "BNB-2023-002",
    property: "Studio Part-Dieu",
    recipient: "BNB Lyon",
    isEntity: true,
    amount: 436.50, // Amount after platform fee
    date: "2023-11-16",
    status: "locked"
  },
  {
    id: "BA-2023-003",
    bookingId: "BNB-2023-003",
    property: "Loft Croix-Rousse",
    recipient: "Propriétaire LCR",
    isEntity: false,
    amount: 606.25, // Amount after platform fee
    date: "2023-11-26",
    status: "draft"
  }
];

// Update mockInvoices to match the Invoice interface
const mockInvoices: Invoice[] = [
  {
    id: "INV-2023-001",
    bookingId: "BNB-2023-001",
    property: "Appartement Bellecour",
    client: "Marie Dupont",
    owner: "Thomas Dubois",  // Add owner
    date: "2023-11-09",
    dueDate: "2023-11-23",
    lines: [
      { description: "Commission sur séjour", amount: 153.00, type: "commission" },
      { description: "Ménage de fin de séjour", amount: 75.00, type: "cleaning" }
    ],
    total: 228.00,
    amount: 228.00,  // Add amount matching total
    status: "paid",
    relatedBAs: ["BA-2023-001"]
  },
  {
    id: "INV-2023-002",
    bookingId: "BNB-2023-002",
    property: "Studio Part-Dieu",
    client: "Lucas Martin",
    owner: "Sophie Moreau",  // Add owner
    date: "2023-11-16",
    dueDate: "2023-11-30",
    lines: [
      { description: "Commission sur séjour", amount: 70.20, type: "commission" },
      { description: "Ménage de fin de séjour", amount: 60.00, type: "cleaning" }
    ],
    total: 130.20,
    amount: 130.20,  // Add amount matching total
    status: "validated",
    relatedBAs: ["BA-2023-002"]
  }
];

const Billing = () => {
  useEffect(() => {
    document.title = 'Facturation - Concierge Synergy Platform';
  }, []);

  // Hospitable integration
  const { 
    isConfiguring, 
    setIsConfiguring, 
    configMutation, 
    isAuthenticated,
    credentials,
    startImport,
    importQuery,
    importedData
  } = useHospitable();
  
  // État pour le dialogue d'importation Hospitable
  const [hospitableImportOpen, setHospitableImportOpen] = useState(false);
  
  // State for managing imports and data
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [bas, setBas] = useState<BA[]>(mockBAs);
  const [invoices, setInvoices] = useState(mockInvoices);
  
  // State for import dialogs
  const [smilyImportOpen, setSmilyImportOpen] = useState(false);
  const [platformImportOpen, setPlatformImportOpen] = useState(false);
  const [smilyParams, setSmilyParams] = useState<SmilyImportParams>({
    startDate: '',
    endDate: '',
  });
  const [platformParams, setPlatformParams] = useState<PlatformImportParams>({
    platform: 'airbnb',
    startDate: '',
    endDate: '',
  });
  const [isImporting, setIsImporting] = useState(false);
  
  // Mock function to import from SMILY
  const importFromSmily = async (params: SmilyImportParams): Promise<ImportResult> => {
    setIsImporting(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Importing from SMILY with params:', params);
        
        // Mock result
        const result: ImportResult = {
          success: true,
          message: "Import réussi",
          importedCount: 12,
          errorCount: 0,
          unassignedCount: 1
        };
        
        setIsImporting(false);
        resolve(result);
      }, 2000);
    });
  };
  
  // Mock function to import from platforms
  const importFromPlatform = async (params: PlatformImportParams): Promise<ImportResult> => {
    setIsImporting(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Importing from platform with params:', params);
        
        // Mock result
        const result: ImportResult = {
          success: true,
          message: `Import de ${params.platform} réussi`,
          importedCount: params.platform === 'airbnb' ? 8 : (params.platform === 'booking' ? 5 : 3),
          errorCount: params.platform === 'stripe' ? 1 : 0,
          unassignedCount: 2
        };
        
        setIsImporting(false);
        resolve(result);
      }, 2000);
    });
  };
  
  // Handle SMILY import
  const handleSmilyImport = async () => {
    if (!smilyParams.startDate || !smilyParams.endDate) {
      toast.error("Veuillez spécifier les dates de début et de fin");
      return;
    }
    
    try {
      const result = await importFromSmily(smilyParams);
      if (result.success) {
        toast.success(`Import réussi: ${result.importedCount} réservations importées.`);
        if (result.unassignedCount > 0) {
          toast.warning(`${result.unassignedCount} réservations non assignées, vérifiez l'onglet Contrôle.`);
        }
        setSmilyImportOpen(false);
      } else {
        toast.error(`Erreur lors de l'import: ${result.message}`);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'import");
      console.error(error);
    }
  };
  
  // Handle platform import
  const handlePlatformImport = async () => {
    if (!platformParams.startDate || !platformParams.endDate) {
      toast.error("Veuillez spécifier les dates de début et de fin");
      return;
    }
    
    try {
      const result = await importFromPlatform(platformParams);
      if (result.success) {
        toast.success(`Import réussi: ${result.importedCount} entrées importées de ${platformParams.platform}.`);
        if (result.unassignedCount > 0) {
          toast.warning(`${result.unassignedCount} entrées non assignées, vérifiez l'onglet Contrôle.`);
        }
        setPlatformImportOpen(false);
      } else {
        toast.error(`Erreur lors de l'import: ${result.message}`);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'import");
      console.error(error);
    }
  };
  
  const handleHospitableImport = (params: { startDate?: Date; endDate?: Date }) => {
    startImport(params);
    setHospitableImportOpen(false);
  };
  
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

  // Calculate statistics for dashboard
  const calculateStats = () => {
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const pendingAmount = invoices
      .filter(inv => ['draft', 'validated', 'sent'].includes(inv.status))
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    const paidAmount = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    
    const totalBAAmount = bas.reduce((sum, ba) => sum + ba.amount, 0);
    const pendingBAAmount = bas
      .filter(ba => ['draft', 'locked'].includes(ba.status))
      .reduce((sum, ba) => sum + ba.amount, 0);
    
    const bookingRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const commissionRevenue = bookings.reduce((sum, booking) => sum + booking.commission, 0);
    
    return {
      totalInvoiceAmount,
      pendingAmount,
      paidAmount,
      totalBAAmount,
      pendingBAAmount,
      bookingRevenue,
      commissionRevenue,
      recoveryRate: totalInvoiceAmount > 0 ? (paidAmount / totalInvoiceAmount) * 100 : 0
    };
  };
  
  const stats = calculateStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des factures, BA et paiements
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full border-b pb-0 flex flex-nowrap overflow-x-auto">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="control">Contrôle</TabsTrigger>
          <TabsTrigger value="coherence">Cohérence</TabsTrigger>
          <TabsTrigger value="ba">BA</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="touristtax">Taxe de séjour</TabsTrigger>
          <TabsTrigger value="billingcalls">Appels à facturation</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Chiffre d'affaires (mois)" 
              value={`${stats.bookingRevenue.toFixed(2)} €`} 
              icon={<Receipt className="h-5 w-5" />}
              change={{ value: 12, type: 'increase' }}
              className="stagger-1"
            />
            <StatCard 
              title="En attente" 
              value={`${stats.pendingAmount.toFixed(2)} €`} 
              icon={<CreditCard className="h-5 w-5" />}
              className="stagger-2"
            />
            <StatCard 
              title="BA en attente" 
              value={`${stats.pendingBAAmount.toFixed(2)} €`} 
              icon={<Receipt className="h-5 w-5" />}
              change={{ value: 3, type: 'increase' }}
              className="stagger-3"
            />
            <StatCard 
              title="Taux de récupération" 
              value={`${stats.recoveryRate.toFixed(0)}%`} 
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
              title="Derniers paiements" 
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
                          <p className="font-medium">{invoice.client || invoice.owner}</p>
                          <p className="text-sm text-muted-foreground">{invoice.property}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{(invoice.total || invoice.amount)?.toFixed(2)} €</p>
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
                        <TableCell className="font-medium">{(invoice.amount || invoice.total)?.toFixed(2)} €</TableCell>
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
        </TabsContent>
        
        {/* Import Tab Content */}
        <TabsContent value="import" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* SMILY Import Card */}
            <DashboardCard 
              title="Import SMILY" 
              className="md:col-span-1"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Importe l'ensemble des réservations depuis SMILY pour la période spécifiée. Permet d'établir le lien entre les imports financiers et les logements.
                </p>
                
                <Button className="w-full" onClick={() => setSmilyImportOpen(true)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Importer depuis SMILY
                </Button>
              </div>
            </DashboardCard>
            
            {/* Hospitable Import Card */}
            <DashboardCard
              title="Import Hospitable"
              className="md:col-span-1"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Importe les données de réservations depuis Hospitable. Configuration requise avant l'import.
                </p>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    className="w-full" 
                    onClick={() => setIsConfiguring(true)}
                    variant={isAuthenticated ? "outline" : "default"}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {isAuthenticated ? "Reconfigurer Hospitable" : "Configurer Hospitable"}
                  </Button>
                  
                  {isAuthenticated && (
                    <Button 
                      className="w-full" 
                      onClick={() => setHospitableImportOpen(true)}
                      disabled={importQuery.isFetching}
                    >
                      {importQuery.isFetching ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Import en cours...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Importer depuis Hospitable
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </DashboardCard>
            
            {/* Platform Import Card */}
            <DashboardCard 
              title="Import Plateforme" 
              className="md:col-span-1"
            >
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Importe les données de règlement d'Airbnb, Booking ou autres plateformes. Le lien avec les logements est établi via les données SMILY.
                </p>
                
                <Button className="w-full" onClick={() => setPlatformImportOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Importer depuis les plateformes
                </Button>
              </div>
            </DashboardCard>
          </div>
          
          {/* Afficher les données importées si disponibles */}
          {importQuery.data && (
            <DashboardCard title="Données importées depuis Hospitable">
              <HospitableImportedDataSummary data={importQuery.data} />
            </DashboardCard>
          )}
        </TabsContent>
        
        {/* Control Tab Content */}
        <TabsContent value="control" className="space-y-6">
          <DashboardCard title="Contrôle des importations">
            <p className="text-muted-foreground">Vérifiez et assignez les réservations importées.</p>
          </DashboardCard>
        </TabsContent>
        
        {/* Coherence Tab Content */}
        <TabsContent value="coherence" className="space-y-6">
          <DashboardCard title="Vérification de cohérence">
            <p className="text-muted-foreground">Vérifiez la cohérence entre les différentes sources de données.</p>
          </DashboardCard>
        </TabsContent>
        
        {/* BA Tab Content */}
        <TabsContent value="ba" className="space-y-6">
          <DashboardCard title="Bordereaux d'Achat">
            <p className="text-muted-foreground">Gérez les bordereaux d'achat (BA).</p>
          </DashboardCard>
        </TabsContent>
        
        {/* Invoices Tab Content */}
        <TabsContent value="invoices" className="space-y-6">
          <DashboardCard title="Gestion des factures">
            <p className="text-muted-foreground">Créez et gérez les factures.</p>
          </DashboardCard>
        </TabsContent>
        
        {/* Movements Tab Content */}
        <TabsContent value="movements" className="space-y-6">
          <DashboardCard title="Mouvements financiers">
            <p className="text-muted-foreground">Suivez les mouvements financiers.</p>
          </DashboardCard>
        </TabsContent>
        
        {/* Emails Tab Content */}
        <TabsContent value="emails" className="space-y-6">
          <DashboardCard title="Emails et communications">
            <p className="text-muted-foreground">Gérez les communications par email.</p>
          </DashboardCard>
        </TabsContent>
        
        {/* Tourist Tax Tab Content */}
        <TabsContent value="touristtax" className="space-y-6">
          <DashboardCard title="Gestion de la taxe de séjour">
            <p className="text-muted-foreground">Gérez la collecte et le reporting de la taxe de séjour.</p>
          </DashboardCard>
        </TabsContent>
        
        {/* Billing Calls Tab Content */}
        <TabsContent value="billingcalls" className="space-y-6">
          <DashboardCard title="Appels à facturation">
            <p className="text-muted-foreground">Gérez les appels à facturation pour les différents services.</p>
          </DashboardCard>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs for import */}
      <HospitableConfigDialog 
        open={isConfiguring} 
        onOpenChange={setIsConfiguring} 
        initialCredentials={credentials} 
        onSubmit={(credentials) => configMutation.mutate(credentials)}
        isLoading={configMutation.isPending} 
      />
      
      <HospitableImportDialog
        open={hospitableImportOpen}
        onOpenChange={setHospitableImportOpen}
        onImport={handleHospitableImport}
      />
      
      <SmilyImportDialog 
        open={smilyImportOpen}
        onOpenChange={setSmilyImportOpen}
        params={smilyParams}
        onParamsChange={setSmilyParams}
        onImport={handleSmilyImport}
        isLoading={isImporting}
      />
      
      <Dialog open={platformImportOpen} onOpenChange={setPlatformImportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importer depuis les plateformes</DialogTitle>
            <DialogDescription>
              Importez les données de règlement depuis Airbnb, Booking ou Stripe.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plateforme</Label>
              <Select 
                value={platformParams.platform} 
                onValueChange={(value) => setPlatformParams({...platformParams, platform: value as 'airbnb' | 'booking' | 'stripe'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une plateforme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="booking">Booking.com</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={platformParams.startDate}
                  onChange={(e) => setPlatformParams({...platformParams, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={platformParams.endDate}
                  onChange={(e) => setPlatformParams({...platformParams, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Fichier CSV (optionnel)</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPlatformParams({...platformParams, file: e.target.files[0]});
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Vous pouvez importer manuellement un fichier CSV si vous ne souhaitez pas utiliser l'API.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlatformImportOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handlePlatformImport} 
              disabled={isImporting || !platformParams.startDate || !platformParams.endDate}
            >
              {isImporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importation...
                </>
              ) : (
                'Importer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
