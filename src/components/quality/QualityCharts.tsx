import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { RatingDistribution, TrendDataPoint, IssueFrequency } from '@/types/quality';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface QualityChartsProps {
  ratingDistribution: RatingDistribution[];
  ratingTrend: TrendDataPoint[];
  repasseTrend: TrendDataPoint[];
  issueFrequency: IssueFrequency[];
}

// Palette iOS-like cohérente avec le système (orange Noé + teintes status)
const RATING_COLORS = [
  'hsl(var(--status-error))',
  'hsl(var(--status-warning))',
  'hsl(var(--ios-yellow))',
  'hsl(var(--status-success))',
  'hsl(var(--status-success))',
];

const ISSUE_COLORS = [
  'hsl(var(--ios-orange))',
  'hsl(var(--ios-blue))',
  'hsl(var(--status-pending))',
  'hsl(var(--ios-yellow))',
  'hsl(var(--status-success))',
  'hsl(var(--status-warning))',
  'hsl(var(--status-error))',
  'hsl(var(--status-info))',
];

const tagLabels: Record<string, string> = {
  dust: 'Poussière',
  bathroom: 'Salle de bain',
  linen: 'Linge',
  kitchen: 'Cuisine',
  smell: 'Odeur',
  floors: 'Sols',
  missing_items: 'Objets manquants',
  windows: 'Fenêtres',
  appliances: 'Électroménager',
  general: 'Général',
};

const tooltipStyle: React.CSSProperties = {
  background: 'hsl(var(--surface-1) / 0.96)',
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
  border: '1px solid hsl(var(--hairline) / 0.72)',
  borderRadius: 12,
  boxShadow: '0 10px 24px -18px hsl(var(--label-1) / 0.28)',
  fontSize: 12,
  padding: '8px 12px',
  color: 'hsl(var(--label-1))',
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-surface rounded-[22px] p-4 md:p-5 overflow-hidden">
      <div className="mb-3 md:mb-4">
        <h3 className="text-[15px] md:text-[16px] font-semibold tracking-normal text-[hsl(var(--label-1))]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[12px] text-[hsl(var(--label-2)/0.68)] mt-0.5 tracking-normal">{subtitle}</p>
        )}
      </div>
      <div className="h-[240px] md:h-[260px]">{children}</div>
    </div>
  );
}

export function QualityCharts({
  ratingDistribution,
  ratingTrend,
  repasseTrend,
  issueFrequency,
}: QualityChartsProps) {
  const formattedRatingTrend = ratingTrend.slice(-14).map((point) => ({
    ...point,
    formattedDate: format(parseISO(point.date), 'dd/MM', { locale: fr }),
  }));

  const formattedRepasseTrend = repasseTrend.slice(-14).map((point) => ({
    ...point,
    formattedDate: format(parseISO(point.date), 'dd/MM', { locale: fr }),
  }));

  const axisTick = { fontSize: 11, fill: 'hsl(var(--label-2) / 0.58)' };
  const grid = 'hsl(var(--separator) / 0.68)';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
      <ChartCard title="Évolution des notes" subtitle="14 derniers jours">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedRatingTrend} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="formattedDate" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis domain={[1, 5]} tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [value.toFixed(2), 'Note']}
              labelFormatter={(label) => `${label}`}
              contentStyle={tooltipStyle}
              cursor={{ stroke: 'hsl(var(--ios-orange) / 0.2)', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--ios-orange))"
              strokeWidth={2.5}
              dot={{ fill: 'hsl(var(--ios-orange))', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Distribution des notes" subtitle="Répartition globale">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ratingDistribution} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis
              dataKey="rating"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}★`}
            />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [value, 'Nombre']}
              labelFormatter={(label) => `Note ${label}★`}
              contentStyle={tooltipStyle}
              cursor={{ fill: 'hsl(var(--ios-orange) / 0.06)' }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {ratingDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={RATING_COLORS[entry.rating - 1]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Taux de repasse" subtitle="14 derniers jours">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedRepasseTrend} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="formattedDate" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taux']}
              contentStyle={tooltipStyle}
              cursor={{ stroke: 'hsl(var(--status-error) / 0.2)', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--status-error))"
              strokeWidth={2.5}
              dot={{ fill: 'hsl(var(--status-error))', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Problèmes fréquents" subtitle="Top des signalements">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={issueFrequency.slice(0, 8).map((issue) => ({
                ...issue,
                name: tagLabels[issue.tag] || issue.tag,
              }))}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={88}
              paddingAngle={3}
              dataKey="count"
              nameKey="name"
              stroke="hsl(var(--card))"
              strokeWidth={2}
              label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
              labelLine={false}
            >
              {issueFrequency.slice(0, 8).map((_, index) => (
                <Cell key={`cell-${index}`} fill={ISSUE_COLORS[index % ISSUE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              contentStyle={tooltipStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
