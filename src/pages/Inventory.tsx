import { useEffect, useState, useMemo } from 'react';
import { 
  Package, Filter, PlusCircle, Search, 
  AlertTriangle, Check, Plus, Minus,
  Settings, ShoppingCart, CheckCircle, X,
  ExternalLink, Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { StatCard } from '@/components/dashboard/StatCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  min: number;
  status: 'low' | 'ok';
  orderUrl?: string;
}

const initialConsummables: InventoryItem[] = [
  { id: 1, name: 'Papier toilette', category: 'Consommables', stock: 15, min: 20, status: 'low', orderUrl: 'https://www.amazon.fr/dp/B07XQDZJKY' },
  { id: 2, name: 'Savon liquide', category: 'Consommables', stock: 23, min: 15, status: 'low', orderUrl: 'https://www.amazon.fr/dp/B01N7SM8GS' },
  { id: 3, name: 'Éponges', category: 'Consommables', stock: 45, min: 20, status: 'ok', orderUrl: 'https://www.amazon.fr/dp/B07V5FVSML' },
  { id: 4, name: 'Produit vaisselle', category: 'Consommables', stock: 32, min: 15, status: 'ok' },
  { id: 5, name: 'Liquide vaisselle', category: 'Consommables', stock: 28, min: 15, status: 'ok' },
  { id: 6, name: 'Gel douche', category: 'Consommables', stock: 8, min: 20, status: 'low', orderUrl: 'https://www.amazon.fr/dp/B08C7GCHGN' },
  { id: 7, name: 'Shampoing', category: 'Consommables', stock: 12, min: 20, status: 'low', orderUrl: 'https://www.amazon.fr/dp/B08C7GCHGN' },
];

const initialLinen: InventoryItem[] = [
  { id: 10, name: 'Draps 2 personnes', category: 'Linge', stock: 18, min: 10, status: 'ok' },
  { id: 11, name: 'Draps 1 personne', category: 'Linge', stock: 6, min: 10, status: 'low', orderUrl: 'https://www.amazon.fr/dp/B09XYZEXAMPLE' },
  { id: 12, name: 'Serviettes bain', category: 'Linge', stock: 24, min: 15, status: 'ok' },
  { id: 13, name: 'Serviettes main', category: 'Linge', stock: 30, min: 20, status: 'ok' },
  { id: 14, name: 'Taies d\'oreiller', category: 'Linge', stock: 14, min: 20, status: 'low' },
];

const initialMaintenance: InventoryItem[] = [
  { id: 20, name: 'Ampoules LED', category: 'Maintenance', stock: 8, min: 5, status: 'ok', orderUrl: 'https://www.amazon.fr/dp/B07XYZLED' },
  { id: 21, name: 'Pile AA', category: 'Maintenance', stock: 12, min: 10, status: 'ok', orderUrl: 'https://www.amazon.fr/dp/B07XYZPILE' },
  { id: 22, name: 'Ruban adhésif', category: 'Maintenance', stock: 3, min: 5, status: 'low', orderUrl: 'https://www.amazon.fr/dp/B07XYZRUBAN' },
];

const categories = [
  { key: 'all', label: 'Tous' },
  { key: 'consumables', label: 'Consommables' },
  { key: 'linen', label: 'Linge' },
  { key: 'maintenance', label: 'Maintenance' },
];

