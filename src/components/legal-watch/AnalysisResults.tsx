import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  BookOpen,
  Gavel,
  Eye,
  Loader2,
  FileText,
} from 'lucide-react';
import { WatchAnalysis, RiskLevel } from '@/types/legalWatch';
import { cn } from '@/lib/utils';

interface Props {
  analyses: WatchAnalysis[];
  isAnalyzing: boolean;
}

const LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string; icon: React.ElementType }> = {
  low: { label: 'Faible', color: 'text-emerald-600', icon: CheckCircle },
  moderate: { label: 'Modéré', color: 'text-amber-600', icon: AlertTriangle },
  high: { label: 'Élevé', color: 'text-orange-600', icon: AlertTriangle },
  critical: { label: 'Critique', color: 'text-red-600', icon: XCircle },
};

const IMPACT_ICON = {
  positive: { icon: TrendingDown, color: 'text-emerald-600', label: 'Positif' },
  neutral: { icon: Minus, color: 'text-muted-foreground', label: 'Neutre' },
  negative: { icon: TrendingUp, color: 'text-red-600', label: 'Négatif' },
};

export function AnalysisResults({ analyses, isAnalyzing }: Props) {
  if (isAnalyzing) {
    return (
      <Card className="border border-border/50">
        <CardContent className="p-12 flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <p className="font-medium">Analyse en cours…</p>
            <p className="text-sm text-muted-foreground mt-1">
              Recherche dans les sources juridiques, jurisprudence et annonces locales
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyses.length) {
    return (
      <Card className="border border-border/50">
        <CardContent className="p-12 flex flex-col items-center gap-4 text-muted-foreground">
          <FileText className="h-10 w-10" />
          <p className="text-sm">Aucune analyse disponible. Lancez une veille depuis la carte ou le bouton global.</p>
        </CardContent>
      </Card>
    );
  }

  const latest = analyses[0];
  const config = LEVEL_CONFIG[latest.riskLevel];
  const LevelIcon = config.icon;

  return (
    <div className="space-y-4">
      {/* Latest analysis */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {latest.scopeLabel}
            </CardTitle>
            <div className="flex items-center gap-2">
              <LevelIcon className={cn("h-4 w-4", config.color)} />
              <span className={cn("text-lg font-bold", config.color)}>{latest.riskScore}/100</span>
              <Badge variant="outline" className={cn("text-xs", config.color)}>
                Risque {config.label.toLowerCase()}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(latest.date).toLocaleDateString('fr-FR', { dateStyle: 'full' })}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Summary */}
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-sm leading-relaxed">{latest.summary}</p>
          </div>

          {/* Pressure indicator */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Pression réglementaire :</span>
            <Badge className={cn("capitalize", {
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400': latest.context.pressure === 'faible',
              'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400': latest.context.pressure === 'modérée',
              'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400': latest.context.pressure === 'élevée',
              'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400': latest.context.pressure === 'critique',
            })}>
              {latest.context.pressure}
            </Badge>
          </div>

          <Separator />

          {/* Regulatory changes */}
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary/60" />
              Évolutions réglementaires récentes
            </h3>
            <div className="space-y-3">
              {latest.context.recentChanges.map((change) => {
                const impact = IMPACT_ICON[change.impact];
                const ImpactIcon = impact.icon;
                return (
                  <div key={change.id} className="border border-border/50 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{change.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{change.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <ImpactIcon className={cn("h-3.5 w-3.5", impact.color)} />
                        <span className={cn("text-xs", impact.color)}>{impact.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{change.date}</span>
                      <span>·</span>
                      <span>{change.source}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Jurisprudence */}
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <Gavel className="h-4 w-4 text-primary/60" />
              Jurisprudence notable
            </h3>
            <div className="space-y-3">
              {latest.context.jurisprudence.map((j) => (
                <div key={j.id} className="border border-border/50 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{j.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{j.summary}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-xs flex-shrink-0", {
                      'border-red-300 text-red-600': j.relevance === 'high',
                      'border-amber-300 text-amber-600': j.relevance === 'medium',
                      'border-muted text-muted-foreground': j.relevance === 'low',
                    })}>
                      {j.relevance === 'high' ? 'Forte' : j.relevance === 'medium' ? 'Moyenne' : 'Faible'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{j.date}</span>
                    <span>·</span>
                    <span>{j.court}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Weak signals */}
          <div>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-primary/60" />
              Signaux faibles
            </h3>
            <ul className="space-y-1.5">
              {latest.context.weakSignals.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary/40 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-medium mb-3">Recommandations</h3>
            <div className="space-y-2">
              {latest.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 bg-primary/5 rounded-lg p-3">
                  <span className="text-primary font-bold text-sm">{i + 1}.</span>
                  <span className="text-sm">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
