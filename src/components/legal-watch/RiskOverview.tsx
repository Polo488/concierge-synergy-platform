import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, Loader2, Radar } from 'lucide-react';
import { RiskLevel, RiskScoreHistory } from '@/types/legalWatch';
import { cn } from '@/lib/utils';

interface RiskOverviewProps {
  globalScore: number;
  globalLevel: RiskLevel;
  distribution: Record<RiskLevel, number>;
  propertyCount: number;
  riskHistory: RiskScoreHistory[];
  isAnalyzing: boolean;
  onLaunchGlobal: () => void;
}

const LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  low: { label: 'Faible', color: 'text-emerald-600', icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  moderate: { label: 'Modéré', color: 'text-amber-600', icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-950/30' },
  high: { label: 'Élevé', color: 'text-orange-600', icon: AlertTriangle, bg: 'bg-orange-50 dark:bg-orange-950/30' },
  critical: { label: 'Critique', color: 'text-red-600', icon: XCircle, bg: 'bg-red-50 dark:bg-red-950/30' },
};

function ScoreGauge({ score, level }: { score: number; level: RiskLevel }) {
  const config = LEVEL_CONFIG[level];
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-16 overflow-hidden">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" />
          <path d="M 10 55 A 50 50 0 0 1 110 55" fill="none" stroke="currentColor"
            className={config.color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 157} 157`} />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-0">
          <span className={cn("text-2xl font-bold", config.color)}>{score}</span>
          <span className="text-xs text-muted-foreground mb-1">/100</span>
        </div>
      </div>
      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.bg, config.color)}>
        {config.label}
      </span>
    </div>
  );
}

export function RiskOverview({
  globalScore,
  globalLevel,
  distribution,
  propertyCount,
  riskHistory,
  isAnalyzing,
  onLaunchGlobal,
}: RiskOverviewProps) {
  const lastTrend = riskHistory.length >= 2
    ? riskHistory[riskHistory.length - 1].score - riskHistory[riskHistory.length - 2].score
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Global Score */}
      <Card className="border border-border/50">
        <CardContent className="p-5 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground w-full">
            <Shield className="h-4 w-4" />
            Compliance Risk Score
          </div>
          <ScoreGauge score={globalScore} level={globalLevel} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className={cn("h-3 w-3", lastTrend > 0 ? "text-red-500" : "text-emerald-500")} />
            {lastTrend > 0 ? '+' : ''}{lastTrend} pts ce mois
          </div>
        </CardContent>
      </Card>

      {/* Distribution */}
      <Card className="border border-border/50">
        <CardContent className="p-5 space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Répartition des risques</div>
          <div className="space-y-2">
            {(Object.entries(distribution) as [RiskLevel, number][]).map(([level, count]) => {
              const config = LEVEL_CONFIG[level];
              const pct = propertyCount ? Math.round((count / propertyCount) * 100) : 0;
              return (
                <div key={level} className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", config.color.replace('text-', 'bg-'))} />
                  <span className="text-xs flex-1">{config.label}</span>
                  <span className="text-xs font-medium">{count}</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", config.color.replace('text-', 'bg-'))}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground">{propertyCount} logements analysés</div>
        </CardContent>
      </Card>

      {/* Trend mini */}
      <Card className="border border-border/50">
        <CardContent className="p-5 space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Évolution du risque</div>
          <div className="flex items-end gap-1 h-16">
            {riskHistory.map((h, i) => {
              const config = LEVEL_CONFIG[h.level];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className={cn("w-full rounded-sm min-h-[4px]", config.color.replace('text-', 'bg-'))}
                    style={{ height: `${(h.score / 100) * 100}%`, opacity: 0.7 + (i / riskHistory.length) * 0.3 }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{riskHistory[0]?.date}</span>
            <span>{riskHistory[riskHistory.length - 1]?.date}</span>
          </div>
        </CardContent>
      </Card>

      {/* Launch global */}
      <Card className="border border-border/50">
        <CardContent className="p-5 flex flex-col items-center justify-center gap-3 h-full">
          <Radar className="h-8 w-8 text-primary/60" />
          <p className="text-xs text-muted-foreground text-center">
            Analysez l'ensemble du portefeuille
          </p>
          <Button onClick={onLaunchGlobal} disabled={isAnalyzing} size="sm" className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyse en cours…
              </>
            ) : (
              'Lancer une veille globale'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
