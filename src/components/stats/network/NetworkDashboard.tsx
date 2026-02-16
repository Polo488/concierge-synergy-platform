import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2, MapPin, TrendingUp, TrendingDown, Euro, Percent, BarChart3,
  AlertTriangle, Star, Users, ChevronRight, Home, ArrowLeft, Trophy,
  ThumbsUp, Clock, XCircle, Shield, Activity, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkData } from '@/hooks/useNetworkData';
import { NetworkLevel, NetworkBreadcrumb, NetworkKPIs, NetworkRegion, NetworkAgency } from '@/types/network';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, BarChart, Bar, Cell
} from 'recharts';

// --- Formatters ---
function fmtCurrency(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
}
function fmtPercent(v: number) { return `${v.toFixed(1)}%`; }
function fmtNum(v: number) { return v.toLocaleString('fr-FR'); }
function fmtHours(v: number) { return `${v.toFixed(1)}h`; }

// --- Change Badge ---
function ChangeBadge({ value, inverse = false }: { value: number; inverse?: boolean }) {
  const effective = inverse ? -value : value;
  const isPositive = effective > 0;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
      isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
    )}>
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {value > 0 && '+'}{value.toFixed(1)}%
    </span>
  );
}

// --- KPI Mini Card ---
function KPIMiniCard({ label, value, change, icon: Icon, inverse }: {
  label: string; value: string; change?: number; icon: React.ElementType; inverse?: boolean;
}) {
  return (
    <Card className="bg-card/60 border-border/30 hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          {change !== undefined && <ChangeBadge value={change} inverse={inverse} />}
        </div>
        <p className="text-2xl font-bold tracking-tight mt-2">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

// --- Agency Row ---
function AgencyRow({ agency, networkAvgOccupancy, onClick }: {
  agency: NetworkAgency; networkAvgOccupancy: number; onClick: () => void;
}) {
  const isAboveAvg = agency.kpis.occupancyRate >= networkAvgOccupancy;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
          agency.rank && agency.rank <= 10 ? "bg-amber-500/20 text-amber-700" :
          agency.rank && agency.rank > (agency.rank ?? 0) - 10 ? "bg-red-500/15 text-red-600" :
          "bg-muted text-muted-foreground"
        )}>
          #{agency.rank}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{agency.name}</p>
          <p className="text-xs text-muted-foreground">{agency.city} • {agency.kpis.activeProperties} biens</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold">{fmtCurrency(agency.kpis.grossRevenue)}</p>
          <p className={cn("text-xs", isAboveAvg ? "text-emerald-600" : "text-red-500")}>
            {fmtPercent(agency.kpis.occupancyRate)} occ.
          </p>
        </div>
        {agency.percentile && (
          <Badge variant={agency.percentile >= 70 ? "default" : agency.percentile >= 40 ? "secondary" : "destructive"} className="text-[10px]">
            Top {100 - agency.percentile}%
          </Badge>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}

// --- Region Card ---
function RegionCard({ region, onClick }: { region: NetworkRegion; onClick: () => void }) {
  return (
    <Card
      className="bg-card/60 border-border/30 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">{region.name}</h3>
            <p className="text-xs text-muted-foreground">{region.directorName} • {region.agencyCount} agences</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-lg font-bold">{fmtCurrency(region.kpis.grossRevenue)}</p>
            <p className="text-[10px] text-muted-foreground">CA brut</p>
          </div>
          <div>
            <p className="text-lg font-bold">{fmtPercent(region.kpis.occupancyRate)}</p>
            <p className="text-[10px] text-muted-foreground">Occupation</p>
          </div>
          <div>
            <p className="text-lg font-bold">{region.kpis.activeProperties}</p>
            <p className="text-[10px] text-muted-foreground">Biens</p>
          </div>
        </div>
        {region.kpis.criticalIncidents > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full w-fit">
            <AlertTriangle className="h-3 w-3" />
            {region.kpis.criticalIncidents} incidents critiques
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Agency Detail View ---
function AgencyDetailView({ agency, networkAvg }: { agency: NetworkAgency; networkAvg: number }) {
  const isAbove = agency.kpis.occupancyRate >= networkAvg;
  const position = agency.percentile ?? 50;

  return (
    <div className="space-y-6">
      {/* Benchmark Banner */}
      <Card className={cn(
        "border-l-4",
        isAbove ? "border-l-emerald-500 bg-emerald-500/5" : "border-l-red-500 bg-red-500/5"
      )}>
        <CardContent className="p-4 flex items-center gap-3">
          {isAbove ? <Trophy className="h-5 w-5 text-emerald-600" /> : <Target className="h-5 w-5 text-red-500" />}
          <div>
            <p className="font-medium text-sm">
              {isAbove
                ? `Cette agence est dans le top ${100 - position}% du réseau`
                : `Cette agence est sous la moyenne réseau`
              }
            </p>
            <p className="text-xs text-muted-foreground">
              Occupation: {fmtPercent(agency.kpis.occupancyRate)} vs moyenne réseau {fmtPercent(networkAvg)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPIMiniCard label="Biens actifs" value={fmtNum(agency.kpis.activeProperties)} icon={Building2} />
        <KPIMiniCard label="Taux d'occupation" value={fmtPercent(agency.kpis.occupancyRate)} change={agency.kpis.occupancyRateChange} icon={Percent} />
        <KPIMiniCard label="CA brut" value={fmtCurrency(agency.kpis.grossRevenue)} change={agency.kpis.grossRevenueChange} icon={Euro} />
        <KPIMiniCard label="CA net" value={fmtCurrency(agency.kpis.netRevenue)} change={agency.kpis.netRevenueChange} icon={Euro} />
        <KPIMiniCard label="Marge / bien" value={fmtCurrency(agency.kpis.marginPerProperty)} change={agency.kpis.marginPerPropertyChange} icon={BarChart3} />
        <KPIMiniCard label="RevPAR" value={fmtCurrency(agency.kpis.revpar)} change={agency.kpis.revparChange} icon={TrendingUp} />
        <KPIMiniCard label="Score qualité" value={`${agency.kpis.qualityScore.toFixed(0)}/100`} icon={Star} />
        <KPIMiniCard label="Incidents critiques" value={fmtNum(agency.kpis.criticalIncidents)} icon={AlertTriangle} />
      </div>

      {/* Satisfaction & SLA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPIMiniCard label="NPS Voyageurs" value={agency.kpis.npsGuests.toFixed(0)} icon={ThumbsUp} />
        <KPIMiniCard label="NPS Propriétaires" value={agency.kpis.npsOwners.toFixed(0)} icon={Users} />
        <KPIMiniCard label="Temps réponse moy." value={fmtHours(agency.kpis.avgResponseTime)} icon={Clock} inverse />
        <KPIMiniCard label="Taux annulation" value={fmtPercent(agency.kpis.cancellationRate)} icon={XCircle} inverse />
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
export function NetworkDashboard() {
  const { agencies, regions, nationalKPIs, monthlyTrend, getRegionAgencies, getTopAgencies, getBottomAgencies } = useNetworkData();

  const [level, setLevel] = useState<NetworkLevel>('national');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [period, setPeriod] = useState('monthly');

  const selectedRegion = regions.find(r => r.id === selectedRegionId);
  const selectedAgency = agencies.find(a => a.id === selectedAgencyId);
  const regionAgencies = selectedRegionId ? getRegionAgencies(selectedRegionId) : [];

  // Breadcrumbs
  const breadcrumbs: NetworkBreadcrumb[] = [{ level: 'national', label: 'Direction Nationale' }];
  if (level === 'regional' && selectedRegion) breadcrumbs.push({ level: 'regional', id: selectedRegion.id, label: selectedRegion.name });
  if (level === 'agency' && selectedRegion && selectedAgency) {
    breadcrumbs.push({ level: 'regional', id: selectedRegion.id, label: selectedRegion.name });
    breadcrumbs.push({ level: 'agency', id: selectedAgency.id, label: selectedAgency.name });
  }

  const navigateTo = (crumb: NetworkBreadcrumb) => {
    if (crumb.level === 'national') { setLevel('national'); setSelectedRegionId(null); setSelectedAgencyId(null); }
    else if (crumb.level === 'regional') { setLevel('regional'); setSelectedAgencyId(null); }
  };

  const drillToRegion = (regionId: string) => { setSelectedRegionId(regionId); setLevel('regional'); setSelectedAgencyId(null); };
  const drillToAgency = (agencyId: string) => { setSelectedAgencyId(agencyId); setLevel('agency'); };

  const topAgencies = getTopAgencies(10);
  const bottomAgencies = getBottomAgencies(10);

  return (
    <div className="space-y-6">
      {/* Header: Breadcrumbs + Period */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              <button
                onClick={() => navigateTo(crumb)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md transition-colors",
                  i === breadcrumbs.length - 1
                    ? "font-semibold text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {i === 0 && <Home className="h-3.5 w-3.5" />}
                {crumb.label}
              </button>
            </div>
          ))}
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensuel</SelectItem>
            <SelectItem value="quarterly">Trimestriel</SelectItem>
            <SelectItem value="yearly">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== NATIONAL LEVEL ===== */}
      {level === 'national' && (
        <div className="space-y-6">
          {/* Primary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KPIMiniCard label="Biens actifs" value={fmtNum(nationalKPIs.activeProperties)} icon={Building2} />
            <KPIMiniCard label="Agences actives" value={fmtNum(nationalKPIs.totalAgencies)} icon={MapPin} />
            <KPIMiniCard label="Taux d'occupation réseau" value={fmtPercent(nationalKPIs.occupancyRate)} change={nationalKPIs.occupancyRateChange} icon={Percent} />
            <KPIMiniCard label="CA brut total" value={fmtCurrency(nationalKPIs.grossRevenue)} change={nationalKPIs.grossRevenueChange} icon={Euro} />
            <KPIMiniCard label="RevPAR réseau" value={fmtCurrency(nationalKPIs.revpar)} change={nationalKPIs.revparChange} icon={BarChart3} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KPIMiniCard label="CA net total" value={fmtCurrency(nationalKPIs.netRevenue)} change={nationalKPIs.netRevenueChange} icon={Euro} />
            <KPIMiniCard label="Marge moy. / bien" value={fmtCurrency(nationalKPIs.marginPerProperty)} change={nationalKPIs.marginPerPropertyChange} icon={TrendingUp} />
            <KPIMiniCard label="Croissance mensuelle" value={fmtPercent(nationalKPIs.monthlyGrowth)} icon={Activity} />
            <KPIMiniCard label="Incidents critiques" value={fmtNum(nationalKPIs.criticalIncidents)} icon={AlertTriangle} />
            <KPIMiniCard label="NPS Voyageurs" value={nationalKPIs.npsGuests.toFixed(0)} icon={ThumbsUp} />
          </div>

          {/* Revenue Trend Chart */}
          <Card className="bg-card/60 border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Évolution CA mensuel réseau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M€`} />
                    <RechartsTooltip formatter={(v: number) => [fmtCurrency(v), 'CA']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regions Grid */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Performance par région
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.sort((a, b) => b.kpis.grossRevenue - a.kpis.grossRevenue).map(region => (
                <RegionCard key={region.id} region={region} onClick={() => drillToRegion(region.id)} />
              ))}
            </div>
          </div>

          {/* Top / Bottom Agencies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/60 border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" /> Top 10 Agences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {topAgencies.map(a => (
                  <AgencyRow key={a.id} agency={a} networkAvgOccupancy={nationalKPIs.occupancyRate} onClick={() => { setSelectedRegionId(a.regionId); drillToAgency(a.id); }} />
                ))}
              </CardContent>
            </Card>
            <Card className="bg-card/60 border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" /> Bottom 10 Agences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {bottomAgencies.map(a => (
                  <AgencyRow key={a.id} agency={a} networkAvgOccupancy={nationalKPIs.occupancyRate} onClick={() => { setSelectedRegionId(a.regionId); drillToAgency(a.id); }} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ===== REGIONAL LEVEL ===== */}
      {level === 'regional' && selectedRegion && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setLevel('national'); setSelectedRegionId(null); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <div>
              <h2 className="text-lg font-bold">{selectedRegion.name}</h2>
              <p className="text-xs text-muted-foreground">Directeur Coach: {selectedRegion.directorName} • {selectedRegion.agencyCount} agences • {selectedRegion.propertyCount} biens</p>
            </div>
          </div>

          {/* Region KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPIMiniCard label="Biens actifs" value={fmtNum(selectedRegion.kpis.activeProperties)} icon={Building2} />
            <KPIMiniCard label="Taux d'occupation" value={fmtPercent(selectedRegion.kpis.occupancyRate)} change={selectedRegion.kpis.occupancyRateChange} icon={Percent} />
            <KPIMiniCard label="CA brut" value={fmtCurrency(selectedRegion.kpis.grossRevenue)} change={selectedRegion.kpis.grossRevenueChange} icon={Euro} />
            <KPIMiniCard label="RevPAR" value={fmtCurrency(selectedRegion.kpis.revpar)} change={selectedRegion.kpis.revparChange} icon={BarChart3} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPIMiniCard label="NPS Voyageurs" value={selectedRegion.kpis.npsGuests.toFixed(0)} icon={ThumbsUp} />
            <KPIMiniCard label="Taux annulation" value={fmtPercent(selectedRegion.kpis.cancellationRate)} icon={XCircle} inverse />
            <KPIMiniCard label="Score qualité" value={`${selectedRegion.kpis.qualityScore.toFixed(0)}/100`} icon={Star} />
            <KPIMiniCard label="Incidents critiques" value={fmtNum(selectedRegion.kpis.criticalIncidents)} icon={AlertTriangle} />
          </div>

          {/* Agency Comparison Bar Chart */}
          <Card className="bg-card/60 border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">CA brut par agence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionAgencies.sort((a, b) => b.kpis.grossRevenue - a.kpis.grossRevenue)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k€`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={120} />
                    <RechartsTooltip formatter={(v: number) => [fmtCurrency(v), 'CA brut']} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="kpis.grossRevenue" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Agency List */}
          <Card className="bg-card/60 border-border/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Agences de la région</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {regionAgencies.sort((a, b) => b.kpis.grossRevenue - a.kpis.grossRevenue).map(a => (
                <AgencyRow key={a.id} agency={a} networkAvgOccupancy={nationalKPIs.occupancyRate} onClick={() => drillToAgency(a.id)} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== AGENCY LEVEL ===== */}
      {level === 'agency' && selectedAgency && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setLevel('regional'); setSelectedAgencyId(null); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Retour
            </Button>
            <div>
              <h2 className="text-lg font-bold">{selectedAgency.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedAgency.city} • Responsable: {selectedAgency.managerName} • {selectedAgency.propertyCount} biens</p>
            </div>
          </div>
          <AgencyDetailView agency={selectedAgency} networkAvg={nationalKPIs.occupancyRate} />
        </div>
      )}
    </div>
  );
}
