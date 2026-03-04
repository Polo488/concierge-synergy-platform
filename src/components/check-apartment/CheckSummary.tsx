
import React from 'react';
import { PropertyCheck, SECTION_LABELS, InspectionSectionKey } from '@/types/checkApartment';
import { Target, AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CheckSummaryProps {
  check: PropertyCheck;
}

export const CheckSummary: React.FC<CheckSummaryProps> = ({ check }) => {
  const sectionKeys = Object.keys(check.sections) as InspectionSectionKey[];
  const issuesSections = sectionKeys.filter(k => check.sections[k].status !== 'good');
  const urgentSections = sectionKeys.filter(k => check.sections[k].status === 'urgent');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-status-success';
    if (score >= 50) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-panel rounded-2xl p-4 text-center">
          <Target size={24} className={cn('mx-auto mb-2', getScoreColor(check.healthScore))} />
          <p className={cn('text-2xl font-bold', getScoreColor(check.healthScore))}>{check.healthScore}</p>
          <p className="text-xs text-muted-foreground">Score santé</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <AlertTriangle size={24} className="mx-auto mb-2 text-status-warning" />
          <p className="text-2xl font-bold text-foreground">{check.issuesDetected}</p>
          <p className="text-xs text-muted-foreground">Problèmes</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-status-success" />
          <p className="text-2xl font-bold text-foreground">{check.actionsCreated}</p>
          <p className="text-xs text-muted-foreground">Actions créées</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <Clock size={24} className="mx-auto mb-2 text-status-info" />
          <p className="text-2xl font-bold text-foreground">{check.timeSpentMinutes || 0}</p>
          <p className="text-xs text-muted-foreground">Minutes</p>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="glass-panel rounded-2xl p-5">
        <h4 className="font-semibold mb-3 text-foreground">Résumé par section</h4>
        <div className="space-y-2">
          {sectionKeys.map((key) => {
            const section = check.sections[key];
            const statusColor =
              section.status === 'good'
                ? 'bg-status-success'
                : section.status === 'needs_attention'
                ? 'bg-status-warning'
                : 'bg-status-error';
            return (
              <div key={key} className="flex items-center gap-3 py-1.5">
                <div className={cn('h-2.5 w-2.5 rounded-full', statusColor)} />
                <span className="text-sm flex-1 text-foreground">{SECTION_LABELS[key]}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {section.status === 'good' ? 'Bon' : section.status === 'needs_attention' ? 'À surveiller' : 'Urgent'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions created */}
      {check.createdActions.length > 0 && (
        <div className="glass-panel rounded-2xl p-5">
          <h4 className="font-semibold mb-3 text-foreground">Actions créées</h4>
          <div className="space-y-2">
            {check.createdActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{SECTION_LABELS[action.sectionKey]}</p>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  action.priority === 'critical' ? 'bg-status-error/10 text-status-error' :
                  action.priority === 'high' ? 'bg-status-warning/10 text-status-warning' :
                  'bg-muted text-muted-foreground'
                )}>
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next recommended */}
      {check.nextRecommendedDate && (
        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <Calendar size={18} className="text-primary" />
          <p className="text-sm text-foreground">
            Prochaine inspection recommandée :{' '}
            <strong>{format(new Date(check.nextRecommendedDate), 'dd MMMM yyyy', { locale: fr })}</strong>
          </p>
        </div>
      )}
    </div>
  );
};
