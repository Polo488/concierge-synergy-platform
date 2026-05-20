import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Star, TrendingUp, CheckCircle2, Flame, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';


const SCORE_HISTORY = [
  { month: 'Nov', score: 4.4 },
  { month: 'Déc', score: 4.5 },
  { month: 'Jan', score: 4.6 },
  { month: 'Fév', score: 4.7 },
  { month: 'Mar', score: 4.6 },
  { month: 'Avr', score: 4.8 },
  { month: 'Mai', score: 4.85 },
];

const RECENT_RATINGS = [
  { property: 'Maison 23 Rue de la Paix', date: '2026-05-08', rating: 5, comment: 'Impeccable, merci !' },
  { property: 'Appartement 12 Rue du Port', date: '2026-05-06', rating: 5, comment: '' },
  { property: 'Studio 8 Avenue des Fleurs', date: '2026-05-04', rating: 4, comment: 'Bien, à part les vitres.' },
  { property: 'Loft 72 Rue des Arts', date: '2026-05-02', rating: 5, comment: '' },
];

const CleaningPerformance = () => {
  useEffect(() => { document.title = 'Performance'; }, []);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Performance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Vos notes, métriques et évolution.</p>
      </header>

      {/* Score principal */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Star className="h-8 w-8 text-primary fill-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Note moyenne</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black tabular-nums">4,85</span>
              <span className="text-lg text-muted-foreground">/ 5</span>
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[hsl(142,76%,36%)]">
                <TrendingUp className="h-3 w-3" /> +0,15
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Sur 64 ménages notés ces 6 derniers mois</p>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Kpi icon={<CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)]" />} label="Validés à temps" value="98%" />
        <Kpi icon={<Clock className="h-4 w-4 text-[hsl(45,93%,55%)]" />} label="Retards" value="2" />
        <Kpi icon={<Flame className="h-4 w-4 text-primary" />} label="Check-in J réussis" value="100%" />
      </div>

      {/* Évolution */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-[15px] font-bold mb-3">Évolution sur 6 mois</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SCORE_HISTORY}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis domain={[3.5, 5]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Notes récentes */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-[15px] font-bold mb-3">Notes récentes</h2>
          <div className="space-y-2">
            {RECENT_RATINGS.map((r, i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold truncate">{r.property}</p>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-[hsl(45,93%,55%)] text-[hsl(45,93%,55%)]' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{r.date}</p>
                {r.comment && <p className="text-[12px] text-foreground mt-1.5 italic">"{r.comment}"</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparatif */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Comparatif anonymisé</p>
          <p className="text-[13px]">
            Vous êtes <strong className="text-primary">au-dessus de la moyenne flotte</strong> (4,85 vs 4,52).
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const Kpi = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Card>
    <CardContent className="pt-4 pb-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <p className="text-[11px] uppercase font-semibold tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-black tabular-nums mt-1">{value}</p>
    </CardContent>
  </Card>
);

export default CleaningPerformance;