const Inventory = () => {
  const isMobile = useIsMobile();
  const [consummables, setConsummables] = useState<InventoryItem[]>(initialConsummables);
  const [linen, setLinen] = useState<InventoryItem[]>(initialLinen);
  const [maintenance, setMaintenance] = useState<InventoryItem[]>(initialMaintenance);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('1');
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'Consommables',
    stock: '0',
    min: '10',
    orderUrl: ''
  });
  const [editOrderUrl, setEditOrderUrl] = useState('');

  const allItems = [...consummables, ...linen, ...maintenance];
  const alertsCount = allItems.filter(item => item.status === 'low').length;

  useEffect(() => {
    document.title = 'Entrepôt - GESTION BNB LYON';
  }, []);

  const filterItems = (items: InventoryItem[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getDisplayItems = () => {
    switch (activeCategory) {
      case 'consumables': return filterItems(consummables);
      case 'linen': return filterItems(linen);
      case 'maintenance': return filterItems(maintenance);
      default: return filterItems(allItems);
    }
  };

  const updateInventoryItem = (category: string, itemId: number, newStock: number) => {
    const updateStatus = (stock: number, min: number): 'low' | 'ok' => stock < min ? 'low' : 'ok';
    switch(category) {
      case 'Consommables':
        setConsummables(prev => prev.map(item => 
          item.id === itemId ? { ...item, stock: newStock, status: updateStatus(newStock, item.min) } : item
        ));
        break;
      case 'Linge':
        setLinen(prev => prev.map(item => 
          item.id === itemId ? { ...item, stock: newStock, status: updateStatus(newStock, item.min) } : item
        ));
        break;
      case 'Maintenance':
        setMaintenance(prev => prev.map(item => 
          item.id === itemId ? { ...item, stock: newStock, status: updateStatus(newStock, item.min) } : item
        ));
        break;
    }
  };

  const handleManageItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setAdjustmentAmount('1');
    setEditOrderUrl(item.orderUrl || '');
    setManageDialogOpen(true);
  };

  const handleAdjustStock = (increase: boolean) => {
    if (!currentItem) return;
    const amount = parseInt(adjustmentAmount, 10) || 0;
    if (amount <= 0) { toast.error("Veuillez entrer une quantité valide"); return; }
    const newStock = increase ? currentItem.stock + amount : Math.max(0, currentItem.stock - amount);
    updateInventoryItem(currentItem.category, currentItem.id, newStock);
    toast.success(`Stock ${increase ? 'augmenté' : 'diminué'} de ${amount} unités`);
    setManageDialogOpen(false);
  };

  const handleAddItem = () => {
    const { name, category, stock, min, orderUrl } = newItemData;
    if (!name.trim()) { toast.error("Veuillez entrer un nom"); return; }
    const stockNum = parseInt(stock, 10) || 0;
    const minNum = parseInt(min, 10) || 0;
    const newItem: InventoryItem = {
      id: Date.now(),
      name: name.trim(),
      category,
      stock: stockNum,
      min: minNum,
      status: stockNum < minNum ? 'low' : 'ok',
      orderUrl: orderUrl.trim() || undefined
    };
    switch(category) {
      case 'Consommables': setConsummables(prev => [...prev, newItem]); break;
      case 'Linge': setLinen(prev => [...prev, newItem]); break;
      case 'Maintenance': setMaintenance(prev => [...prev, newItem]); break;
    }
    toast.success(`Article "${name}" ajouté avec succès`);
    setNewItemDialogOpen(false);
    setNewItemData({ name: '', category: 'Consommables', stock: '0', min: '10', orderUrl: '' });
  };

  const handleOrderClick = (item: InventoryItem) => {
    if (item.orderUrl) {
      window.open(item.orderUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.info('Aucun lien de commande configuré. Cliquez sur "Gérer" pour ajouter un lien.');
    }
  };

  const handleSaveOrderUrl = () => {
    if (!currentItem) return;
    const updateFn = (prev: InventoryItem[]) => prev.map(item =>
      item.id === currentItem.id ? { ...item, orderUrl: editOrderUrl.trim() || undefined } : item
    );
    switch(currentItem.category) {
      case 'Consommables': setConsummables(updateFn); break;
      case 'Linge': setLinen(updateFn); break;
      case 'Maintenance': setMaintenance(updateFn); break;
    }
    toast.success('Lien de commande mis à jour');
  };

  const getStockRatio = (stock: number, min: number) => stock / min;
  const getProgressColor = (ratio: number) => {
    if (ratio >= 1.5) return 'bg-[hsl(142,72%,29%)]';
    if (ratio >= 1.0) return 'bg-[hsl(38,92%,50%)]';
    return 'bg-[hsl(0,72%,51%)]';
  };
  const getProgressWidth = (stock: number, min: number) => Math.min((stock / (min * 2)) * 100, 100);

  const displayItems = getDisplayItems();

  // Mobile card for an item
  const renderMobileCard = (item: InventoryItem) => {
    const ratio = getStockRatio(item.stock, item.min);
    return (
      <div key={item.id} className="bg-card rounded-xl border border-border p-3.5 mb-2 shadow-sm">
        {/* Line 1: Name + Status */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-foreground truncate max-w-[180px]">
            {item.name}
          </span>
          {item.status === 'low' ? (
            <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[hsl(0,86%,94%)] text-[hsl(0,72%,51%)] whitespace-nowrap">
              Stock bas
            </span>
          ) : (
            <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[hsl(142,76%,92%)] text-[hsl(142,72%,29%)] whitespace-nowrap">
              OK
            </span>
          )}
        </div>

        {/* Line 2: Stock values */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-bold text-foreground">{item.stock}</span>
            <span className="text-[11px] text-muted-foreground">unités</span>
          </div>
          <div className="w-px h-5 bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Minimum</span>
            <span className="text-[13px] font-semibold text-muted-foreground">{item.min}</span>
          </div>
        </div>

        {/* Line 3: Progress bar */}
        <div className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getProgressColor(ratio)}`}
            style={{ width: `${getProgressWidth(item.stock, item.min)}%` }}
          />
        </div>

        {/* Line 4: Actions */}
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => handleManageItem(item)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card text-xs text-foreground hover:bg-accent/50 transition-colors"
          >
            <Settings className="h-3 w-3" />
            Gérer
          </button>
          {item.status === 'low' && (
            <button
              onClick={() => toast.info('Fonctionnalité bientôt disponible')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="h-3 w-3" />
              Commander
            </button>
          )}
        </div>
      </div>
    );
  };

  // Desktop table
  const renderDesktopTable = (items: InventoryItem[]) => (
    <Table>
      <TableHeader>
        <TableRow className="border-b-2 border-border">
          <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground min-w-[140px]">Nom</TableHead>
          <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground min-w-[100px]">Stock</TableHead>
          <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground min-w-[80px]">Minimum</TableHead>
          <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground min-w-[90px]">Statut</TableHead>
          <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground min-w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id} className="h-14 border-b border-border/50">
            <TableCell className="font-medium text-foreground">{item.name}</TableCell>
            <TableCell>
              <span className="text-sm font-semibold text-foreground">{item.stock}</span>
              <span className="text-[11px] text-muted-foreground ml-1">unités</span>
            </TableCell>
            <TableCell className="text-muted-foreground">{item.min}</TableCell>
            <TableCell>
              {item.status === 'low' ? (
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[hsl(0,86%,94%)] text-[hsl(0,72%,51%)]">
                  Stock bas
                </span>
              ) : (
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[hsl(142,76%,92%)] text-[hsl(142,72%,29%)]">
                  OK
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => handleManageItem(item)}>
                Gérer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground mb-4">Aucun article dans cette catégorie</p>
      <Button size="sm" onClick={() => setNewItemDialogOpen(true)} className="gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Ajouter un article
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Entrepôt</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestion des stocks et consommables
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          title="Total articles" 
          value={allItems.length.toString()} 
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard 
          title="Alertes stock" 
          value={alertsCount.toString()} 
          icon={<AlertTriangle className="h-5 w-5" />}
          change={{ value: alertsCount, type: alertsCount > 0 ? 'increase' : 'decrease' }}
        />
        <StatCard 
          title="Consommables" 
          value={consummables.length.toString()} 
          icon={<Check className="h-5 w-5" />}
        />
        <StatCard 
          title="Linge" 
          value={linen.length.toString()} 
          icon={<Check className="h-5 w-5" />}
        />
      </div>
      
      {/* Section header */}
      <div className="bg-card rounded-xl border border-border p-4">
        {/* Title + buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-bold text-foreground whitespace-nowrap">Gestion des stocks</h2>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" className="h-9 gap-1.5 text-xs whitespace-nowrap">
              <Filter className="h-3.5 w-3.5" />
              {!isMobile && 'Filtrer'}
            </Button>
            <Button size="sm" className="h-9 gap-1.5 text-xs whitespace-nowrap" onClick={() => setNewItemDialogOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un article..." 
            className="h-11 pl-9 rounded-xl bg-muted/50 border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full text-[13px] transition-colors ${
                activeCategory === cat.key
                  ? 'bg-foreground text-background font-semibold'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {displayItems.length === 0 ? (
          renderEmptyState()
        ) : isMobile ? (
          <div>{displayItems.map(renderMobileCard)}</div>
        ) : (
          renderDesktopTable(displayItems)
        )}
      </div>

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
                  onChange={(e) => setAdjustmentAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-24 mr-4"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleAdjustStock(false)}>
                    <Minus className="h-4 w-4" />
                    Retirer
                  </Button>
                  <Button size="sm" className="gap-1" onClick={() => handleAdjustStock(true)}>
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
              <Input id="name" value={newItemData.name} onChange={(e) => setNewItemData({...newItemData, name: e.target.value})} placeholder="ex: Papier toilette" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                <Input id="stock" value={newItemData.stock} onChange={(e) => setNewItemData({...newItemData, stock: e.target.value.replace(/[^0-9]/g, '')})} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min">Stock minimum</Label>
                <Input id="min" value={newItemData.min} onChange={(e) => setNewItemData({...newItemData, min: e.target.value.replace(/[^0-9]/g, '')})} placeholder="10" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewItemDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddItem}>Ajouter l'article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
