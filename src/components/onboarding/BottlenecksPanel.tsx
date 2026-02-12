
import { OnboardingKPIs, OnboardingProcess } from '@/types/onboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottlenecksPanelProps {
  kpis: OnboardingKPIs;
  processes: OnboardingProcess[];
}

export function BottlenecksPanel({ kpis, processes }: BottlenecksPanelProps) {
  // Compute avg days per step from real data
  const stepStats = kpis.avgDaysPerStep.map(s => ({
    ...s,
    isBottleneck: s.avgDays >= 5,
  })).sort((a, b) => b.avgDays - a.avgDays);

  const maxDays = Math.max(...stepStats.map(s => s.avgDays), 1);

  // Compute per-assignee stats
  const assigneeMap = new Map<string, { total: number; count: number; blocked: number }>();
  processes.forEach(p => {
    const name = p.assignedToName;
    if (!assigneeMap.has(name)) assigneeMap.set(name, { total: 0, count: 0, blocked: 0 });
    const entry = assigneeMap.get(name)!;
    entry.total += p.totalDays || 0;
    entry.count += 1;
    if (p.status === 'blocked') entry.blocked += 1;
  });

  const assigneeStats = Array.from(assigneeMap.entries())
    .map(([name, data]) => ({
      name,
      avgDays: data.count > 0 ? Math.round(data.total / data.count) : 0,
      count: data.count,
      blocked: data.blocked,
    }))
    .sort((a, b) => b.avgDays - a.avgDays);

  const maxAssigneeDays = Math.max(...assigneeStats.map(a => a.avgDays), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Step bottlenecks */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            Durée moyenne par étape
          </CardTitle>
          <p className="text-xs text-muted-foreground">Les étapes les plus longues freinent vos onboardings</p>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {stepStats.map((step, i) => {
            const pct = (step.avgDays / maxDays) * 100;
            return (
              <div key={step.stepTitle} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground truncate max-w-[200px]">
                    {step.stepTitle}
                  </span>
                  <div className="flex items-center gap-2">
                    {step.isBottleneck && (
                      <Badge variant="outline" className="text-[9px] py-0 h-4 bg-amber-500/10 text-amber-600 border-amber-200">
                        <TrendingDown size={8} className="mr-0.5" />Lent
                      </Badge>
                    )}
                    <span className={cn(
                      "text-xs font-bold tabular-nums",
                      step.isBottleneck ? "text-amber-600" : "text-foreground"
                    )}>
                      {step.avgDays}j
                    </span>
                  </div>
                </div>
                <div className="h-5 bg-muted/50 rounded-md overflow-hidden relative">
                  <div
                    className={cn(
                      "h-full rounded-md transition-all duration-500",
                      step.isBottleneck
                        ? "bg-gradient-to-r from-amber-400/80 to-amber-500/80"
                        : i < 2 ? "bg-gradient-to-r from-blue-400/60 to-blue-500/60"
                        : "bg-gradient-to-r from-emerald-400/50 to-emerald-500/50"
                    )}
                    style={{ width: `${Math.max(pct, 8)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center pl-2 text-[10px] font-medium text-foreground">
                    {step.stepTitle}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Assignee performance */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User size={15} className="text-primary" />
            Performance par responsable
          </CardTitle>
          <p className="text-xs text-muted-foreground">Durée moyenne d'onboarding et nombre de dossiers</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {assigneeStats.map(assignee => {
            const pct = (assignee.avgDays / maxAssigneeDays) * 100;
            return (
              <div key={assignee.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {assignee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{assignee.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {assignee.count} dossier{assignee.count > 1 ? 's' : ''}
                        {assignee.blocked > 0 && (
                          <span className="text-amber-500 ml-1">• {assignee.blocked} bloqué{assignee.blocked > 1 ? 's' : ''}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground tabular-nums">{assignee.avgDays}j</span>
                    <span className="text-[10px] text-muted-foreground">moy.</span>
                  </div>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary/80 transition-all duration-500"
                    style={{ width: `${Math.max(pct, 8)}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Summary */}
          {kpis.bottlenecks.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-200/50 space-y-1.5">
              <p className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
                <AlertTriangle size={12} />
                Top goulots identifiés
              </p>
              {kpis.bottlenecks.slice(0, 3).map(b => (
                <div key={b.stepTitle} className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{b.stepTitle}</span>
                  <span className="text-amber-600 font-medium">{b.avgDays}j moy. ({b.count} cas)</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
