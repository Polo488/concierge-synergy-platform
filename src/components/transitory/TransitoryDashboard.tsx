
import { useState } from 'react';
import { useTransitoryData } from '@/hooks/useTransitoryData';
import {
  COMMERCIALIZATION_LABELS,
  SUSPENSION_LABELS,
  STATUS_LABELS,
  type TransitoryProperty,
} from '@/types/transitory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from 'recharts';
import {
  Building2, TrendingUp, Percent, BadgeDollarSign, Search,
  FileDown, ArrowUpRight, ArrowDownRight, Eye, Ban, CheckCircle2,
  Timer, BarChart3, Home, Zap, CalendarDays,
} from 'lucide-react';
import { toast } from 'sonner';

export const TransitoryDashboard = () => {
  const {
    properties,
    allProperties,
    bookings,
    monthlyData,
    networkKPIs,
    statusFilter,
    setStatusFilter,
    commercializationFilter,
    setCommercializationFilter,
    searchQuery,
    setSearchQuery,
  } = useTransitoryData();

  const [selectedProperty, setSelectedProperty] = useState<TransitoryProperty | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const getStatusBadge = (status: TransitoryProperty['transitoryStatus']) => {
    const map = {
      active: 'success' as const,
      suspended: 'warning' as const,
      completed: 'secondary' as const,
    };
    return <Badge variant={map[status]}>{STATUS_LABELS[status]}</Badge>;
  };

  const getCommBadge = (status: TransitoryProperty['commercializationStatus']) => {
    const map = {
      vente: 'info' as const,
      relocation: 'pending' as const,
      mixte: 'default' as const,
    };
    return <Badge variant={map[status]}>{COMMERCIALIZATION_LABELS[status]}</Badge>;
  };

  const handleExportPDF = (property: TransitoryProperty) => {
    toast.success(`Export PDF généré pour ${property.propertyName}`);
  };

  const propertyBookings = selectedProperty
    ? bookings.filter(b => b.propertyId === selectedProperty.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            LCD Transitoire – Commercialisation
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Transformez la vacance en revenu pendant la commercialisation
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="properties">Biens en commercialisation</TabsTrigger>
          <TabsTrigger value="network">Réseau</TabsTrigger>
        </TabsList>

        {/* ─── OVERVIEW TAB ─── */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Biens actifs"
              value={networkKPIs.totalActiveProperties.toString()}
              subtitle={`sur ${allProperties.length} total`}
              icon={Building2}
              trend="+3 ce mois"
              trendUp
            />
            <KPICard
              title="Revenu transitoire total"
              value={formatCurrency(networkKPIs.totalTransitoryRevenue)}
              subtitle="depuis le début"
              icon={BadgeDollarSign}
              trend="+12% vs mois dernier"
              trendUp
            />
            <KPICard
              title="Revenu récupéré sur vacance"
              value={formatCurrency(networkKPIs.totalRevenueRecovered)}
              subtitle="qui aurait été perdu"
              icon={TrendingUp}
              trend="Gain net"
              trendUp
              highlight
            />
            <KPICard
              title="Taux d'occupation transitoire"
              value={`${networkKPIs.avgOccupancyRate}%`}
              subtitle="moyenne réseau"
              icon={Percent}
              trend={`${networkKPIs.avgDaysInCommercialization}j moy. en comm.`}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Revenus transitoires mensuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Revenu" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Revenu récupéré sur vacance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenueRecovered"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2) / 0.15)"
                        strokeWidth={2}
                        name="Récupéré"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top performers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Top biens – Revenu transitoire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...allProperties]
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 5)
                  .map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition cursor-pointer"
                      onClick={() => { setSelectedProperty(p); }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium">{p.propertyName}</p>
                          <p className="text-xs text-muted-foreground">{p.agencyName} · {p.daysInCommercialization}j</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{formatCurrency(p.totalRevenue)}</p>
                        <p className="text-xs text-muted-foreground">{p.occupancyRate}% occ.</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── PROPERTIES TAB ─── */}
        <TabsContent value="properties" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un bien..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={commercializationFilter} onValueChange={(v: any) => setCommercializationFilter(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type commercialisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="vente">Vente active</SelectItem>
                <SelectItem value="relocation">Relocation</SelectItem>
                <SelectItem value="mixte">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bien</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Revenu</TableHead>
                    <TableHead className="text-right">Marge</TableHead>
                    <TableHead className="text-right">Occ.</TableHead>
                    <TableHead className="text-right">Durée</TableHead>
                    <TableHead className="text-right">Récupéré</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map(p => (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-accent/30" onClick={() => setSelectedProperty(p)}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{p.propertyName}</p>
                          <p className="text-xs text-muted-foreground">{p.agencyName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getCommBadge(p.commercializationStatus)}</TableCell>
                      <TableCell>{getStatusBadge(p.transitoryStatus)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(p.totalRevenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(p.netMargin)}</TableCell>
                      <TableCell className="text-right">{p.occupancyRate}%</TableCell>
                      <TableCell className="text-right">{p.daysInCommercialization}j</TableCell>
                      <TableCell className="text-right font-medium text-primary">{formatCurrency(p.revenueRecovered)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setSelectedProperty(p); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── NETWORK TAB ─── */}
        <TabsContent value="network" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Biens en commercialisation"
              value={networkKPIs.totalActiveProperties.toString()}
              icon={Home}
            />
            <KPICard
              title="% biens générant revenu"
              value={`${networkKPIs.percentPropertiesGeneratingRevenue}%`}
              icon={Percent}
            />
            <KPICard
              title="Gain moyen / bien"
              value={formatCurrency(networkKPIs.avgRevenuePerProperty)}
              icon={BadgeDollarSign}
            />
            <KPICard
              title="Revenu total réseau"
              value={formatCurrency(networkKPIs.totalTransitoryRevenue)}
              icon={TrendingUp}
              highlight
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenus générés par vacance transformée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v: number) => formatCurrency(v)}
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Revenu brut" />
                    <Bar dataKey="revenueRecovered" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} name="Récupéré" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* By agency breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance par agence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(allProperties.map(p => p.agencyName))).map(agency => {
                  const agencyProps = allProperties.filter(p => p.agencyName === agency);
                  const rev = agencyProps.reduce((s, p) => s + p.totalRevenue, 0);
                  const active = agencyProps.filter(p => p.transitoryStatus === 'active').length;
                  return (
                    <div key={agency} className="flex items-center justify-between p-3 rounded-xl bg-accent/20">
                      <div>
                        <p className="text-sm font-medium">{agency}</p>
                        <p className="text-xs text-muted-foreground">{active} actifs / {agencyProps.length} total</p>
                      </div>
                      <p className="font-semibold text-sm">{formatCurrency(rev)}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── PROPERTY DETAIL DIALOG ─── */}
      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  {selectedProperty.propertyName}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  {getCommBadge(selectedProperty.commercializationStatus)}
                  {getStatusBadge(selectedProperty.transitoryStatus)}
                  <span className="text-xs">· {selectedProperty.agencyName}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Benchmark banner */}
              <div className={`rounded-xl p-4 text-center ${
                selectedProperty.occupancyRate >= 50
                  ? 'bg-status-success-light border border-status-success/20'
                  : 'bg-status-warning-light border border-status-warning/20'
              }`}>
                <p className="text-sm font-semibold">
                  {selectedProperty.occupancyRate >= 50
                    ? `✅ Ce bien génère ${formatCurrency(selectedProperty.revenueRecovered)} de revenu sur vacance`
                    : `⚠️ Potentiel d'optimisation – taux d'occupation transitoire: ${selectedProperty.occupancyRate}%`
                  }
                </p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <MiniKPI label="Revenu total" value={formatCurrency(selectedProperty.totalRevenue)} />
                <MiniKPI label="Marge nette" value={formatCurrency(selectedProperty.netMargin)} />
                <MiniKPI label="Occupation" value={`${selectedProperty.occupancyRate}%`} />
                <MiniKPI label="Durée comm." value={`${selectedProperty.daysInCommercialization}j`} />
                <MiniKPI label="Rev. mensuel moy." value={formatCurrency(selectedProperty.avgMonthlyRevenue)} />
                <MiniKPI label="Réservations" value={selectedProperty.bookingsCount.toString()} />
                <MiniKPI label="Séjour min." value={`${selectedProperty.minStayNights} nuit(s)`} />
                <MiniKPI label="Horizon" value={`${selectedProperty.rollingHorizonDays}j glissants`} />
              </div>

              {/* Comparatif vacance */}
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Comparatif vacance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Sans LCD</p>
                      <p className="text-lg font-bold text-status-error">{formatCurrency(selectedProperty.vacancyWithoutLCD)}</p>
                      <p className="text-xs text-muted-foreground">perte estimée</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avec LCD</p>
                      <p className="text-lg font-bold text-status-warning">{formatCurrency(selectedProperty.vacancyWithLCD)}</p>
                      <p className="text-xs text-muted-foreground">perte réduite</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Récupéré</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(selectedProperty.revenueRecovered)}</p>
                      <p className="text-xs text-muted-foreground">revenu gagné</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings timeline */}
              {propertyBookings.length > 0 && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Réservations transitoires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {propertyBookings.slice(0, 5).map(b => (
                        <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/20 text-sm">
                          <div>
                            <span className="font-medium">{b.guestName}</span>
                            <span className="text-muted-foreground ml-2 text-xs">
                              {new Date(b.checkIn).toLocaleDateString('fr-FR')} → {new Date(b.checkOut).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <span className="font-semibold">{formatCurrency(b.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Suspension info */}
              {selectedProperty.transitoryStatus === 'suspended' && selectedProperty.suspensionReason && (
                <Card className="mt-4 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Ban className="h-4 w-4" />
                      <span className="text-sm font-semibold">Suspendu : {SUSPENSION_LABELS[selectedProperty.suspensionReason]}</span>
                    </div>
                    {selectedProperty.suspendedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Le {new Date(selectedProperty.suspendedAt).toLocaleDateString('fr-FR')} par {selectedProperty.suspendedBy}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Export button */}
              <div className="flex justify-end mt-4">
                <Button onClick={() => handleExportPDF(selectedProperty)} className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Exporter performance commercialisation
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Sub-components ─── */

function KPICard({ title, value, subtitle, icon: Icon, trend, trendUp, highlight }: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? 'ring-1 ring-primary/20 bg-primary/5' : ''}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-muted-foreground'}`}>
            {trendUp && <ArrowUpRight className="h-3 w-3" />}
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniKPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-accent/30 p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
}

export default TransitoryDashboard;
