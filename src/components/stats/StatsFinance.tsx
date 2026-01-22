import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Euro, 
  TrendingUp, 
  TrendingDown,
  Percent,
  Bed,
  BarChart3,
  Calendar,
  HelpCircle,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface FinanceKPI {
  label: string;
  value: number;
  change?: number;
  tooltip: string;
  icon: React.ElementType;
  format: 'currency' | 'percent' | 'number';
}

interface ChannelData {
  channel: string;
  revenue: number;
  bookings: number;
  color: string;
}

interface TrendPoint {
  date: string;
  value: number;
}

interface StatsFinanceProps {
  kpis: {
    totalRevenue: number;
    totalRevenueChange: number;
    adr: number;
    adrChange: number;
    avgRevenuePerStay: number;
    avgRevenuePerStayChange: number;
    revpar: number;
    revparChange: number;
    occupancyRate: number;
    occupancyRateChange: number;
    availableNights: number;
    bookedNights: number;
    avgBookingValue: number;
    avgBookingValueChange: number;
  };
  revenueTrend: TrendPoint[];
  occupancyTrend: TrendPoint[];
  revenuePerStayTrend: TrendPoint[];
  channelData: ChannelData[];
  comparison?: {
    currentMonth: number;
    previousMonth: number;
    currentYear: number;
    previousYear: number;
  };
}

function formatCurrency(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return `${value.toFixed(1)}%`;
}

function KPICard({ kpi }: { kpi: FinanceKPI }) {
  const Icon = kpi.icon;
  const hasChange = kpi.change !== undefined && !isNaN(kpi.change);
  const isPositive = hasChange && kpi.change > 0;
  const isNegative = hasChange && kpi.change < 0;
  
  const formattedValue = kpi.format === 'currency' 
    ? formatCurrency(kpi.value)
    : kpi.format === 'percent'
    ? formatPercent(kpi.value)
    : kpi.value.toLocaleString('fr-FR');
  
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/30 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Icon className="h-4 w-4 text-orange-600" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{kpi.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {hasChange && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              isPositive && "bg-emerald-500/10 text-emerald-600",
              isNegative && "bg-red-500/10 text-red-600",
              !isPositive && !isNegative && "bg-muted text-muted-foreground"
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : null}
              {isPositive && '+'}{kpi.change.toFixed(1)}%
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight">{formattedValue}</p>
          <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const CHART_COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#eab308'];

export function StatsFinance({ 
  kpis, 
  revenueTrend, 
  occupancyTrend, 
  revenuePerStayTrend,
  channelData,
  comparison 
}: StatsFinanceProps) {
  const kpiCards: FinanceKPI[] = [
    {
      label: 'Chiffre d\'affaires total',
      value: kpis.totalRevenue,
      change: kpis.totalRevenueChange,
      tooltip: 'CA total généré sur la période sélectionnée',
      icon: Euro,
      format: 'currency'
    },
    {
      label: 'Taux moyen journalier (ADR)',
      value: kpis.adr,
      change: kpis.adrChange,
      tooltip: 'Average Daily Rate - Prix moyen par nuit vendue',
      icon: Bed,
      format: 'currency'
    },
    {
      label: 'Revenu moy. / séjour',
      value: kpis.avgRevenuePerStay,
      change: kpis.avgRevenuePerStayChange,
      tooltip: 'Revenu moyen généré par réservation',
      icon: TrendingUp,
      format: 'currency'
    },
    {
      label: 'RevPAR',
      value: kpis.revpar,
      change: kpis.revparChange,
      tooltip: 'Revenue Per Available Room = Taux occupation × ADR',
      icon: BarChart3,
      format: 'currency'
    },
    {
      label: 'Taux d\'occupation',
      value: kpis.occupancyRate,
      change: kpis.occupancyRateChange,
      tooltip: 'Pourcentage de nuits réservées sur les nuits disponibles',
      icon: Percent,
      format: 'percent'
    },
    {
      label: 'Nuits disponibles',
      value: kpis.availableNights,
      tooltip: 'Nombre total de nuits disponibles à la location',
      icon: Calendar,
      format: 'number'
    },
    {
      label: 'Nuits réservées',
      value: kpis.bookedNights,
      tooltip: 'Nombre de nuits effectivement réservées',
      icon: Moon,
      format: 'number'
    },
    {
      label: 'Valeur moy. réservation',
      value: kpis.avgBookingValue,
      change: kpis.avgBookingValueChange,
      tooltip: 'Valeur moyenne d\'une réservation',
      icon: Euro,
      format: 'currency'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <KPICard key={idx} kpi={kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Évolution du chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [formatCurrency(value), 'CA']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ fill: '#f97316', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Trend */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Évolution du taux d'occupation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Occupation']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue per Stay Trend */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Évolution du revenu moyen par séjour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenuePerStayTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}€`}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Rev/séjour']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Channel Distribution - Revenue */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Répartition du CA par canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="revenue"
                    nameKey="channel"
                    label={({ channel, percent }) => `${channel} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [formatCurrency(value), 'CA']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Channel Distribution - Bookings Bar */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Répartition des réservations par canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="channel" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false} 
                    axisLine={false}
                    width={80}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [value, 'Réservations']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="bookings" 
                    radius={[0, 4, 4, 0]}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Section */}
      {comparison && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Comparaisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Mois en cours</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(comparison.currentMonth)}</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Mois précédent</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(comparison.previousMonth)}</p>
                <p className={cn(
                  "text-xs mt-1",
                  comparison.currentMonth > comparison.previousMonth ? "text-emerald-600" : "text-red-600"
                )}>
                  {comparison.currentMonth > comparison.previousMonth ? '+' : ''}
                  {((comparison.currentMonth - comparison.previousMonth) / comparison.previousMonth * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Année N</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(comparison.currentYear)}</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Année N-1</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(comparison.previousYear)}</p>
                <p className={cn(
                  "text-xs mt-1",
                  comparison.currentYear > comparison.previousYear ? "text-emerald-600" : "text-red-600"
                )}>
                  {comparison.currentYear > comparison.previousYear ? '+' : ''}
                  {((comparison.currentYear - comparison.previousYear) / comparison.previousYear * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
