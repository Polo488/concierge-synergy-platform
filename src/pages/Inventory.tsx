
import { useEffect } from 'react';
import { 
  Package, Filter, PlusCircle, Search, 
  AlertTriangle, ArrowUpDown, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock data
const consummables = [
  { id: 1, name: 'Papier toilette', category: 'Consommables', stock: 15, min: 20, status: 'low' },
  { id: 2, name: 'Savon liquide', category: 'Consommables', stock: 23, min: 15, status: 'low' },
  { id: 3, name: 'Éponges', category: 'Consommables', stock: 45, min: 20, status: 'ok' },
  { id: 4, name: 'Produit vaisselle', category: 'Consommables', stock: 32, min: 15, status: 'ok' },
  { id: 5, name: 'Liquide vaisselle', category: 'Consommables', stock: 28, min: 15, status: 'ok' },
];

const linen = [
  { id: 1, name: 'Draps king size', category: 'Linge', stock: 28, min: 15, status: 'ok' },
  { id: 2, name: 'Housses couette', category: 'Linge', stock: 18, min: 20, status: 'low' },
  { id: 3, name: 'Serviettes bain', category: 'Linge', stock: 52, min: 30, status: 'ok' },
  { id: 4, name: 'Serviettes main', category: 'Linge', stock: 64, min: 30, status: 'ok' },
  { id: 5, name: 'Taies d\'oreiller', category: 'Linge', stock: 35, min: 20, status: 'ok' },
];

const maintenance = [
  { id: 1, name: 'Ampoules LED', category: 'Maintenance', stock: 24, min: 10, status: 'ok' },
  { id: 2, name: 'Joints silicone', category: 'Maintenance', stock: 8, min: 5, status: 'ok' },
  { id: 3, name: 'Piles AA', category: 'Maintenance', stock: 16, min: 20, status: 'low' },
  { id: 4, name: 'Fusibles', category: 'Maintenance', stock: 12, min: 10, status: 'ok' },
  { id: 5, name: 'Ruban adhésif', category: 'Maintenance', stock: 4, min: 3, status: 'ok' },
];

const Inventory = () => {
  useEffect(() => {
    document.title = 'Entrepôt - GESTION BNB LYON';
  }, []);

  const renderStockStatus = (stock: number, min: number) => {
    const percentage = (stock / min) * 100;
    
    return (
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs mb-1">
          <span>{stock} unités</span>
          <span>Min: {min}</span>
        </div>
        <Progress 
          value={percentage > 100 ? 100 : percentage} 
          className="h-2"
          indicatorClassName={
            percentage < 50 
              ? "bg-red-500" 
              : percentage < 80 
                ? "bg-yellow-500" 
                : "bg-green-500"
          }
        />
      </div>
    );
  };

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'low':
        return <Badge variant="destructive" className="rounded-full">Stock bas</Badge>;
      case 'ok':
        return <Badge variant="outline" className="bg-green-50 text-green-700 rounded-full">OK</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Entrepôt</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des stocks: consommables, linge et matériel
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total articles" 
          value="156" 
          icon={<Package className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="Alertes stock" 
          value="4" 
          icon={<AlertTriangle className="h-5 w-5" />}
          change={{ value: 1, type: 'increase' }}
          className="stagger-2"
        />
        <StatCard 
          title="Consommables" 
          value="48" 
          icon={<Check className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Linge" 
          value="85" 
          icon={<Check className="h-5 w-5" />}
          className="stagger-4"
        />
      </div>
      
      {/* Inventory management */}
      <DashboardCard 
        title="Gestion des stocks"
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un article..." className="h-9" />
          </div>
          
          <Tabs defaultValue="consumables">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="consumables">Consommables</TabsTrigger>
              <TabsTrigger value="linen">Linge</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="consumables" className="animate-slide-up">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Stock
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consummables.map((item) => (
                    <TableRow key={item.id} className="animate-slide-up">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{renderStockStatus(item.stock, item.min)}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Gérer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="linen" className="animate-slide-up">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Stock
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linen.map((item) => (
                    <TableRow key={item.id} className="animate-slide-up">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{renderStockStatus(item.stock, item.min)}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Gérer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="maintenance" className="animate-slide-up">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Stock
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance.map((item) => (
                    <TableRow key={item.id} className="animate-slide-up">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{renderStockStatus(item.stock, item.min)}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Gérer</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Inventory;
