
import React from 'react';
import { PropertyCheck } from '@/types/checkApartment';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ClipboardCheck,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Target,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CheckListProps {
  checks: PropertyCheck[];
  onSelectCheck: (check: PropertyCheck) => void;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  scheduled: { label: 'Planifiée', className: 'bg-status-info/10 text-status-info' },
  in_progress: { label: 'En cours', className: 'bg-status-warning/10 text-status-warning' },
  completed: { label: 'Terminée', className: 'bg-status-success/10 text-status-success' },
};

export const CheckList: React.FC<CheckListProps> = ({ checks, onSelectCheck }) => {
  if (checks.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <ClipboardCheck size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Aucune inspection</h3>
        <p className="text-muted-foreground">Créez votre première inspection pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {checks.map((check) => {
        const statusConfig = STATUS_BADGE[check.status];
        return (
          <button
            key={check.id}
            onClick={() => onSelectCheck(check)}
            className="w-full glass-panel rounded-2xl p-5 text-left hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{check.propertyName}</h3>
                  <Badge variant="outline" className={cn('text-xs', statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{check.propertyAddress}</p>

                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {check.inspectorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {check.performedAt
                      ? format(new Date(check.performedAt), 'dd MMM yyyy', { locale: fr })
                      : check.scheduledDate
                      ? format(new Date(check.scheduledDate), 'dd MMM yyyy', { locale: fr })
                      : '—'}
                  </span>
                  {check.status === 'completed' && (
                    <>
                      <span className="flex items-center gap-1">
                        <Target size={12} />
                        Score: {check.healthScore}/100
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {check.issuesDetected} problème(s)
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {check.actionsCreated} action(s)
                      </span>
                      {check.timeSpentMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {check.timeSpentMinutes} min
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
