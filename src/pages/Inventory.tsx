import { useEffect, useState } from 'react';
import { 
  Package, Filter, PlusCircle, Search, 
  AlertTriangle, ArrowUpDown, Check, Plus, Minus
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Interface for inventory items
interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  min: number;
  status: 'low' | 'ok';
}

// Mock data, now as state inside the component
const initialConsummables: InventoryItem[] = [
  { id: 1, name: 'Papier toilette', category: 'Consommables', stock: 15, min: 20, status: 'low' },
  { id: 2, name: 'Savon liquide', category: 'Consommables', stock: 23, min: 15, status: 'low' },
  { id: 3, name: 'Éponges', category: 'Consommables', stock: 45, min: 20, status: 'ok' },
  { id: 4, name: 'Produit vaisselle', category: 'Consommables', stock: 32, min: 15, status: 'ok' },
  { id: 5, name: 'Liquide vaisselle', category: 'Consommables', stock: 28, min: 15, status: 'ok' },
];

const initialLinen: InventoryItem[] = [
  { id: 1, name: 'Draps king size', category: 'Linge', stock: 28, min: 15, status: 'ok' },
  { id: 2, name: 'Housses couette', category: 'Linge', stock: 18, min: 20, status: 'low' },
  { id: 3, name: 'Serviettes bain', category: 'Linge', stock: 52, min: 30, status: 'ok' },
  { id: 4, name: 'Serviettes main', category: 'Linge', stock: 64, min: 30, status: 'ok' },
  { id: 5, name: 'Taies d\'oreiller', category: 'Linge', stock: 35, min: 20, status: 'ok' },
];

const initialMaintenance: InventoryItem[] = [
  { id: 1, name: 'Ampoules LED', category: 'Maintenance', stock: 24, min: 10, status: 'ok' },
  { id: 2, name: 'Joints silicone', category: 'Maintenance', stock: 8, min: 5, status: 'ok' },
  { id: 3, name: 'Piles AA', category: 'Maintenance', stock: 16, min: 20, status: 'low' },
  { id: 4, name: 'Fusibles', category: 'Maintenance', stock: 12, min: 10, status: 'ok' },
  { id: 5, name: 'Ruban adhésif', category: 'Maintenance', stock: 4, min: 3, status: 'ok' },
];

