
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, CalendarCheck, CalendarClock, TrendingUp, Building2, 
  ArrowRight, CheckCircle2, Clock, Pause 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OwnerProperty {
  id: string;
  name: string;
  address: string;
  type: string;
  status: 'active' | 'onboarding' | 'suspended';
  currentBookings: number;
  nextCheckin?: string;
  nextCheckout?: string;
  monthlyRevenue: number;
}

const MOCK_PROPERTIES: OwnerProperty[] = [
  {
    id: '1',
    name: 'Appartement Marais',
    address: '15 rue des Francs-Bourgeois, 75004 Paris',
    type: 'T2 – 45m²',
    status: 'active',
    currentBookings: 3,
    nextCheckin: '2026-02-19',
    nextCheckout: '2026-02-18',
    monthlyRevenue: 3420,
  },
  {
    id: '2',
    name: 'Studio Montmartre',
    address: '8 rue Lepic, 75018 Paris',
    type: 'Studio – 28m²',
    status: 'onboarding',
    currentBookings: 0,
    monthlyRevenue: 0,
  },
];

const statusConfig = {
  active: { label: 'Actif', variant: 'default' as const, icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  onboarding: { label: 'En onboarding', variant: 'secondary' as const, icon: Clock, className: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  suspended: { label: 'Suspendu', variant: 'destructive' as const, icon: Pause, className: 'bg-red-500/10 text-red-600 border-red-200' },
};

interface OwnerDashboardProps {
  userName: string;
}

export function OwnerDashboard({ userName }: OwnerDashboardProps) {
  const totalBookings = MOCK_PROPERTIES.reduce((sum, p) => sum + p.currentBookings, 0);
  const totalRevenue = MOCK_PROPERTIES.reduce((sum, p) => sum + p.monthlyRevenue, 0);
  const nextCheckin = MOCK_PROPERTIES.find(p => p.nextCheckin)?.nextCheckin;
  const nextCheckout = MOCK_PROPERTIES.find(p => p.nextCheckout)?.nextCheckout;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bonjour, {userName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue sur votre espace propriétaire. Retrouvez ici toutes les informations relatives à vos biens.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{MOCK_PROPERTIES.length}</p>
                <p className="text-xs text-muted-foreground">Biens</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CalendarCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalBookings}</p>
                <p className="text-xs text-muted-foreground">Réservations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <CalendarClock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">{formatDate(nextCheckin)}</p>
                <p className="text-xs text-muted-foreground">Prochain check-in</p>
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
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString('fr-FR')}€</p>
                <p className="text-xs text-muted-foreground">Revenus du mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Mes biens</h2>
        <div className="space-y-3">
          {MOCK_PROPERTIES.map(property => {
            const status = statusConfig[property.status];
            const StatusIcon = status.icon;
            return (
              <Card key={property.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Home className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{property.name}</h3>
                        <p className="text-sm text-muted-foreground">{property.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">{property.type}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", status.className)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  {property.status === 'active' && (
                    <div className="mt-4 pt-3 border-t flex items-center gap-6 text-sm text-muted-foreground">
                      <span><strong className="text-foreground">{property.currentBookings}</strong> réservations en cours</span>
                      {property.nextCheckin && <span>Check-in : <strong className="text-foreground">{formatDate(property.nextCheckin)}</strong></span>}
                      {property.nextCheckout && <span>Check-out : <strong className="text-foreground">{formatDate(property.nextCheckout)}</strong></span>}
                      <span className="ml-auto font-semibold text-foreground">{property.monthlyRevenue.toLocaleString('fr-FR')}€ /mois</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
