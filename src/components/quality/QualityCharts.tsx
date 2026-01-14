
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
const ISSUE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

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

export function QualityCharts({
  ratingDistribution,
  ratingTrend,
  repasseTrend,
  issueFrequency,
}: QualityChartsProps) {
  // Format trend data
  const formattedRatingTrend = ratingTrend.slice(-14).map(point => ({
    ...point,
    formattedDate: format(parseISO(point.date), 'dd/MM', { locale: fr }),
  }));

  const formattedRepasseTrend = repasseTrend.slice(-14).map(point => ({
    ...point,
    formattedDate: format(parseISO(point.date), 'dd/MM', { locale: fr }),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rating Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Évolution des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedRatingTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }} 
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[1, 5]} 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  formatter={(value: number) => [value.toFixed(2), 'Note']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Distribution des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="rating" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}★`}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [value, 'Nombre']}
                  labelFormatter={(label) => `Note: ${label}★`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.rating - 1]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Repasse Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Taux de repasse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedRepasseTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taux']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Issue Frequency */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Problèmes fréquents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueFrequency.slice(0, 8).map(issue => ({
                    ...issue,
                    name: tagLabels[issue.tag] || issue.tag,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
                  labelLine={false}
                >
                  {issueFrequency.slice(0, 8).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={ISSUE_COLORS[index % ISSUE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [value, name]}
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
    </div>
  );
}