const Inventory = () => {
  // State for inventory items
  const [consummables, setConsummables] = useState<InventoryItem[]>(initialConsummables);
  const [linen, setLinen] = useState<InventoryItem[]>(initialLinen);
  const [maintenance, setMaintenance] = useState<InventoryItem[]>(initialMaintenance);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog state
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('1');
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'Consommables',
    stock: '0',
    min: '10'
  });

  // Get all alerts count
  const alertsCount = [
    ...consummables.filter(item => item.status === 'low'),
    ...linen.filter(item => item.status === 'low'),
    ...maintenance.filter(item => item.status === 'low')
  ].length;

  useEffect(() => {
    document.title = 'Entrepôt - GESTION BNB LYON';
  }, []);

  // Filter items based on search query
  const filterItems = (items: InventoryItem[]) => {
    if (!searchQuery.trim()) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Update inventory item
  const updateInventoryItem = (category: string, itemId: number, newStock: number) => {
    const updateStatus = (stock: number, min: number) => stock < min ? 'low' : 'ok';
    
    switch(category) {
      case 'Consommables':
        setConsummables(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, stock: newStock, status: updateStatus(newStock, item.min) }
            : item
        ));
        break;
      case 'Linge':
        setLinen(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, stock: newStock, status: updateStatus(newStock, item.min) }
            : item
        ));
        break;
      case 'Maintenance':
        setMaintenance(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, stock: newStock, status: updateStatus(newStock, item.min) }
            : item
        ));
        break;
    }
  };

  // Open manage dialog for an item
  const handleManageItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setAdjustmentAmount('1');
    setManageDialogOpen(true);
  };

  // Adjust stock level
  const handleAdjustStock = (increase: boolean) => {
    if (!currentItem) return;
    
    const amount = parseInt(adjustmentAmount, 10) || 0;
    if (amount <= 0) {
      toast.error("Veuillez entrer une quantité valide");
      return;
    }
    
    const newStock = increase 
      ? currentItem.stock + amount 
      : Math.max(0, currentItem.stock - amount);
    
    updateInventoryItem(currentItem.category, currentItem.id, newStock);
    
    toast.success(`Stock ${increase ? 'augmenté' : 'diminué'} de ${amount} unités`);
    setManageDialogOpen(false);
  };

  // Add new item
  const handleAddItem = () => {
    const { name, category, stock, min } = newItemData;
    
    if (!name.trim()) {
      toast.error("Veuillez entrer un nom");
      return;
    }
    
    const stockNum = parseInt(stock, 10) || 0;
    const minNum = parseInt(min, 10) || 0;
    
    const newItem: InventoryItem = {
      id: Date.now(), // Generate a unique ID
      name: name.trim(),
      category,
      stock: stockNum,
      min: minNum,
      status: stockNum < minNum ? 'low' : 'ok'
    };
    
    switch(category) {
      case 'Consommables':
        setConsummables(prev => [...prev, newItem]);
        break;
      case 'Linge':
        setLinen(prev => [...prev, newItem]);
        break;
      case 'Maintenance':
        setMaintenance(prev => [...prev, newItem]);
        break;
    }
    
    toast.success(`Article "${name}" ajouté avec succès`);
    setNewItemDialogOpen(false);
    setNewItemData({
      name: '',
      category: 'Consommables',
      stock: '0',
      min: '10'
    });
  };

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
          value={(consummables.length + linen.length + maintenance.length).toString()} 
          icon={<Package className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="Alertes stock" 
          value={alertsCount.toString()} 
          icon={<AlertTriangle className="h-5 w-5" />}
          change={{ value: alertsCount > 4 ? alertsCount - 4 : 0, type: alertsCount > 4 ? 'increase' : 'decrease' }}
          className="stagger-2"
        />
        <StatCard 
          title="Consommables" 
          value={consummables.length.toString()} 
          icon={<Check className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Linge" 
          value={linen.length.toString()} 
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
            <Button 
              size="sm" 
              className="gap-1"
              onClick={() => setNewItemDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un article..." 
              className="h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                  {filterItems(consummables).map((item) => (
                    <TableRow key={item.id} className="animate-slide-up">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{renderStockStatus(item.stock, item.min)}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleManageItem(item)}
                        >
                          Gérer
                        </Button>
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
                  {filterItems(linen).map((item) => (
                    <TableRow key={item.id} className="animate-slide-up">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{renderStockStatus(item.stock, item.min)}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleManageItem(item)}
                        >
                          Gérer
                        </Button>
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
                  {filterItems(maintenance).map((item) => (
                    <TableRow key={item.id} className="animate-slide-up">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{renderStockStatus(item.stock, item.min)}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleManageItem(item)}
                        >
                          Gérer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardCard>

      {/* Manage Item Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer le stock: {currentItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Stock actuel: {currentItem?.stock} unités</Label>
              <p className="text-sm text-muted-foreground">
                Minimum requis: {currentItem?.min} unités
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adjustment">Quantité à ajuster</Label>
              <div className="flex items-center">
                <Input
                  id="adjustment"
                  value={adjustmentAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setAdjustmentAmount(value);
                  }}
                  className="w-24 mr-4"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-1"
                    onClick={() => handleAdjustStock(false)}
                  >
                    <Minus className="h-4 w-4" />
                    Retirer
                  </Button>
                  <Button 
                    size="sm"
                    className="gap-1"
                    onClick={() => handleAdjustStock(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'article</Label>
              <Input
                id="name"
                value={newItemData.name}
                onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                placeholder="ex: Papier toilette"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newItemData.category}
                onChange={(e) => setNewItemData({...newItemData, category: e.target.value})}
              >
                <option value="Consommables">Consommables</option>
                <option value="Linge">Linge</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock initial</Label>
                <Input
                  id="stock"
                  value={newItemData.stock}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setNewItemData({...newItemData, stock: value});
                  }}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min">Stock minimum</Label>
                <Input
                  id="min"
                  value={newItemData.min}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setNewItemData({...newItemData, min: value});
                  }}
                  placeholder="10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewItemDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleAddItem}>
              Ajouter l'article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
