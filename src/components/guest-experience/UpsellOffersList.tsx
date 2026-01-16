
import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Gift,
  TrendingUp,
  Eye,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UpsellOffer } from '@/types/guestExperience';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UpsellOffersListProps {
  upsells: UpsellOffer[];
  onCreateUpsell: () => void;
  onEditUpsell: (upsell: UpsellOffer) => void;
  onDeleteUpsell: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const getTriggerLabel = (trigger: UpsellOffer['trigger']) => {
  switch (trigger) {
    case 'after_booking':
      return 'Après réservation';
    case 'before_arrival':
      return 'Avant arrivée';
    case 'during_stay':
      return 'Pendant le séjour';
    case 'manual':
      return 'Manuel';
  }
};

export function UpsellOffersList({
  upsells,
  onCreateUpsell,
  onEditUpsell,
  onDeleteUpsell,
  onToggleStatus,
}: UpsellOffersListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrigger, setFilterTrigger] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredUpsells = upsells.filter(upsell => {
    const matchesSearch = upsell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upsell.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrigger = filterTrigger === 'all' || upsell.trigger === filterTrigger;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && upsell.isActive) ||
      (filterStatus === 'inactive' && !upsell.isActive);
    
    return matchesSearch && matchesTrigger && matchesStatus;
  });

  // Calculate stats
  const totalRevenue = upsells.reduce((acc, u) => acc + (u.conversionCount * (u.price || 0)), 0);
  const totalConversions = upsells.reduce((acc, u) => acc + u.conversionCount, 0);
  const totalViews = upsells.reduce((acc, u) => acc + u.viewCount, 0);
  const avgConversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenus générés</CardDescription>
            <CardTitle className="text-2xl">{totalRevenue}€</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversions</CardDescription>
            <CardTitle className="text-2xl">{totalConversions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vues totales</CardDescription>
            <CardTitle className="text-2xl">{totalViews}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taux de conversion</CardDescription>
            <CardTitle className="text-2xl">{avgConversionRate.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Offres Upsell</CardTitle>
          <Button onClick={onCreateUpsell}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle offre
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une offre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterTrigger} onValueChange={setFilterTrigger}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Déclencheur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="after_booking">Après réservation</SelectItem>
                <SelectItem value="before_arrival">Avant arrivée</SelectItem>
                <SelectItem value="during_stay">Pendant séjour</SelectItem>
                <SelectItem value="manual">Manuel</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upsells Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUpsells.map(upsell => {
              const conversionRate = upsell.viewCount > 0 
                ? (upsell.conversionCount / upsell.viewCount) * 100 
                : 0;
              const revenue = upsell.conversionCount * (upsell.price || 0);

              return (
                <Card key={upsell.id} className={!upsell.isActive ? 'opacity-60' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{upsell.name}</h4>
                          <Badge variant="outline" className="mt-1">
                            {getTriggerLabel(upsell.trigger)}
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={upsell.isActive}
                        onCheckedChange={() => onToggleStatus(upsell.id)}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {upsell.description}
                    </p>

                    {upsell.price && (
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{upsell.price}€</span>
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          Vues
                        </div>
                        <span>{upsell.viewCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          Conversions
                        </div>
                        <span>{upsell.conversionCount}</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Taux</span>
                          <span className="font-medium">{conversionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={conversionRate} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Revenu: </span>
                        <span className="font-semibold text-primary">{revenue}€</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEditUpsell(upsell)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => onDeleteUpsell(upsell.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredUpsells.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune offre trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
