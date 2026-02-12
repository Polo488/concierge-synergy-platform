import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, TrendingUp } from 'lucide-react';
import { WatchAnalysis, RiskLevel, RiskScoreHistory } from '@/types/legalWatch';
import { cn } from '@/lib/utils';

interface Props {
  analyses: WatchAnalysis[];
  riskHistory: RiskScoreHistory[];
}

const LEVEL_COLORS: Record<RiskLevel, string> = {
  low: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
  moderate: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
  high: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
  critical: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
};

const LEVEL_LABELS: Record<RiskLevel, string> = {
  low: 'Faible',
  moderate: 'Modéré',
  high: 'Élevé',
  critical: 'Critique',
};

export function WatchHistory({ analyses, riskHistory }: Props) {
  return (
    <div className="space-y-4">
      {/* Evolution chart */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Évolution du Risk Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {riskHistory.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium">{h.score}</span>
                <div
                  className={cn("w-full rounded-t-md", LEVEL_COLORS[h.level].split(' ')[0].replace('text-', 'bg-'))}
                  style={{ height: `${h.score}%`, minHeight: 4 }}
                />
                <span className="text-[9px] text-muted-foreground">{h.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis history */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique des analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune analyse dans l'historique. Lancez votre première veille.
            </p>
          ) : (
            <div className="space-y-3">
              {analyses.map((a) => (
                <div key={a.id} className="border border-border/50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{a.scopeLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.date).toLocaleDateString('fr-FR', { dateStyle: 'medium' })} — {a.scope.type === 'global' ? 'Global' : a.scope.type === 'city' ? 'Ville' : 'Logement'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-lg font-bold", LEVEL_COLORS[a.riskLevel].split(' ')[0])}>
                      {a.riskScore}
                    </span>
                    <Badge variant="outline" className={cn("text-xs", LEVEL_COLORS[a.riskLevel])}>
                      {LEVEL_LABELS[a.riskLevel]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
