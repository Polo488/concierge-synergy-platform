
import React from 'react';
import { PropertyCheck } from '@/types/checkApartment';
import { ClipboardCheck, Wrench, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CheckHistoryTimelineProps {
  checks: PropertyCheck[];
}

export const CheckHistoryTimeline: React.FC<CheckHistoryTimelineProps> = ({ checks }) => {
  const sortedChecks = [...checks]
    .filter(c => c.status === 'completed')
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());

  if (sortedChecks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ClipboardCheck size={32} className="mx-auto mb-2" />
        <p className="text-sm">Aucun historique d'inspection</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border/50" />
      <div className="space-y-6">
        {sortedChecks.map((check) => {
          const scoreColor = check.healthScore >= 80 ? 'text-status-success bg-status-success/10' :
            check.healthScore >= 50 ? 'text-status-warning bg-status-warning/10' :
            'text-status-error bg-status-error/10';

          return (
            <div key={check.id} className="relative flex gap-4 pl-2">
              <div className={cn('h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 z-10', scoreColor)}>
                <ClipboardCheck size={14} />
              </div>
              <div className="glass-panel rounded-xl p-4 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm text-foreground">{check.propertyName}</p>
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', scoreColor)}>
                    {check.healthScore}/100
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {format(new Date(check.performedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })} — {check.inspectorName}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {check.issuesDetected > 0 && (
                    <span className="flex items-center gap-1">
                      <AlertTriangle size={12} className="text-status-warning" />
                      {check.issuesDetected} problème(s)
                    </span>
                  )}
                  {check.actionsCreated > 0 && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-status-success" />
                      {check.actionsCreated} action(s)
                    </span>
                  )}
                  {check.timeSpentMinutes && (
                    <span>{check.timeSpentMinutes} min</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
